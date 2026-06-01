import { defineConfig } from '@hey-api/openapi-ts';

// Reads the live OpenAPI spec from the API worker and writes typed types + a low-level
// `fetch`-based client into src/generated/. Defaults to api-dev so we can iterate without
// publishing to prod; override with GROWPANEL_API_URL for prod generation.
const apiUrl = (process.env.GROWPANEL_API_URL || 'https://api-dev.growpanel.io').replace(/\/$/, '');

export default defineConfig({
    input: `${apiUrl}/openapi.json`,
    output: {
        path: 'src/generated',
        format: 'prettier',
        clean: true
    },
    plugins: [
        // Generate request methods (one per endpoint) + a runtime config helper.
        '@hey-api/client-fetch',
        // Generate TypeScript types for every schema in the spec.
        '@hey-api/typescript',
        // Generate per-tag service classes (GroupedReports.getMrr, etc) so the ergonomic
        // wrapper in src/client.ts can re-export them with rich names.
        '@hey-api/sdk'
    ]
});
