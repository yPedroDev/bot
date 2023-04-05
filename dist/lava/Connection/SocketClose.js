"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const Lava_1 = (0, tslib_1.__importDefault)(require("../../structures/Lava"));
const Logger_1 = (0, tslib_1.__importDefault)(require("../../class/Logger"));
class socketClosed extends Lava_1.default {
    constructor(client) {
        super(client, {
            name: 'socketClosed'
        });
    }
    async run(player, socket) {
        Logger_1.default.log("WARNING", `ErelaSocket From: ${this.client.guilds.cache.get(socket.guildId)?.name}`);
    }
}
exports.default = socketClosed;
