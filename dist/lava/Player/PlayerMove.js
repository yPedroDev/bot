"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const Lava_1 = (0, tslib_1.__importDefault)(require("../../structures/Lava"));
class PlayerMove extends Lava_1.default {
    constructor(client) {
        super(client, {
            name: "playerMove"
        });
    }
    async run(player, oldChannel, newState) {
        if (!newState) {
            await player.destroy();
        }
        else {
            console.log(newState);
            player.setVoiceChannel(newState);
            if (player.paused)
                return;
            setTimeout(() => {
                player.pause(true);
                setTimeout(() => player.pause(false), this.client.ws.ping * 2);
            }, this.client.ws.ping * 2);
        }
    }
}
exports.default = PlayerMove;
