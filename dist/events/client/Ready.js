"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const Logger_1 = (0, tslib_1.__importDefault)(require("../../class/Logger"));
const Event_1 = (0, tslib_1.__importDefault)(require("../../structures/Event"));
class Ready extends Event_1.default {
    constructor(client) {
        super(client, "ready");
    }
    async exec() {
        await this.client.manager?.init(this.client.user?.id);
        this.client.user?.setActivity(`${this.client.config.prefix}help`, { type: "LISTENING" });
        Logger_1.default.log("SUCCESS", `${this.client.user?.tag} is online!`);
    }
}
exports.default = Ready;
