import path from "path";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
export default {
    entry: ["./lib/index.js"],
    output: {
        filename: "script.js",
        path: path.resolve(__dirname, "dist"),
    },
    mode: "production",
    optimization: { minimize: true },
};
