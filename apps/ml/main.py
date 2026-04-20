from datetime import datetime

from fastapi import FastAPI


app = FastAPI(title="BAPI Forecast Service", version="0.1.0")


@app.get("/health")
def health() -> dict[str, str]:
    return {
        "service": "bapi-ml",
        "status": "ok",
        "timestamp": datetime.utcnow().isoformat() + "Z",
    }


@app.get("/")
def root() -> dict[str, object]:
    return {
        "name": "BAPI Forecast Service",
        "phase": 4,
        "message": "ML service bootstrap is ready for later forecasting work.",
        "forecasting_enabled": False,
    }
