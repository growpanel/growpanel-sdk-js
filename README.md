# growpanel

Official TypeScript / JavaScript SDK for the [GrowPanel](https://growpanel.io) subscription analytics REST API.

```bash
npm install growpanel
```

```typescript
import { GrowPanel } from 'growpanel';

const gp = new GrowPanel({ apiKey: process.env.GROWPANEL_API_KEY! });

const mrr = await gp.reports.getMrr({
    query: { date: '20260101-20260531', interval: 'month' }
});

for (const period of mrr.data?.result ?? []) {
    console.log(period.date, period.total_mrr);
}
```

## Auth

Get an API key from **app.growpanel.io → Account → API keys**. Pass it as `apiKey` when constructing the client. The SDK sends it as `Authorization: Bearer <key>` on every request.

## Surfaces

The SDK groups operations by API area:

- `gp.reports.*` — MRR, leads, cohorts, cashflow, retention, churn
- `gp.customers.*` — list + detail (analytics view)
- `gp.plans.*` — list plans
- `gp.planGroups.*`, `gp.segments.*`, `gp.dataSources.*`, `gp.dataCustomers.*`, `gp.dataInvoices.*` — data management
- `gp.profile.*`, `gp.notifications.*`, `gp.webhooks.*` — account & integrations

For anything not exposed as a named method, use `gp.raw.<operationId>(...)` — every endpoint in the OpenAPI spec is available there.

## Generating types from the live spec

Types and the low-level client are generated from `api.growpanel.io/openapi.json`. To refresh after the API ships changes:

```bash
npm run generate         # uses api-dev.growpanel.io
npm run generate:prod    # uses api.growpanel.io
npm run build
```

In CI, the [SDK pipeline](../growpanel-api/.github/workflows/sdk-pipeline.yml) does this automatically on every API change.

## Errors

Every operation throws `GrowPanelError` on non-2xx responses. Inspect `err.status`, `err.statusText`, and `err.body` for context.

```typescript
import { GrowPanel, GrowPanelError } from 'growpanel';

try {
    await gp.customers.detail({ path: { id: 'cus_doesnotexist' } });
} catch (err) {
    if (err instanceof GrowPanelError && err.status === 404) {
        // handle not-found
    }
    throw err;
}
```

## Interactive docs

The full reference (with try-it-out) lives at [api.growpanel.io/docs](https://api.growpanel.io/docs).
