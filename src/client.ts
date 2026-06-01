// Ergonomic wrapper around the generated low-level client.
//
// The generated `./generated/sdk` file emits one function per OpenAPI operation, grouped
// by tag — `getReportsMrr({ query, baseUrl, headers })` style. That works but feels
// procedural. This class re-exports the same functions as methods on a namespaced
// instance, sharing the auth + baseUrl config across calls:
//
//     const growpanel = new GrowPanel({ apiKey: 'gp_...' });
//     const mrr = await growpanel.reports.getMrr({ date: '20260101-20260531' });
//
// When the generator regenerates, this file picks up any new operations automatically
// because it references the namespaces by tag.

import { client as runtimeClient } from './generated/client.gen.js';
import * as sdk from './generated/sdk.gen.js';
import { GrowPanelError } from './errors.js';

export interface GrowPanelConfig {
    /** API key from /account/api-keys in the GrowPanel app. Sent as `Authorization: Bearer <key>`. */
    apiKey: string;
    /** Override the API base URL. Defaults to `https://api.growpanel.io`. */
    baseUrl?: string;
    /** Optional fetch implementation (defaults to global `fetch`). Useful in tests / Workers. */
    fetch?: typeof fetch;
}

const DEFAULT_BASE_URL = 'https://api.growpanel.io';

export class GrowPanel {
    constructor(private readonly config: GrowPanelConfig) {
        // Configure the shared runtime client. All generated operation functions read
        // their defaults from here, so this configures auth/base-URL for every call
        // made through this instance.
        runtimeClient.setConfig({
            baseUrl: (config.baseUrl ?? DEFAULT_BASE_URL).replace(/\/$/, ''),
            headers: { Authorization: `Bearer ${config.apiKey}` },
            ...(config.fetch ? { fetch: config.fetch } : {}),
            // Throw GrowPanelError on non-2xx so callers don't have to inspect `response.error`.
            throwOnError: true
        });
    }

    /**
     * Low-level escape hatch — exposes every generated operation function for advanced
     * use (custom headers per call, raw response access, etc).
     */
    get raw(): typeof sdk {
        return sdk;
    }

    // ============================================================
    // Reports
    // ============================================================
    readonly reports = {
        getSummary:                       sdk.getReportsSummary,
        getMrr:                           sdk.getReportsMrr,
        getMrrGrowth:                    sdk.getReportsMrrGrowth,
        getCmrrSummary:                  sdk.getReportsCmrrSummary,
        getLeads:                        sdk.getReportsLeads,
        getLeadsSummary:                 sdk.getReportsLeadsSummary,
        getCohort:                       sdk.getReportsCohort,
        getRetention:                    sdk.getReportsRetention,
        getTransactions:                 sdk.getReportsTransactions,
        getTransactionsSummary:          sdk.getReportsTransactionsSummary,
        getCashflowFailedPayments:       sdk.getReportsCashflowFailedPayments,
        getCashflowFailedPaymentsSummary: sdk.getReportsCashflowFailedPaymentsSummary,
        getCashflowRefunds:              sdk.getReportsCashflowRefunds,
        getCashflowFailureRate:          sdk.getReportsCashflowFailureRate,
        getCashflowFailureRateSummary:   sdk.getReportsCashflowFailureRateSummary,
        getCashflowOutstandingUnpaid:    sdk.getReportsCashflowOutstandingUnpaid,
        getChurnScheduled:               sdk.getReportsChurnScheduled,
        getChurnReasonsSummary:          sdk.getReportsChurnReasonsSummary,
        getMap:                          sdk.getReportsMap,
        getLatestActivity:               sdk.getReportsLatestActivity,
        getCustomerConcentration:        sdk.getReportsCustomerConcentration,
        getCustomVariables:              sdk.getReportsCustomVariables
    };

    // ============================================================
    // Customers (analytics view)
    // ============================================================
    readonly customers = {
        list:   sdk.getCustomers,
        detail: sdk.getCustomersById
    };

    // ============================================================
    // Plans
    // ============================================================
    readonly plans = {
        list: sdk.getPlans
    };

    // ============================================================
    // Data management — the ingestion/import API. Nested under `data.*` to keep it
    // visually separate from the analytics surfaces above (gp.customers, gp.plans).
    // Same intent as the /data/* URL prefix in the REST API.
    // ============================================================
    readonly data = {
        customers: {
            list:   sdk.getDataCustomers,
            detail: sdk.getDataCustomersById,
            create: sdk.postDataCustomers,
            update: sdk.putDataCustomersById,
            delete: sdk.deleteDataCustomersById
        },
        plans: {
            list:   sdk.getDataPlans,
            create: sdk.postDataPlans,
            update: sdk.putDataPlansById,
            delete: sdk.deleteDataPlansById
        },
        planGroups: {
            list:   sdk.getDataPlanGroups,
            detail: sdk.getDataPlanGroupsById,
            create: sdk.postDataPlanGroups,
            update: sdk.putDataPlanGroupsById,
            delete: sdk.deleteDataPlanGroupsById
        },
        segments: {
            list:   sdk.getDataSegments,
            detail: sdk.getDataSegmentsById,
            create: sdk.postDataSegments,
            update: sdk.putDataSegmentsById,
            delete: sdk.deleteDataSegmentsById
        },
        invoices: {
            list:   sdk.getDataInvoices,
            create: sdk.postDataInvoices,
            update: sdk.putDataInvoicesById,
            delete: sdk.deleteDataInvoicesById
        },
        sources: {
            list:        sdk.getDataDataSources,
            create:      sdk.postDataDataSources,
            update:      sdk.putDataDataSourcesById,
            delete:      sdk.deleteDataDataSourcesById,
            getProgress: sdk.getDataDataSourcesByIdProgress,
            reset:       sdk.postDataDataSourcesByIdReset,
            fullImport:  sdk.postDataDataSourcesByIdFullImport,
            abortImport: sdk.postDataDataSourcesByIdAbort
        }
    };

    // ============================================================
    // Account
    // ============================================================
    readonly profile = {
        get:    sdk.getProfile,
        update: sdk.putProfile
    };

    readonly notifications = {
        get:    sdk.getSettingsNotifications,
        update: sdk.putSettingsNotifications
    };

    readonly webhooks = {
        list:   sdk.getIntegrationsWebhooks,
        create: sdk.postIntegrationsWebhooks,
        delete: sdk.deleteIntegrationsWebhooksById
    };
}

// Re-export the error type so it's importable from the entry point.
export { GrowPanelError };
