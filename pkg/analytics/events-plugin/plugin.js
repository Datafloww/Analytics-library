import { sendTrackedEvents, verifyKey } from "../server/send-events.js";

export function analyticsEventPlugin(writeKey) {
    // Create a closure variable to track verification status
    let isVerified = false;

    return {
        name: "datafloww-plugin",
        initialize: async () => {
            // Called once during initialization
            isVerified = await verifyKey({ key: writeKey });
            if (!isVerified) {
                console.error("Invalid write key");
            }
            return isVerified;
        },
        page: ({ payload, config, options = {} }) => {
            if (!isVerified) {
                console.error("Cannot send event: Invalid write key");
                return Promise.reject(new Error("Invalid write key"));
            }

            return sendTrackedEvents({
                payload: { event: "Page Viewed", type: "page", ...payload },
                config,
                options,
                writeKey,
            });
        },
        track: ({ payload, config, options }) => {
            if (!isVerified) {
                console.error("Cannot send event: Invalid write key");
                return Promise.reject(new Error("Invalid write key"));
            }

            return sendTrackedEvents({
                payload: { type: "track", ...payload },
                config,
                options,
                writeKey,
            });
        },
        identify: ({ payload, config, options }) => {
            if (!isVerified) {
                console.error("Cannot send event: Invalid write key");
                return Promise.reject(new Error("Invalid write key"));
            }

            return sendTrackedEvents({
                payload: { type: "identify", ...payload },
                config,
                options,
                writeKey,
            });
        },
        user: ({ config }) => {
            if (!isVerified) {
                console.error("Cannot get user: Invalid write key");
                return null;
            }

            return {
                userId: config.userId,
                traits: config.traits,
            };
        },
        reset: ({ config }) => {
            if (!isVerified) {
                console.error("Cannot reset: Invalid write key");
                return;
            }

            config.userId = null;
            config.traits = {};
        },
        ready: (callback) => {
            if (typeof callback === "function") {
                if (isVerified) {
                    callback();
                } else {
                    console.error(
                        "Cannot execute ready callback: Invalid write key"
                    );
                }
            }
        },
        on: (event, callback) => {
            if (!isVerified) {
                console.error(
                    "Cannot register event listener: Invalid write key"
                );
                return;
            }

            if (typeof callback === "function") {
                console.log(`Listening for event: ${event}`);
                setTimeout(() => callback({ event, data: {} }), 1000);
            }
        },
        once: (event, callback) => {
            if (!isVerified) {
                console.error(
                    "Cannot register one-time event listener: Invalid write key"
                );
                return;
            }

            if (typeof callback === "function") {
                console.log(`Listening once for event: ${event}`);
                setTimeout(() => callback({ event, data: {} }), 1000);
            }
        },
        getState: ({ config }) => {
            if (!isVerified) {
                console.error("Cannot get state: Invalid write key");
                return null;
            }

            return { ...config };
        },
        storage: {
            getItem: (key) => {
                if (!isVerified) {
                    console.error("Cannot access storage: Invalid write key");
                    return null;
                }
                return localStorage.getItem(key);
            },
            setItem: (key, value) => {
                if (!isVerified) {
                    console.error("Cannot access storage: Invalid write key");
                    return;
                }
                localStorage.setItem(key, value);
            },
            removeItem: (key) => {
                if (!isVerified) {
                    console.error("Cannot access storage: Invalid write key");
                    return;
                }
                localStorage.removeItem(key);
            },
        },
        plugins: [],
        isVerified: () => isVerified, // Expose verification status
    };
}
