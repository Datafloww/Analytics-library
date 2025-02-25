var i = "analytics",
    datafloww = (window[i] = window[i] || []);
datafloww.load = function (key) {
    var analyticsSrc = `http://localhost:3000/analytics/v1/${key}/analytics.min.js`;
    var script = document.createElement("script");
    script.type = "text/javascript";
    script.async = true;
    script.setAttribute("data-global-df-analytics-key", key);
    script.src = analyticsSrc;
    script.onload = () => {
        if (window._analytics) {
            window.analytics = _analytics.init({
                plugins: [analyticsEventPlugin(key)],
            });
        } else {
            console.error("Analytics script failed to load.");
        }
        analytics.page();
    };
    var h = document.getElementsByTagName("script")[0];
    h.parentNode.insertBefore(script, h);
};

datafloww.SNIPPET_VERSION = "1.0.0";
datafloww._key = "123";
datafloww.load("123");
