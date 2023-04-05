"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const Event_1 = (0, tslib_1.__importDefault)(require("../../structures/Event"));
class RawEvent extends Event_1.default {
    constructor(client) {
        // @ts-ignore
        super(client, 'raw');
    }
    async exec(d) {
        this.client.manager?.updateVoiceState(d);
    }
}
exports.default = RawEvent;
