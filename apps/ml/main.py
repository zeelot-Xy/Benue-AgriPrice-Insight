from fastapi import FastAPI

from forecasting import generate_forecast, get_service_status
from schemas import ForecastRequest


app = FastAPI(title="BAPI Forecast Service", version="0.2.0")


@app.get("/health")
def health() -> dict[str, object]:
    return get_service_status()


@app.get("/")
def root() -> dict[str, object]:
    status = get_service_status()
    return {
        "name": "BAPI Forecast Service",
        "phase": 8,
        "message": "Prophet-based forecasting is available when ML dependencies are installed correctly.",
        "forecasting_enabled": status["forecasting_enabled"],
        "dependencyIssues": status["dependencyIssues"],
    }


@app.post("/forecast")
def forecast(request: ForecastRequest) -> dict[str, object]:
    return generate_forecast(request)
