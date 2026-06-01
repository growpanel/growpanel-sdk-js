// Thrown by every method when the API returns a non-2xx response. Includes the parsed
// error body when the server returned JSON, otherwise the raw text.

export class GrowPanelError extends Error {
    public readonly status: number;
    public readonly statusText: string;
    public readonly body: unknown;

    constructor(status: number, statusText: string, body: unknown) {
        const message = typeof body === 'object' && body && 'error' in body && typeof (body as Record<string, unknown>).error === 'string'
            ? `GrowPanel API ${status}: ${(body as Record<string, string>).error}`
            : `GrowPanel API ${status} ${statusText}`;
        super(message);
        this.name = 'GrowPanelError';
        this.status = status;
        this.statusText = statusText;
        this.body = body;
    }
}
