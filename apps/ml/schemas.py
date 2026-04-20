from datetime import date

from pydantic import BaseModel, ConfigDict, Field


class PricePoint(BaseModel):
    price_date: date
    price: float = Field(gt=0)

    model_config = ConfigDict(str_strip_whitespace=True)


class ForecastRequest(BaseModel):
    market_id: int = Field(gt=0)
    market_name: str = Field(min_length=2)
    commodity_id: int = Field(gt=0)
    commodity_name: str = Field(min_length=2)
    unit: str = Field(min_length=1)
    horizon_weeks: int = Field(default=4, ge=1, le=12)
    history: list[PricePoint] = Field(min_length=4)

    model_config = ConfigDict(str_strip_whitespace=True)
