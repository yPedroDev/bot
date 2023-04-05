"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const Lava_1 = (0, tslib_1.__importDefault)(require("../../structures/Lava"));
const Logger_1 = (0, tslib_1.__importDefault)(require("../../class/Logger"));
const SentryLoggers_1 = (0, tslib_1.__importDefault)(require("../../class/SentryLoggers"));
class NodeError extends Lava_1.default {
    constructor(client) {
        super(client, {
            name: 'nodeError'
        });
    }
    async run(node, err) {
        SentryLoggers_1.default.getInstance().BotLoggers(err);
        Logger_1.default.log(`ERROR`, err);
    }
}
exports.default = NodeError;
