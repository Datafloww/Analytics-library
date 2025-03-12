import { Analytics as CoreAnalytics } from "analytics";
import { analyticsEventPlugin } from "./events-plugin/plugin.js";

function createAnalyticsInstance() {
    let analytics = null;
    let initializedKey = null;

    return {
        /**
         * Initializes the analytics instance with the provided write key.
         * @param {Object} params - The initialization parameters.
         * @param {string} params.key - The write key for the analytics instance.
         * @throws Will throw an error if the write key is not provided.
         * @returns {Object} The initialized analytics instance.
         */
        init({ key }) {
            if (!key) throw new Error("Write key is required");

            // If already initialized with the same key, return existing instance
            if (analytics && initializedKey === key) {
                return analytics;
            }

            analytics = CoreAnalytics({
                app: "datafloww",
                plugins: [analyticsEventPlugin(key)],
            });

            initializedKey = key;

            try {
                this.getInstance();
            } catch (error) {
                console.error(error.message);
            }

            return analytics;
        },
        getInstance() {
            if (!analytics)
                throw new Error(
                    "Analytics not initialized. Call analytics.init({ key }) first."
                );
            return analytics;
        },
    };
}
const Analytics = createAnalyticsInstance();

export { Analytics };
