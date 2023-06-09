import { MessageEmbed, Message } from "discord.js-light";
import Command from '../../structures/Command';
import DiscordClient from '../../structures/Client';
import Logger from '../../class/Logger';
import { convertTime } from '../../utils/lavalink-function';
import { TrackUtils } from 'erela.js';
import { LavalinkTrack } from 'lavasfy';

export default class Play extends Command {
    constructor(client: DiscordClient) {
        super(client, {
            name: 'play',
            aliases: ['p'],
            cooldown: 3,
            group: 'Music',
            examples: ['play <Titulo da musica>']
        });
    }

    async exec(message: Message, args: string[]): Promise<void> {
        const channel = message.member?.voice.channel;
        if (!channel) {
            const embed = new MessageEmbed()
            .setColor("RED")
            .setAuthor({ name: "❌ Error | Voice Channel" })
            .setDescription("Você Não Está Connectado no canal de voz!")
            message.channel.send({ embeds: [embed] });
            return;
        }

        const songName = args.join(" ");
        if (songName.match(/(?:https:\/\/open\.spotify\.com\/|spotify:)(?:.+)?(track|playlist|artist|episode|show|album)[\/:]([A-Za-z0-9]+)/)) {
            message.channel.send({ embeds: [new MessageEmbed().setAuthor({ name: "Spotify", iconURL: "https://i.imgur.com/cK7XIkw.png" }).setColor("AQUA").setTimestamp().setDescription(`Playlist is loding please wait...`)]}).then(msg => { setTimeout(() => {msg.delete()}, 3000);});
        } 

        const player = this.client.manager?.create({
            guild: message.guildId as string,
            textChannel: message.channelId  as string,
            voiceChannel: message.member?.voice.channelId as string,
            volume: 50 as number,
            selfDeafen: true as boolean
        });
        

        if (player?.state !== "CONNECTED") player?.connect();
        try {
            if (songName.match(this.client.lavasfy?.spotifyPattern as RegExp)) {
                await this.client.lavasfy?.requestToken();
                const node = this.client.lavasfy?.nodes.get("Main")
                const search = await node?.load(songName)
                if (search?.loadType === "PLAYLIST_LOADED") {
                    let songs = [];
                    for (let i = 0; i < search.tracks.length; i++) 
                    songs.push(TrackUtils.build(search.tracks[i] as LavalinkTrack, message.author));
                    player?.queue.add(songs);
                    if (!player?.playing && !player?.paused && player?.queue.totalSize === search.tracks.length)
                    player.play();
                    const embed = new MessageEmbed()
                    .setColor("RED")
                    .setTimestamp()
                    .setDescription(`**Adicionado na fila** [${search.playlistInfo.name}](${songName}) - [\`${search.tracks.length}\`]`);
                    message.channel.send({ embeds: [embed] });
                    return;
                } else if (search?.loadType.startsWith("TRACK")) {
                    player?.queue.add(TrackUtils.build(search.tracks[0] as LavalinkTrack));
                    if (!player?.playing && !player?.paused && !player?.queue.size)
                    player?.play();
                    const embed = new MessageEmbed()
                    .setColor("RED")
                    .setTimestamp()
                    .setDescription(`**Adicionado na fila** - [${search.tracks[0].info.title}](${search.tracks[0].info.uri})`)
                    message.channel.send({ embeds: [embed] });
                    return;
                } else {
                    message.channel.send({ embeds: [new MessageEmbed().setColor('RED').setTimestamp().setDescription('there were no results found.')]});
                    return;
                }
            } else {
                let res;
                try {
                    res = await player?.search(songName, message.author)
                    if (res?.loadType === "LOAD_FAILED") {
                        throw res.exception;
                    }
                } catch (e: any) {
                    Logger.log('ERROR', e);
                    message.reply(`Error while searching: ${e.message as string}`);
                }
        
                switch (res?.loadType) {
                    case "NO_MATCHES": {
                        if (!player?.queue.current) {
                            player?.destroy();
                        }
                        const m = await message.reply(`There no found for: ${songName as string}`);
                        setTimeout(() => {
                            message.delete() 
                            m.delete()
                        }, 5e3)
                        return;
                    }
                    case "TRACK_LOADED": {
                        const track = res.tracks[0];
                        player?.queue.add(track);
                        if (!player?.playing && !player?.paused && !player?.queue.length) player?.play();
                            const embed = new MessageEmbed()
                            .setColor('RED')
                            .setDescription(`**Adicionado na Fila: ${track.title}**`);
                            const m = await message.channel.send({ embeds: [embed] });
                            setTimeout(() => {
                                m.delete()
                            }, 5e3)
                            return;
                    }
                    case "PLAYLIST_LOADED": {
                        player?.queue.add(res.tracks);
                        if (!player?.playing && !player?.paused && player?.queue.totalSize === res.tracks.length) player.play();
                        const embed = new MessageEmbed()
                        .setColor('RED')
                        .setTimestamp()
                        .setDescription(`**Added Playlist to queue**\n${res.tracks.length} Songs **${res.playlist?.name}** - \`[${convertTime(res.playlist?.duration as number)}]\``);
                        const m = await message.channel.send({ embeds: [embed] });
                        setTimeout(() => {
                            m.delete()
                        }, 5e3)
                        return;
                    }
                    case "SEARCH_RESULT": {
                        const track = res.tracks[0];
                        player?.queue.add(track);
                        if (!player?.playing && !player?.paused && !player?.queue.length) player?.play();
                            const embed = new MessageEmbed()
                            .setColor('RED')
                            .setDescription(`**Adicionado na Fila: ${track.title}**`);
                            const m = await message.channel.send({ embeds: [embed] });
                            setTimeout(() => {
                                m.delete()
                            }, 5e3)
                            return;
                    }
                }
            }
        } catch (e) {
            console.log(e);
        }
    }
}