# CSV Import Specification

## Purpose
This document defines the canonical CSV structure for price import into BAPI. It serves as the contract between prepared datasets and the backend import feature that will be built later.

## Supported CSV Files in This Phase
- `markets.csv`
- `commodities.csv`
- `price_records_sample.csv`

## Price Import File
### Filename
`price_records_sample.csv`

### Required Columns
| Column | Type | Required | Description |
| --- | --- | --- | --- |
| `market_code` | string | Yes | Stable code for one of the approved markets |
| `commodity_slug` | string | Yes | Stable commodity identifier |
| `price_date` | date | Yes | ISO date in `YYYY-MM-DD` format |
| `price` | number | Yes | Numeric market price without commas or symbols |
| `unit` | string | Yes | Measurement unit used for the commodity |
| `source_note` | string | No | Optional note describing provenance or context |

## Market Reference File
### Filename
`markets.csv`

### Required Columns
| Column | Type | Required | Description |
| --- | --- | --- | --- |
| `code` | string | Yes | Stable market code |
| `name` | string | Yes | Human-readable market name |
| `local_government_area` | string | Yes | LGA of the market |
| `state` | string | Yes | Must remain `Benue` |
| `is_active` | boolean | Yes | Whether the market is active |

## Commodity Reference File
### Filename
`commodities.csv`

### Required Columns
| Column | Type | Required | Description |
| --- | --- | --- | --- |
| `slug` | string | Yes | Stable commodity identifier |
| `name` | string | Yes | Human-readable commodity name |
| `default_unit` | string | Yes | Standard unit used in the project |
| `is_active` | boolean | Yes | Whether the commodity is active |

## Validation Rules
- `market_code` must match one of: `MKD`, `GBK`, `ZKB`, `OTK`
- `commodity_slug` must match one of the approved eight commodity slugs
- `price_date` must use ISO date format
- `price` must be a positive numeric value
- `unit` must not be blank
- duplicate price rows for the same market, commodity, date, and unit should be rejected or flagged later

## Import Behavior Expectations
- invalid rows should not silently pass
- import results should report total, success, and failure counts
- failed rows should remain reviewable by the admin later

## Example Valid Row
```csv
MKD,maize,2026-02-23,41200.00,100kg bag,Sample curated dataset for Phase 2
```

## Example Invalid Conditions
- unknown market code
- commodity not in approved scope
- negative or zero price
- malformed date
- missing unit

## Personal Actions Required
- If you later refine units or source-note conventions, update this document before implementing the final import validator.
