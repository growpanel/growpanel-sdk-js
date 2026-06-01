# growpanel

Official TypeScript / JavaScript SDK for the [GrowPanel](https://growpanel.io) subscription analytics REST API.

```bash
npm install @growpanel/sdk
```

```typescript
import { GrowPanel } from '@growpanel/sdk';

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

**Analytics (read-only):**
- `gp.reports.*` — MRR, leads, cohorts, cashflow, retention, churn
- `gp.customers.*` — list + detail (analytics view of subscribers)
- `gp.plans.*` — list plans (analytics view)

**Account & integrations:**
- `gp.profile.*` — current user profile
- `gp.notifications.*` — report subscriptions and alert thresholds
- `gp.webhooks.*` — event subscriptions

**Data ingestion (CRUD on a data source):**
- `gp.data.customers.*` — create / read / update / delete raw customer rows
- `gp.data.plans.*` — raw plan CRUD
- `gp.data.planGroups.*` — group plans together
- `gp.data.segments.*` — saved filter combinations
- `gp.data.invoices.*` — raw invoice CRUD
- `gp.data.sources.*` — connected billing systems, plus reset / import / abort actions

The `data.*` nesting mirrors the `/data/*` URL prefix and keeps the ingestion API visually separate from the analytics surfaces.

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
import { GrowPanel, GrowPanelError } from '@growpanel/sdk';

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
