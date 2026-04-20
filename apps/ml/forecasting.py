from __future__ import annotations

from datetime import UTC, datetime
from math import isfinite

try:
    import pandas as pd
except Exception as exc:  # pragma: no cover - import guard for local setup
    pd = None
    PANDAS_IMPORT_ERROR = str(exc)
else:
    PANDAS_IMPORT_ERROR = None

try:
    from prophet import Prophet
except Exception as exc:  # pragma: no cover - import guard for local setup
    Prophet = None
    PROPHET_IMPORT_ERROR = str(exc)
else:
    PROPHET_IMPORT_ERROR = None

from schemas import ForecastRequest

MIN_OBSERVATIONS = 4


def _utc_now_iso() -> str:
    return datetime.now(UTC).replace(microsecond=0).isoformat().replace("+00:00", "Z")


def _dependency_messages() -> list[str]:
    messages: list[str] = []

    if PANDAS_IMPORT_ERROR:
        messages.append(f"pandas import failed: {PANDAS_IMPORT_ERROR}")

    if PROPHET_IMPORT_ERROR:
        messages.append(f"Prophet import failed: {PROPHET_IMPORT_ERROR}")

    return messages


def _status_payload() -> dict[str, object]:
    issues = _dependency_messages()

    return {
        "service": "bapi-ml",
        "status": "ok" if not issues else "degraded",
        "model_name": "Prophet",
        "forecasting_enabled": not issues,
        "dependencyIssues": issues,
        "timestamp": _utc_now_iso(),
    }


def _build_history_frame(request: ForecastRequest):
    if pd is None:
        raise RuntimeError("pandas is not available.")

    rows = [
        {"ds": point.price_date.isoformat(), "y": point.price}
        for point in request.history
    ]
    frame = pd.DataFrame(rows)
    frame["ds"] = pd.to_datetime(frame["ds"], utc=True)
    frame = frame.sort_values("ds").drop_duplicates(subset="ds", keep="last")
    frame["y"] = frame["y"].astype(float)

    return frame


def _calculate_metrics(actuals: list[float], predictions: list[float]) -> dict[str, float | None]:
    if not actuals or not predictions or len(actuals) != len(predictions):
        return {"mae": None, "mape": None}

    absolute_errors = [abs(actual - predicted) for actual, predicted in zip(actuals, predictions)]
    mae = sum(absolute_errors) / len(absolute_errors)

    valid_percentage_errors = [
        abs((actual - predicted) / actual) * 100
        for actual, predicted in zip(actuals, predictions)
        if actual != 0
    ]
    mape = (
        sum(valid_percentage_errors) / len(valid_percentage_errors)
        if valid_percentage_errors
        else None
    )

    return {
        "mae": round(mae, 2),
        "mape": round(mape, 2) if mape is not None and isfinite(mape) else None,
    }


def _confidence_label(observation_count: int, mape: float | None) -> str:
    if observation_count < 6:
        return "LOW"

    if mape is None:
        return "MEDIUM"

    if mape <= 10:
        return "HIGH"

    if mape <= 20:
        return "MEDIUM"

    return "LOW"


def _build_explanation(
    request: ForecastRequest,
    observation_count: int,
    latest_price: float,
    latest_date: str,
    final_forecast_price: float,
    final_forecast_date: str,
    yearly_seasonality: bool,
    confidence_label: str,
) -> str:
    direction = "increase" if final_forecast_price > latest_price else "decrease" if final_forecast_price < latest_price else "remain stable"
    seasonality_note = (
        "Yearly seasonality was enabled because the series is long enough to support seasonal learning."
        if yearly_seasonality
        else "Yearly seasonality was disabled because the available history is too short for a reliable annual seasonal pattern."
    )

    return (
        f"The Prophet model used {observation_count} observed weekly price record(s) for "
        f"{request.commodity_name} in {request.market_name}. The latest observed price was "
        f"{latest_price:.2f} {request.unit} on {latest_date}. Over the next {request.horizon_weeks} week(s), "
        f"the model projects the price to {direction}, reaching about {final_forecast_price:.2f} {request.unit} by "
        f"{final_forecast_date}. {seasonality_note} Confidence is rated {confidence_label.lower()} based on the amount "
        f"of available history and simple holdout validation."
    )


def get_service_status() -> dict[str, object]:
    return _status_payload()


