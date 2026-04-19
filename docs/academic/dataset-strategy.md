# Dataset Strategy and Data Preparation

## Purpose
This document defines how data will be sourced, structured, prepared, validated, and defended academically for BAPI. The goal is to ensure that the project uses realistic, manageable, and explainable data rather than an uncontrolled or unverifiable data pipeline.

## Dataset Philosophy
The dataset strategy for this project is intentionally controlled:
- use curated historical records
- use weekly updates entered by an admin
- avoid uncontrolled external automation
- prioritize traceability and data quality over volume

This approach is appropriate for the approved project scope and supports both implementation feasibility and academic defense.

## Data Coverage
### Markets
- Makurdi
- Gboko
- Zaki Biam
- Otukpo

### Commodities
- Yam
- Cassava
- Rice
- Maize
- Beans
- Soybean
- Millet
- Sorghum

## Data Types to Maintain
### Reference Data
- market records
- commodity records
- user roles and administrative context later

### Transactional Price Data
- market
- commodity
- price date
- price value
- unit
- optional source note

### Derived Analytical Data
- trend summaries
- alerts
- seasonality summaries
- state averages
- optional forecast outputs

## Practical Dataset Sources
For this academic project, acceptable data sources include:
- manually curated historical CSV files prepared from local observations or compiled records
- weekly admin entries for new updates
- supervisor-approved sample data for demonstration where real records are incomplete

## Why This Strategy Is Defendable
- It avoids the legal and technical uncertainty of scraping.
- It keeps every stored record attributable to a controlled input path.
- It supports reproducible imports and validation.
- It is realistic for a final-year project timeline.

## Minimum Recommended Data Depth
For an effective demonstration:
- at least 8 to 12 weeks of price data per commodity-market pair for rule-based weekly comparison
- more historical coverage later if forecasting quality is to improve

For this phase, the repo includes a starter sample dataset suitable for:
- CRUD testing later
- dashboard prototyping
- rule-based analytics design
- import workflow testing

## Dataset Preparation Workflow
1. Define the canonical CSV shape.
2. Keep master reference data for markets and commodities fixed.
3. Prepare starter price records using consistent units and date formatting.
4. Validate against the approved scope.
5. Import only clean rows into the application in later phases.

## Cleaning Rules
- use ISO date format: `YYYY-MM-DD`
- use one approved unit per commodity where possible
- store numeric prices without currency symbols or commas
- reject markets outside the approved four
- reject commodities outside the approved eight
- reject blank dates or non-positive prices

## Intended Use of Starter Files
- `data/raw/markets.csv`: approved market reference data
- `data/raw/commodities.csv`: approved commodity reference data
- `data/raw/price_records_sample.csv`: starter historical and weekly price dataset for demos and seed preparation
- `data/processed/README.md`: rules for clean-data outputs later

## Forecasting Note
The sample data included in this phase is designed first for monitoring and rule-based analytics. If stronger forecasting is desired later, the dataset should be extended to cover a longer time span with consistent weekly intervals.

## Edge Cases to Watch
- duplicate rows for the same market, commodity, date, and unit
- mixed units for the same commodity
- abrupt unrealistic values caused by typing mistakes
- missing weekly records that affect trend calculation
- sparse history that is insufficient for forecasting

## Academic Defense Notes
- The dataset is intentionally bounded for quality control and traceability.
- A smaller, validated dataset is more appropriate than a large unverifiable one.
- The system design allows future expansion, but this project prioritizes a defensible prototype over scale.

## Personal Actions Required
- If you later gather stronger historical records, extend the CSV files without changing the approved scope.
- If your supervisor requests citation of the data source, record the provenance for each imported dataset outside the application and summarize it in the final report.
