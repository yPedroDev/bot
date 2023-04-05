"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const Lava_1 = (0, tslib_1.__importDefault)(require("../../structures/Lava"));
class TrackError extends Lava_1.default {
    constructor(client) {
        super(client, {
            name: "trackError"
        });
    }
    async run(player, track, payload) {
        player?.stop();
        player.set("trackErr", true);
        setTimeout(async () => {
            const channel = this.client.channels.cache.get(player.textChannel);
            const message = channel.messages.cache.get(player.get("currentMessageId"));
            message?.delete();
        }, 1e3);
    }
}
exports.default = TrackError;
