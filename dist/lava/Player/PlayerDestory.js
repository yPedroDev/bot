"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const Lava_1 = (0, tslib_1.__importDefault)(require("../../structures/Lava"));
const Logger_1 = (0, tslib_1.__importDefault)(require("../../class/Logger"));
const client_functions_1 = require("../../utils/client-functions");
const lavalink_function_1 = require("../../utils/lavalink-function");
class PlayerDestroy extends Lava_1.default {
    constructor(client) {
        super(client, {
            name: 'playerDestroy'
        });
    }
    async run(player) {
        const currentText = player.get("currentText");
        if (currentText) {
            const data = await (0, client_functions_1.getModel)("IMusic", { guildId: player.guild });
            if (!data)
                return;
            const messageId = data.musicId;
            let guild = this.client.guilds.cache.get(player.guild);
            if (!guild)
                return;
            let channel = guild.channels.cache.get(data.channelId);
            if (!channel)
                channel = await guild.channels.fetch(data.channelId).catch(err => Logger_1.default.log("ERROR", err)) || false;
            if (!channel)
                return;
            let message = channel.messages.cache.get(messageId);
            if (!message)
                message = await channel.messages.fetch(messageId).catch((err) => Logger_1.default.log("ERROR", err)) || false;
            const gdata = (0, lavalink_function_1.generateEmbed)(this.client, player.guild, true);
            message.edit(gdata).catch((err) => Logger_1.default.log("ERROR", err));
        }
        else {
            const channel = this.client.channels.cache.get(player.textChannel);
            const message = channel.messages.cache.get(player.get("currentMessageId"));
            message?.delete().catch(err => Logger_1.default.log("ERROR", err));
        }
    }
}
exports.default = PlayerDestroy;
