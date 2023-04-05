"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const Lava_1 = (0, tslib_1.__importDefault)(require("../../structures/Lava"));
const Logger_1 = (0, tslib_1.__importDefault)(require("../../class/Logger"));
class nodeConnect extends Lava_1.default {
    constructor(client) {
        super(client, {
            name: 'nodeConnect'
        });
    }
    async run(node) {
        Logger_1.default.log("SUCCESS", `Node Connected: ${node.options.identifier}`);
    }
}
exports.default = nodeConnect;
