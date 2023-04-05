"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const Lava_1 = (0, tslib_1.__importDefault)(require("../../structures/Lava"));
const discord_js_light_1 = require("discord.js-light");
const lavalink_function_1 = require("../../utils/lavalink-function");
const client_functions_1 = require("../../utils/client-functions");
const Logger_1 = (0, tslib_1.__importDefault)(require("../../class/Logger"));
class TrackStart extends Lava_1.default {
    constructor(client) {
        super(client, {
            name: 'trackStart'
        });
    }
    async run(player, track, payload) {
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
            const gdata = (0, lavalink_function_1.generateEmbed)(this.client, player.guild, false);
            message.edit(gdata).catch((err) => Logger_1.default.log("ERROR", err));
        }
        else {
            const trackErr = player.get("trackErr");
            if (trackErr) {
                setTimeout(async () => {
                    const channel = this.client.channels.cache.get(player.textChannel);
                    const embed = new discord_js_light_1.MessageEmbed()
                        .setTitle(`**Agora Tocando**\n ${track.title} \n`)
                        .setColor('GREEN')
                        .setDescription(`[Duration: ${(0, lavalink_function_1.convertTime)(track.duration)}]\` [${track.requester}]\nVolume: \`${player.volume}\`%\nQueue size: \`${player.queue.size}\``)
                        .setTimestamp()
                        .setImage(track.displayThumbnail("hqdefault") || "https://cdn.openart.ai/stable_diffusion/3f8d588bd6d861a6bb818025cc02a2af4495c23f_2000x2000.webp");
                    const msg = {
                        embeds: [embed],
                        components: [...await (0, lavalink_function_1.button)(this.client, player.guild)]
                    };
                    const m = await channel.send(msg);
                    player.set("currentMessageId", m.id);
                    player.set("trackErr", false);
                }, 2e3);
                return;
            }
            const channel = this.client.channels.cache.get(player.textChannel);
            const embed = new discord_js_light_1.MessageEmbed()
                .setTitle(`**Agora Tocando**\n ${track.title} \n`)
                .setColor('GREEN')
                .setDescription(`[Duration: ${(0, lavalink_function_1.convertTime)(track.duration)}]\` [${track.requester}]\nVolume: \`${player.volume}\`%\nQueue size: \`${player.queue.size}\``)
                .setTimestamp()
                .setImage(track.displayThumbnail("hqdefault") || "https://cdn.openart.ai/stable_diffusion/3f8d588bd6d861a6bb818025cc02a2af4495c23f_2000x2000.webp");
            const msg = {
                embeds: [embed],
                components: [...await (0, lavalink_function_1.button)(this.client, player.guild)]
            };
            const m = await channel.send(msg);
            player.set("currentMessageId", m.id);
        }
    }
}
exports.default = TrackStart;
