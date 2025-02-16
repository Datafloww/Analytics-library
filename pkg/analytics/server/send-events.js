export async function sendTrackedEvents(params) {
    const { payload, config } = params;
    await fetch("http://localhost:3000/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: { payload: payload }, config: config }),
    }).catch((err) => {
        console.warn(err);
    });
}
