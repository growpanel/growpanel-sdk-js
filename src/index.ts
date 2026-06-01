// Public SDK entry point. Re-exports the typed client + every operation surface that the
// generator emits under `./generated/sdk`. End-users instantiate `GrowPanel({ apiKey })`
// and call methods like `growpanel.reports.getMrr({ date: ... })`.

export { GrowPanel } from './client.js';
export type { GrowPanelConfig } from './client.js';
export { GrowPanelError } from './errors.js';

// Re-export every generated type so consumers can import them by name
// (e.g. `import type { MrrPeriodRow } from '@growpanel/sdk'`).
export type * from './generated/types.gen.js';
