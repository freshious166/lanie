# LANIE Fleet Care & Mobility Platform

Welcome to the **LANIE** monorepo. LANIE is a comprehensive fleet maintenance, logistics, and compliance platform designed specifically for the African mobility sector.

## 🏗️ Project Architecture

This is a modern NPM Workspace monorepo:

- **`apps/mobile`**: React Native Expo app (Driver/Partner app) optimized with the New Architecture.
- **`apps/web-dashboard`**: Vite + React SPA for Fleet Managers (Operations Command Center).
- **`apps/admin-console`**: Vite + React SPA for LANIE's internal administration and moderation.
- **`apps/backend-api`**: NestJS multi-tenant API powered by TypeORM and PostgreSQL (with PostGIS for spatial queries).

## 🚀 Key Modules
1. **Tracking & Dispatch**: Live GPS telemetry, geofencing, and proximity-based dispatch.
2. **Marketplace & Maintenance**: End-to-end service job lifecycle, parts catalog, invoicing, and vehicle trade-in workflows.
3. **Intelligence & HSE**: ML-ready predictive maintenance scoring, fuel anomaly detection, driver risk evaluation, and ISO 45001-aligned compliance management.
4. **Supply Chain**: Multi-leg shipment tracking, load planning, cold-chain monitoring, and electronic Proof of Delivery (PoD).

## 🌍 ECOWAS Extensibility & Configuration
LANIE is architected to scale beyond Nigeria. Hardcoded assumptions have been extracted into configuration and reference tables.

### Environment Configuration Requirements
To launch in a new region, ensure the following `.env` variables are configured (rather than hardcoded):
- `PAYMENT_GATEWAY_PROVIDER`: e.g., `PAYSTACK`, `FLUTTERWAVE` (depending on country support).
- `SMS_GATEWAY_PROVIDER`: e.g., `TWILIO`, `AFRICASTALKING`, `TERMII`.
- `DEFAULT_CURRENCY`: ISO 4217 code (e.g., `NGN`, `GHS`, `XOF`).

### Second-Market Launch Checklist (e.g., Ghana 🇬🇭)
If LANIE expands to a new ECOWAS market, follow this technical checklist:
1. **Tenant Configuration**: Update the `countryCode` (e.g., `GH`) and `currency` (e.g., `GHS`) in the `Tenant` records for clients in that region.
2. **Regulatory Bodies**: Seed the `RegulatoryBody` table with local compliance authorities (e.g., `DVLA` for Ghana, instead of `FRSC`/`VIO`).
3. **Payment Gateway Integration**: Verify if the `BillingModule` can process `GHS` via the existing Paystack integration, or implement a `FlutterwaveService` strategy pattern if required.
4. **SMS Routing**: Ensure the configured SMS provider supports reliable delivery to the new country code prefix (e.g., `+233`).
5. **Localization (Future)**: The UI strings are currently English. Extract strings to a localization framework (like `i18next`) if expanding to Francophone regions (e.g., Côte d'Ivoire).

## 🛠️ Getting Started

1. Clone the repository.
2. Run `npm install` from the root.
3. Start the backend: `cd apps/backend-api && npm run start:dev`
4. Start the web dashboard: `cd apps/web-dashboard && npm run dev`
5. Start the mobile app: `cd apps/mobile && npx expo start`

© 2026 LANIE Fleet Care Solutions. All rights reserved.
