declare module "@datafloww/analytics" {
    // Import core types but don't rely on them since we want to define our own
    // complete interface with all methods
    import { Analytics as OriginalAnalytics } from "analytics";

    // Event payload definition
    interface EventPayload {
        event?: string;
        type?: "page" | "track" | "identify";
        properties?: Record<string, any>;
        userId?: string;
        anonymousId?: string;
        [key: string]: any;
    }

    // Configuration definition
    interface Config {
        writeKey?: string;
        userId?: string | null;
        traits?: Record<string, any>;
        [key: string]: any;
    }

    // Event parameters
    interface EventParams {
        payload: EventPayload;
        config: Config;
        writeKey: string;
    }

    // Event callback type
    interface EventCallback {
        (data: { event: string; data: Record<string, any> }): void;
    }

    // Function to detach event listeners
    type DetachListeners = () => void;

    // Page data interface
    interface PageData {
        title?: string;
        url?: string;
        path?: string;
        search?: string;
        width?: string | number;
        height?: string | number;
        name?: string;
        properties?: Record<string, any>;
        [key: string]: any;
    }

    // Storage interface
    interface Storage {
        getItem: (key: string, options?: any) => any;
        setItem: (key: string, value: any, options?: any) => void;
        removeItem: (key: string, options?: any) => void;
    }

    // Plugin management interface
    interface Plugins {
        enable: (
            plugins: string | string[],
            callback?: (...params: any[]) => any
        ) => Promise<any>;
        disable: (
            plugins: string | string[],
            callback?: (...params: any[]) => any
        ) => Promise<any>;
    }

    // Complete analytics methods interface
    interface CoreAnalytics {
        // Core tracking methods
        identify: (
            userId: string,
            traits?: any,
            options?: any,
            callback?: (...params: any[]) => any
        ) => Promise<any>;
        track: (
            eventName: string,
            payload?: any,
            options?: any,
            callback?: (...params: any[]) => any
        ) => Promise<any>;
        page: (
            data?: PageData | string,
            options?: any,
            callback?: (...params: any[]) => any
        ) => Promise<any>;

        // User data and management
        user: (key?: string) => any;
        reset: (callback?: (...params: any[]) => any) => Promise<any>;

        // Event handling
        ready: (callback: (...params: any[]) => any) => DetachListeners;
        on: (
            name: string,
            callback: (...params: any[]) => any
        ) => DetachListeners;
        once: (
            name: string,
            callback: (...params: any[]) => any
        ) => DetachListeners;

        // State and storage
        getState: (key?: string) => any;
        storage: Storage;
        plugins: Plugins;

        // Additional methods your implementation might have
        [key: string]: any;
    }

    // Analytics plugin interface
    interface AnalyticsPlugin {
        name: string;
        initialize?: (params: { config: Config }) => void;
        page: (params: EventParams) => Promise<void>;
        track: (params: EventParams) => Promise<void>;
        identify: (params: EventParams) => Promise<void>;
        user: (params: { config: Config }) => {
            userId: string | null;
            traits: Record<string, any>;
        };
        reset: (params: { config: Config }) => void;
        ready: (callback: Function) => void;
        on: (event: string, callback: EventCallback) => void;
        once: (event: string, callback: EventCallback) => void;
        getState: (params: { config: Config }) => Config;
        storage: {
            getItem: (key: string) => string | null;
            setItem: (key: string, value: string) => void;
            removeItem: (key: string) => void;
        };
        plugins: any[];
    }

    // Your package's public functions
    export function sendTrackedEvents(params: EventParams): Promise<void>;
    export function analyticsEventPlugin(writeKey: string): AnalyticsPlugin;

    // Your Analytics instance interface
    interface AnalyticsInstance {
        init(params: { key: string }): CoreAnalytics;
        getInstance(): CoreAnalytics;
    }

    // Export the Analytics object
    export const Analytics: AnalyticsInstance;
}
