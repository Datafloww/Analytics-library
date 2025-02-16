declare module "./events-plugin/plugin" {
    interface EventPayload {
        event: string;
        properties?: Record<string, any>;
        userId?: string;
        anonymousId?: string;
    }

    interface Config {
        writeKey: string;
        [key: string]: any; // Allow additional properties
    }

    interface EventParams {
        payload: EventPayload;
        config: Config;
    }

    export function analyticsEventPlugin(writeKey: string): {
        name: string;
        pageEnd: (params: EventParams) => void;
        trackEnd: (params: EventParams) => void;
        identifyEnd: (params: EventParams) => void;
    };
}

declare module "../server/send-events" {
    export function sendTrackedEvents(params: {
        payload: EventPayload;
        config: Config;
    }): Promise<void>;
}

interface AnalyticsInstance {
    init(params: { key: string }): CoreAnalytics;
    getInstance(): CoreAnalytics;
}

declare function createAnalyticsInstance(): AnalyticsInstance;