def generate_forecast(request: ForecastRequest) -> dict[str, object]:
    issues = _dependency_messages()

    if issues:
        return {
            **_status_payload(),
            "status": "UNAVAILABLE",
            "explanation": "Forecasting dependencies are not fully installed, so the ML service cannot produce Prophet forecasts yet.",
            "warnings": issues,
        }

    history_frame = _build_history_frame(request)
    observation_count = len(history_frame.index)

    if observation_count < MIN_OBSERVATIONS:
        return {
            **_status_payload(),
            "status": "INSUFFICIENT_DATA",
            "explanation": f"At least {MIN_OBSERVATIONS} weekly observations are required to generate a defendable forecast.",
            "warnings": [
                f"Only {observation_count} valid observation(s) were supplied after sorting and duplicate removal.",
            ],
        }

    warnings: list[str] = []
    interval_days = history_frame["ds"].diff().dropna().dt.days.tolist()
    if any(interval != 7 for interval in interval_days):
        warnings.append(
            "The historical series is not perfectly weekly. Forecasting still ran, but irregular intervals may reduce reliability."
        )

    yearly_seasonality = observation_count >= 26

    model = Prophet(
        daily_seasonality=False,
        weekly_seasonality=False,
        yearly_seasonality=yearly_seasonality,
        changepoint_prior_scale=0.15,
        seasonality_mode="additive",
    )
    model.fit(history_frame)

    future_dates = pd.date_range(
        start=history_frame["ds"].iloc[-1] + pd.Timedelta(days=7),
        periods=request.horizon_weeks,
        freq="7D",
        tz="UTC",
    )
    future_frame = pd.DataFrame({"ds": future_dates})
    prediction = model.predict(future_frame)

    holdout_size = 2 if observation_count >= 8 else 1
    validation_metrics = {"mae": None, "mape": None}

    if observation_count > holdout_size:
        train_frame = history_frame.iloc[:-holdout_size]
        validation_frame = history_frame.iloc[-holdout_size:]
        validation_model = Prophet(
            daily_seasonality=False,
            weekly_seasonality=False,
            yearly_seasonality=len(train_frame.index) >= 26,
            changepoint_prior_scale=0.15,
            seasonality_mode="additive",
        )
        validation_model.fit(train_frame)
        validation_prediction = validation_model.predict(validation_frame[["ds"]])
        validation_metrics = _calculate_metrics(
            validation_frame["y"].tolist(),
            validation_prediction["yhat"].tolist(),
        )

    confidence_label = _confidence_label(observation_count, validation_metrics["mape"])
    if observation_count < 8:
        warnings.append(
            "Fewer than eight observations were available, so the forecast should be treated as a short-term academic demonstration rather than a strong operational forecast."
        )

    latest_price = float(history_frame["y"].iloc[-1])
    latest_date = history_frame["ds"].iloc[-1].strftime("%Y-%m-%d")
    forecast_points = [
        {
            "price_date": row.ds.strftime("%Y-%m-%d"),
            "predicted_price": round(float(row.yhat), 2),
            "lower_bound": round(float(row.yhat_lower), 2),
            "upper_bound": round(float(row.yhat_upper), 2),
        }
        for row in prediction.itertuples(index=False)
    ]
    final_point = forecast_points[-1]

    return {
        **_status_payload(),
        "status": "OK",
        "forecast_generated_at": _utc_now_iso(),
        "horizon_weeks": request.horizon_weeks,
        "history_summary": {
            "observation_count": observation_count,
            "first_date": history_frame["ds"].iloc[0].strftime("%Y-%m-%d"),
            "latest_date": latest_date,
            "latest_price": round(latest_price, 2),
            "unit": request.unit,
        },
        "model_config": {
            "model_name": "Prophet",
            "yearly_seasonality_enabled": yearly_seasonality,
            "changepoint_prior_scale": 0.15,
        },
        "performance": {
            **validation_metrics,
            "confidence_label": confidence_label,
            "validation_method": "simple_holdout",
        },
        "forecast": forecast_points,
        "warnings": warnings,
        "explanation": _build_explanation(
            request=request,
            observation_count=observation_count,
            latest_price=latest_price,
            latest_date=latest_date,
            final_forecast_price=float(final_point["predicted_price"]),
            final_forecast_date=str(final_point["price_date"]),
            yearly_seasonality=yearly_seasonality,
            confidence_label=confidence_label,
        ),
    }
