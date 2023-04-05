"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const Event_1 = (0, tslib_1.__importDefault)(require("../../structures/Event"));
const discord_js_light_1 = require("discord.js-light");
const client_config_1 = require("../../utils/client-config");
const SentryLoggers_1 = (0, tslib_1.__importDefault)(require("../../class/SentryLoggers"));
const Logger_1 = (0, tslib_1.__importDefault)(require("../../class/Logger"));
class VoiceStateUpdate extends Event_1.default {
    constructor(client) {
        super(client, "voiceStateUpdate");
    }
    async exec(oldChannel, newState) {
        if (newState.channelId && newState.channel?.type === "GUILD_STAGE_VOICE" && newState.guild.me?.voice.suppress) {
            const botPermissions = newState.guild.me.permissions.has(discord_js_light_1.Permissions.FLAGS.SPEAK) || (newState.channel && newState.channel.permissionsFor(newState.guild.me).has(discord_js_light_1.Permissions.FLAGS.SPEAK));
            if (botPermissions) {
                newState.channel.permissionOverwrites.edit(newState.guild.me, { SPEAK: true, MOVE_MEMBERS: true, MUTE_MEMBERS: true });
                await newState.guild.me?.voice.setSuppressed(false).catch((err) => Logger_1.default.log("ERROR", err));
            }
        }
        if (oldChannel.channelId && (!newState.channelId || newState.channelId)) {
            const player = this.client.manager.players.get(newState.guild.id);
            if (player && oldChannel.channelId === player.voiceChannel) {
                if (!((!oldChannel.streaming && newState.streaming) || (oldChannel.streaming && !newState.streaming) || (!oldChannel.serverMute && newState.serverMute && (!newState.serverDeaf && !newState.selfDeaf)) || (oldChannel.serverMute && !newState.serverMute && (!newState.serverDeaf && !newState.selfDeaf)) || (!oldChannel.selfMute && newState.selfMute && (!newState.serverDeaf && !newState.selfDeaf)) || (oldChannel.selfMute && !newState.selfMute && (!newState.serverDeaf && !newState.selfDeaf)) || (!oldChannel.selfVideo && newState.selfVideo) || (oldChannel.selfVideo && !newState.selfVideo))) {
                    if (client_config_1.leaveEmpt && player && (!oldChannel.channel?.members || oldChannel.channel.members.size == 0 || oldChannel.channel.members.filter((m) => !m.user.bot && !m.voice.deaf && !m.voice.selfDeaf).size < 1)) {
                        setTimeout(async () => {
                            try {
                                let voice = newState.guild.channels.cache.get(player.voiceChannel);
                                if (voice)
                                    voice = await voice.fetch();
                                if (!voice)
                                    voice = await newState.guild.channels.fetch(player.voiceChannel).catch(() => { }) || false;
                                if (!voice)
                                    return player.destroy();
                                if (!voice.membes || voice.members.size === 0 || voice.members.filter((m) => !m.user.bot && !m.voice.deaf && !m.voice.selfDeaf).size < 1) {
                                    player.destroy();
                                    return;
                                }
                            }
                            catch (err) {
                                SentryLoggers_1.default.getInstance().BotLoggers(err);
                                console.log(err);
                            }
                        }, 6e4);
                    }
                }
            }
        }
    }
}
exports.default = VoiceStateUpdate;
