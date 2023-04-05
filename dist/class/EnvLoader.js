"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const dotenv_1 = (0, tslib_1.__importDefault)(require("dotenv"));
const EvnError_1 = (0, tslib_1.__importDefault)(require("../errors/EvnError"));
class EnvLoader {
    static load() {
        dotenv_1.default.config();
        this.validate(process.env);
    }
    static validate(env) {
        if (env.TOKEN === "")
            throw new EvnError_1.default("Missing Discord Client Token!");
        if (env.PREFIX === "")
            throw new EvnError_1.default("Missing DIscord Client Prefix!");
        if (env.DSN === "")
            throw new EvnError_1.default("Missing Sentry DSN!");
        if (!env.DEVELOPERS.startsWith("[") || !env.DEVELOPERS.endsWith("]"))
            throw new EvnError_1.default("Missing Developers Id, Developers must be an array.");
        try {
            JSON.parse(env.DEVELOPERS);
        }
        catch (_) {
            throw new EvnError_1.default("Developers must be an array.");
        }
    }
}
exports.default = EnvLoader;
