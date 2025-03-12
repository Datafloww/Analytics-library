/**
 * Sends tracked events to the analytics server.
 *
 * @param {Object} params - The parameters for sending tracked events.
 * @param {Object} params.payload - The payload data to be sent.
 * @param {Object} params.config - The configuration for the request.
 * @param {Object} params.options - The extra options to be sent.
 * @param {string} params.writeKey - The write key for the analytics instance.
 * @returns {Promise<void>} A promise that resolves when the request is complete.
 */
export async function sendTrackedEvents(params) {
    const { payload, config, options, writeKey } = params;
    await fetch("https://api.datafloww.me/analytics/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            data: { payload: payload },
            config: config,
            options: options,
            writeKey: writeKey,
        }),
    }).catch((err) => {
        console.warn(err);
    });
}

/**
 * Checks if the key is already verified in cookies.
 *
 * @param {string} key - The API key to check.
 * @returns {boolean} - Whether the key is verified in cookies.
 */
function isKeyVerifiedInCookie(key) {
    try {
        // Only attempt to check cookies in browser environment
        if (typeof document === "undefined") return false;

        const cookieName = `datafloww_verified_${hashKey(key)}`;
        return document.cookie
            .split("; ")
            .some((c) => c.startsWith(`${cookieName}=true`));
    } catch (error) {
        console.warn("Error checking cookie verification:", error);
        return false;
    }
}

/**
 * Sets a cookie indicating that the key has been verified.
 *
 * @param {string} key - The API key that was verified.
 * @param {number} expiryDays - Days until cookie expires.
 */
function setKeyVerifiedCookie(key, expiryDays = 7) {
    try {
        // Only attempt to set cookies in browser environment
        if (typeof document === "undefined") return;

        const cookieName = `datafloww_verified_${hashKey(key)}`;
        const expiryDate = new Date();
        expiryDate.setDate(expiryDate.getDate() + expiryDays);

        document.cookie = `${cookieName}=true; expires=${expiryDate.toUTCString()}; path=/; SameSite=Lax`;
    } catch (error) {
        console.warn("Error setting verification cookie:", error);
    }
}

/**
 * Simple hash function for the API key to avoid storing raw keys in cookies.
 *
 * @param {string} key - The key to hash.
 * @returns {string} - A hashed version of the key.
 */
function hashKey(key) {
    // This is a simple hash - in production you might want a more robust hash
    let hash = 0;
    for (let i = 0; i < key.length; i++) {
        const char = key.charCodeAt(i);
        hash = (hash << 5) - hash + char;
        hash = hash & hash; // Convert to 32bit integer
    }
    return hash.toString(36);
}

export async function verifyKey({ key }) {
    if (!key) {
        console.warn("No key provided to verifyKey function");
        return false;
    }

    // Check if key is already verified in cookies
    if (isKeyVerifiedInCookie(key)) {
        return true;
    }

    try {
        const res = await fetch("https://api.datafloww.me/auth/key/verify", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-Analytics-Source": "package",
            },
            body: JSON.stringify({
                apiKey: key,
            }),
        });

        if (res.status === 200) {
            // Save verification status in cookie
            setKeyVerifiedCookie(key);
            return true;
        } else {
            return false;
        }
    } catch (error) {
        console.error("Error verifying key:", error);
        return false;
    }
}
