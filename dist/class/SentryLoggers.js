"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const node_1 = require("@sentry/node");
const Dsn_1 = (0, tslib_1.__importDefault)(require("../errors/Dsn"));
class SentryLoggers {
    constructor(dsn) {
        (0, node_1.init)({ dsn, sampleRate: 0.75, environment: process.env.NODE_ENV === "development" ? "development" : "production", autoSessionTracking: true });
    }
    static getInstance() {
        if (!SentryLoggers.instance) {
            const dsn = process.env.DSN;
            if (!dsn) {
                throw new Dsn_1.default("Failed to intialize DSN");
            }
            SentryLoggers.instance = new SentryLoggers(dsn);
        }
        return SentryLoggers.instance;
    }
    caputureErrors(err) {
        if (process.env.NODE_ENV === "development") {
            console.log(err);
        }
        (0, node_1.captureException)(err);
    }
    BotLoggers(err) {
        err.message = `[ Nao Errors ]: ${err.message}`;
        this.caputureErrors(err);
    }
    async closeLoggers() {
        await (0, node_1.close)();
    }
}
exports.default = SentryLoggers;
