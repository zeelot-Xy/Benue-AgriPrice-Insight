import { HttpError } from "../../lib/http-error.js";
import { prisma } from "../../lib/prisma.js";
import { env } from "../../config/env.js";
import { toDateOnly } from "../../utils/date.js";

const MIN_FORECAST_OBSERVATIONS = 4;

type GenerateForecastInput = {
  marketId: number;
  commodityId: number;
  horizonWeeks: number;
};

type ForecastHistoryInput = {
  marketId?: number;
  commodityId?: number;
  limit: number;
};

type MlForecastResponse = {
  status: "OK" | "INSUFFICIENT_DATA" | "UNAVAILABLE";
  service: string;
  forecasting_enabled: boolean;
  dependencyIssues: string[];
  model_name: string;
  timestamp: string;
  forecast_generated_at?: string;
  horizon_weeks?: number;
  history_summary?: {
    observation_count: number;
    first_date: string;
    latest_date: string;
    latest_price: number;
    unit: string;
  };
  model_config?: {
    model_name: string;
    yearly_seasonality_enabled: boolean;
    changepoint_prior_scale: number;
  };
  performance?: {
    mae: number | null;
    mape: number | null;
    confidence_label: string;
    validation_method: string;
  };
  forecast?: Array<{
    price_date: string;
    predicted_price: number;
    lower_bound: number;
    upper_bound: number;
  }>;
  warnings?: string[];
  explanation: string;
};

function classifyProjectedDirection(projectedPrice: number, latestPrice: number) {
  if (projectedPrice > latestPrice) {
    return "UPWARD";
  }

  if (projectedPrice < latestPrice) {
    return "DOWNWARD";
  }

  return "STABLE";
}

async function callMlForecastService(payload: Record<string, unknown>) {
  const response = await fetch(`${env.ML_SERVICE_BASE_URL}/forecast`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
    signal: AbortSignal.timeout(env.ML_FORECAST_TIMEOUT_MS),
  });

  if (!response.ok) {
    throw new Error(`ML service responded with status ${response.status}.`);
  }

  return (await response.json()) as MlForecastResponse;
}

