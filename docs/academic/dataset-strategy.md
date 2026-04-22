# Dataset Strategy

## Purpose
This document defines how BAPI dataset content is scoped, curated, and prepared for monitoring and rule-based analysis.

## Approved Scope
- Markets: Makurdi, Gboko, Zaki Biam, Otukpo
- Commodities: Yam, Cassava, Rice, Maize, Beans, Soybean, Millet, Sorghum
- Time pattern: historical records plus weekly updates

## Data Sources
- manually curated historical sample data
- admin-entered weekly updates
- public submissions that become valid only after admin approval

## Data Preparation Rules
- keep market names and commodity names consistent
- preserve weekly date granularity
- reject invalid or duplicate official rows
- keep submission records separate from approved historical records

## Quality Concerns
- missing weeks
- inconsistent units
- sparse historical coverage
- invalid public submission values

## Personal Actions Required
- Extend the dataset later only if it stays within the approved project scope and remains explainable in the final report.
