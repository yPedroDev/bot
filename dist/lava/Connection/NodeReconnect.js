"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const Lava_1 = (0, tslib_1.__importDefault)(require("../../structures/Lava"));
const Logger_1 = (0, tslib_1.__importDefault)(require("../../class/Logger"));
class NodeReconnect extends Lava_1.default {
    constructor(client) {
        super(client, {
            name: 'nodeReconnect'
        });
    }
    async run(node) {
        Logger_1.default.log("WARNING", `Node Reconnect: ${node.options.identifier}.`);
    }
}
exports.default = NodeReconnect;
