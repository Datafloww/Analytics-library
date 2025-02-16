import { sendTrackedEvents } from "../server/send-events.js";

export function analyticsEventPlugin(writeKey) {
    return {
        name: "datafloww-plugin",
        init: ({ key }) => {
            sendTrackedEvents({ payload: {}, config, key });
        },
        pageEnd: ({ payload, config }) => {
            sendTrackedEvents({ payload, config, writeKey });
        },
        trackEnd: ({ payload, config }) => {
            sendTrackedEvents({ payload, config, writeKey });
        },
        identifyEnd: ({ payload, config }) => {
            sendTrackedEvents({ payload, config, writeKey });
        },
        user: ({ config }) => {
            return { userId: config.userId, traits: config.traits };
        },
        reset: ({ config }) => {
            config.userId = null;
            config.traits = {};
        },
        ready: (callback) => {
            if (typeof callback === "function") {
                callback();
            }
        },
        on: (event, callback) => {
            if (typeof callback === "function") {
                console.log(`Listening for event: ${event}`);
                // Simulate event listener
                setTimeout(() => callback({ event, data: {} }), 1000);
            }
        },
        once: (event, callback) => {
            if (typeof callback === "function") {
                console.log(`Listening once for event: ${event}`);
                // Simulate one-time event trigger
                setTimeout(() => callback({ event, data: {} }), 1000);
            }
        },
        getState: ({ config }) => {
            return { ...config };
        },
        storage: {
            getItem: (key) => {
                return localStorage.getItem(key);
            },
            setItem: (key, value) => {
                localStorage.setItem(key, value);
            },
            removeItem: (key) => {
                localStorage.removeItem(key);
            },
        },
        plugins: [],
    };
}