export const forecastsService = {
  async generate(input: GenerateForecastInput) {
    const [market, commodity, priceRecords] = await Promise.all([
      prisma.market.findUnique({
        where: { id: input.marketId },
      }),
      prisma.commodity.findUnique({
        where: { id: input.commodityId },
      }),
      prisma.priceRecord.findMany({
        where: {
          marketId: input.marketId,
          commodityId: input.commodityId,
        },
        orderBy: {
          priceDate: "asc",
        },
      }),
    ]);

    if (!market) {
      throw new HttpError(404, "Market not found for forecasting.");
    }

    if (!commodity) {
      throw new HttpError(404, "Commodity not found for forecasting.");
    }

    if (priceRecords.length < MIN_FORECAST_OBSERVATIONS) {
      return {
        status: "INSUFFICIENT_DATA",
        market: {
          id: market.id,
          code: market.code,
          name: market.name,
        },
        commodity: {
          id: commodity.id,
          slug: commodity.slug,
          name: commodity.name,
        },
        horizonWeeks: input.horizonWeeks,
        explanation: `Forecasting requires at least ${MIN_FORECAST_OBSERVATIONS} weekly observations for ${commodity.name} in ${market.name}, but only ${priceRecords.length} record(s) are available.`,
        warnings: [
          "Add more weekly price records before relying on forecasting for this market and commodity pair.",
        ],
      };
    }

    const payload = {
      market_id: market.id,
      market_name: market.name,
      commodity_id: commodity.id,
      commodity_name: commodity.name,
      unit: priceRecords[priceRecords.length - 1]!.unit,
      horizon_weeks: input.horizonWeeks,
      history: priceRecords.map((record) => ({
        price_date: toDateOnly(record.priceDate),
        price: Number(record.price),
      })),
    };

    let mlResult: MlForecastResponse;

    try {
      mlResult = await callMlForecastService(payload);
    } catch {
      return {
        status: "SERVICE_UNAVAILABLE",
        market: {
          id: market.id,
          code: market.code,
          name: market.name,
        },
        commodity: {
          id: commodity.id,
          slug: commodity.slug,
          name: commodity.name,
        },
        horizonWeeks: input.horizonWeeks,
        explanation:
          "The forecasting microservice is currently unavailable. Start the FastAPI ML service and install its Python dependencies before requesting forecasts.",
        warnings: [
          `Expected ML service base URL: ${env.ML_SERVICE_BASE_URL}`,
        ],
      };
    }

    if (mlResult.status !== "OK" || !mlResult.forecast?.length || !mlResult.history_summary) {
      return {
        status: mlResult.status,
        market: {
          id: market.id,
          code: market.code,
          name: market.name,
        },
        commodity: {
          id: commodity.id,
          slug: commodity.slug,
          name: commodity.name,
        },
        horizonWeeks: input.horizonWeeks,
        explanation: mlResult.explanation,
        warnings: mlResult.warnings ?? mlResult.dependencyIssues ?? [],
        service: {
          forecastingEnabled: mlResult.forecasting_enabled,
          dependencyIssues: mlResult.dependencyIssues,
        },
      };
    }

    const latestObservedPrice = mlResult.history_summary.latest_price;
    const finalForecast = mlResult.forecast[mlResult.forecast.length - 1]!;
    const projectedDirection = classifyProjectedDirection(
      finalForecast.predicted_price,
      latestObservedPrice,
    );
    const projectedChangePercent =
      latestObservedPrice === 0
        ? 0
        : Number(
            (
              ((finalForecast.predicted_price - latestObservedPrice) /
                latestObservedPrice) *
              100
            ).toFixed(2),
          );

    const forecastRun = await prisma.forecastRun.create({
      data: {
        marketId: market.id,
        commodityId: commodity.id,
        modelName: mlResult.model_config?.model_name ?? mlResult.model_name,
        horizonWeeks: input.horizonWeeks,
        inputSummary: {
          observationCount: mlResult.history_summary.observation_count,
          firstDate: mlResult.history_summary.first_date,
          latestDate: mlResult.history_summary.latest_date,
          latestObservedPrice,
          unit: mlResult.history_summary.unit,
        },
        outputSummary: {
          projectedDirection,
          projectedChangePercent,
          confidenceLabel: mlResult.performance?.confidence_label ?? "UNKNOWN",
          forecast: mlResult.forecast,
          performance: mlResult.performance ?? null,
          warnings: mlResult.warnings ?? [],
        },
        explanation: mlResult.explanation,
      },
    });

    return {
      status: "OK",
      forecastRunId: forecastRun.id,
      market: {
        id: market.id,
        code: market.code,
        name: market.name,
      },
      commodity: {
        id: commodity.id,
        slug: commodity.slug,
        name: commodity.name,
      },
      horizonWeeks: input.horizonWeeks,
      latestObserved: {
        priceDate: mlResult.history_summary.latest_date,
        price: latestObservedPrice,
        unit: mlResult.history_summary.unit,
      },
      projectedDirection,
      projectedChangePercent,
      model: mlResult.model_config ?? {
        model_name: mlResult.model_name,
      },
      performance: mlResult.performance ?? null,
      forecast: mlResult.forecast,
      warnings: mlResult.warnings ?? [],
      explanation: mlResult.explanation,
    };
  },

  async history(input: ForecastHistoryInput) {
    const items = await prisma.forecastRun.findMany({
      where: {
        ...(input.marketId ? { marketId: input.marketId } : {}),
        ...(input.commodityId ? { commodityId: input.commodityId } : {}),
      },
      include: {
        market: true,
        commodity: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: input.limit,
    });

    return {
      count: items.length,
      items: items.map((item) => ({
        id: item.id,
        createdAt: item.createdAt.toISOString(),
        modelName: item.modelName,
        horizonWeeks: item.horizonWeeks,
        market: {
          id: item.market.id,
          code: item.market.code,
          name: item.market.name,
        },
        commodity: {
          id: item.commodity.id,
          slug: item.commodity.slug,
          name: item.commodity.name,
        },
        inputSummary: item.inputSummary,
        outputSummary: item.outputSummary,
        explanation: item.explanation,
      })),
    };
  },
};
