"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const discord_js_light_1 = require("discord.js-light");
const Command_1 = (0, tslib_1.__importDefault)(require("../../structures/Command"));
const Logger_1 = (0, tslib_1.__importDefault)(require("../../class/Logger"));
const lavalink_function_1 = require("../../utils/lavalink-function");
const erela_js_1 = require("erela.js");
class Play extends Command_1.default {
    constructor(client) {
        super(client, {
            name: 'play',
            aliases: ['p'],
            cooldown: 3,
            group: 'Music',
            examples: ['play <Titulo da musica>']
        });
    }
    async exec(message, args) {
        const channel = message.member?.voice.channel;
        if (!channel) {
            const embed = new discord_js_light_1.MessageEmbed()
                .setColor("RED")
                .setAuthor({ name: "❌ Error | Voice Channel" })
                .setDescription("Você Não Está Connectado no canal de voz!");
            message.channel.send({ embeds: [embed] });
            return;
        }
        const songName = args.join(" ");
        if (songName.match(/(?:https:\/\/open\.spotify\.com\/|spotify:)(?:.+)?(track|playlist|artist|episode|show|album)[\/:]([A-Za-z0-9]+)/)) {
            message.channel.send({ embeds: [new discord_js_light_1.MessageEmbed().setAuthor({ name: "Spotify", iconURL: "https://i.imgur.com/cK7XIkw.png" }).setColor("AQUA").setTimestamp().setDescription(`Playlist is loding please wait...`)] }).then(msg => { setTimeout(() => { msg.delete(); }, 3000); });
        }
        const player = this.client.manager?.create({
            guild: message.guildId,
            textChannel: message.channelId,
            voiceChannel: message.member?.voice.channelId,
            volume: 50,
            selfDeafen: true
        });
        if (player?.state !== "CONNECTED")
            player?.connect();
        try {
            if (songName.match(this.client.lavasfy?.spotifyPattern)) {
                await this.client.lavasfy?.requestToken();
                const node = this.client.lavasfy?.nodes.get("Main");
                const search = await node?.load(songName);
                if (search?.loadType === "PLAYLIST_LOADED") {
                    let songs = [];
                    for (let i = 0; i < search.tracks.length; i++)
                        songs.push(erela_js_1.TrackUtils.build(search.tracks[i], message.author));
                    player?.queue.add(songs);
                    if (!player?.playing && !player?.paused && player?.queue.totalSize === search.tracks.length)
                        player.play();
                    const embed = new discord_js_light_1.MessageEmbed()
                        .setColor("RED")
                        .setTimestamp()
                        .setDescription(`**Adicionado na fila** [${search.playlistInfo.name}](${songName}) - [\`${search.tracks.length}\`]`);
                    message.channel.send({ embeds: [embed] });
                    return;
                }
                else if (search?.loadType.startsWith("TRACK")) {
                    player?.queue.add(erela_js_1.TrackUtils.build(search.tracks[0]));
                    if (!player?.playing && !player?.paused && !player?.queue.size)
                        player?.play();
                    const embed = new discord_js_light_1.MessageEmbed()
                        .setColor("RED")
                        .setTimestamp()
                        .setDescription(`**Adicionado na fila** - [${search.tracks[0].info.title}](${search.tracks[0].info.uri})`);
                    message.channel.send({ embeds: [embed] });
                    return;
                }
                else {
                    message.channel.send({ embeds: [new discord_js_light_1.MessageEmbed().setColor('RED').setTimestamp().setDescription('there were no results found.')] });
                    return;
                }
            }
            else {
                let res;
                try {
                    res = await player?.search(songName, message.author);
                    if (res?.loadType === "LOAD_FAILED") {
                        throw res.exception;
                    }
                }
                catch (e) {
                    Logger_1.default.log('ERROR', e);
                    message.reply(`Error while searching: ${e.message}`);
                }
                switch (res?.loadType) {
                    case "NO_MATCHES": {
                        if (!player?.queue.current) {
                            player?.destroy();
                        }
                        const m = await message.reply(`There no found for: ${songName}`);
                        setTimeout(() => {
                            message.delete();
                            m.delete();
                        }, 5e3);
                        return;
                    }
                    case "TRACK_LOADED": {
                        const track = res.tracks[0];
                        player?.queue.add(track);
                        if (!player?.playing && !player?.paused && !player?.queue.length)
                            player?.play();
                        const embed = new discord_js_light_1.MessageEmbed()
                            .setColor('RED')
                            .setDescription(`**Adicionado na Fila: ${track.title}**`);
                        const m = await message.channel.send({ embeds: [embed] });
                        setTimeout(() => {
                            m.delete();
                        }, 5e3);
                        return;
                    }
                    case "PLAYLIST_LOADED": {
                        player?.queue.add(res.tracks);
                        if (!player?.playing && !player?.paused && player?.queue.totalSize === res.tracks.length)
                            player.play();
                        const embed = new discord_js_light_1.MessageEmbed()
                            .setColor('RED')
                            .setTimestamp()
                            .setDescription(`**Added Playlist to queue**\n${res.tracks.length} Songs **${res.playlist?.name}** - \`[${(0, lavalink_function_1.convertTime)(res.playlist?.duration)}]\``);
                        const m = await message.channel.send({ embeds: [embed] });
                        setTimeout(() => {
                            m.delete();
                        }, 5e3);
                        return;
                    }
                    case "SEARCH_RESULT": {
                        const track = res.tracks[0];
                        player?.queue.add(track);
                        if (!player?.playing && !player?.paused && !player?.queue.length)
                            player?.play();
                        const embed = new discord_js_light_1.MessageEmbed()
                            .setColor('RED')
                            .setDescription(`**Adicionado na Fila: ${track.title}**`);
                        const m = await message.channel.send({ embeds: [embed] });
                        setTimeout(() => {
                            m.delete();
                        }, 5e3);
                        return;
                    }
                }
            }
        }
        catch (e) {
            console.log(e);
        }
    }
}
exports.default = Play;
