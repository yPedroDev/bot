"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateSetup = exports.generateEmbed = exports.queue = exports.convertTime = exports.button = void 0;
const tslib_1 = require("tslib");
const discord_js_light_1 = require("discord.js-light");
const Logger_1 = (0, tslib_1.__importDefault)(require("../class/Logger"));
const lodash_1 = (0, tslib_1.__importDefault)(require("lodash"));
async function button(client, guild) {
    const player = client.manager?.players.get(guild);
    const skip = new discord_js_light_1.MessageButton()
        .setLabel(`⏭ Next`)
        .setStyle('PRIMARY')
        .setDisabled(!player?.playing)
        .setCustomId(`${client.user?.id}-btn-next`);
    const pauseButton = new discord_js_light_1.MessageButton()
        .setLabel(`⏯ Pause/Resume`)
        .setStyle(`PRIMARY`)
        .setCustomId(`${client.user?.id}-btn-pause`);
    const stopButton = new discord_js_light_1.MessageButton()
        .setLabel('⏹️ Stop')
        .setStyle("DANGER")
        .setCustomId(`${client.user?.id}-btn-leave`);
    const repeatButton = new discord_js_light_1.MessageButton()
        .setLabel("🔂 Repeat Queue")
        .setDisabled(!player?.playing)
        .setStyle("PRIMARY")
        .setCustomId(`${client.user?.id}-btn-controls`);
    const row1 = new discord_js_light_1.MessageActionRow().addComponents(skip, pauseButton, stopButton, repeatButton);
    const queueButton = new discord_js_light_1.MessageButton()
        .setLabel("📜 Queue")
        .setStyle("PRIMARY")
        .setCustomId(`${client.user?.id}-btn-queue`);
    const mixButton = new discord_js_light_1.MessageButton()
        .setLabel("🎛️ Shuffle")
        .setDisabled(!player?.playing)
        .setStyle("PRIMARY")
        .setCustomId(`${client.user?.id}-btn-mix`);
    const controlsButton = new discord_js_light_1.MessageButton()
        .setLabel("🔂 Repeat Track")
        .setStyle("PRIMARY")
        .setDisabled(!player?.playing)
        .setCustomId(`${client.user?.id}-btn-repeat`);
    const row2 = new discord_js_light_1.MessageActionRow().addComponents(queueButton, mixButton, controlsButton);
    return [row1, row2];
}
exports.button = button;
function convertTime(duration) {
    let milliseconds = parseInt(duration % 1000 / 100);
    let seconds = parseInt(duration / 1000 % 60);
    let minutes = parseInt(duration / (1000 * 60) % 60);
    let hours = parseInt(duration / (1000 * 60 * 60) % 24);
    hours = (hours < 10) ? "0" + hours : hours;
    minutes = (minutes < 10) ? "0" + minutes : minutes;
    seconds = (seconds < 10) ? "0" + seconds : seconds;
    if (duration < 3600000) {
        return minutes + ":" + seconds;
    }
    else {
        return hours + ":" + minutes + ":" + seconds;
    }
}
exports.convertTime = convertTime;
async function queue(interaction, client) {
    try {
        const player = client.manager?.players.get(interaction.guildId);
        const currentTrack = player?.queue.current;
        if (!player?.playing || !currentTrack) {
            const pMsg = interaction.reply('Could not process queue atm, try later!');
            if (pMsg instanceof discord_js_light_1.CommandInteraction) {
                setTimeout(() => pMsg.deleteReply(), 3e3);
            }
            return;
        }
        if (player.queue.length === 0 || !player.queue.length) {
            const embed = new discord_js_light_1.MessageEmbed()
                .setColor('GREEN')
                .setDescription(`Now playing [${player.queue.current?.title}](${player.queue.current?.uri}) \`[${convertTime(player.queue.current?.duration)}]\` - ${player.queue.current?.requester}`);
            await interaction.channel?.send({ embeds: [embed] }).catch(() => { });
        }
        else {
            const queue = player.queue.map((track, index) => `\`${++index}\` - [${track.title}](${track.uri}) \`[${convertTime(track.duration)}]\` - ${track.requester}`);
            const mapping = lodash_1.default.chunk(queue, 10);
            const pages = mapping.map((s) => s.join("\n"));
            let page = 0;
            if (player.queue.size < 11) {
                const embed = new discord_js_light_1.MessageEmbed()
                    .setColor(`GREEN`)
                    .setDescription(`**Now Playing**\n[${player.queue.current?.title}](${player.queue.current?.uri}) \`[${convertTime(player.queue.current?.duration)}]\` - ${player.queue.current?.requester}\n\n**Queue Songs**\n${pages[page]}`)
                    .setTimestamp()
                    .setFooter({ text: `Page ${page + 1}/${pages.length}`, iconURL: interaction.guild?.iconURL() })
                    .setTitle(`${interaction.guild?.name} Queue`);
                await interaction.channel?.send({ embeds: [embed] }).catch(() => { });
            }
            else {
                const embed = new discord_js_light_1.MessageEmbed()
                    .setColor(`GREEN`)
                    .setDescription(`**Now Playing**\n[${player.queue.current?.title}](${player.queue.current?.uri}) \`[${convertTime(player.queue.current?.duration)}]\` - ${player.queue.current?.requester}\n\n**Queue Songs**\n${pages[page]}`)
                    .setTimestamp()
                    .setFooter({ text: `Page ${page + 1}/${pages.length}`, iconURL: interaction.guild?.iconURL() })
                    .setTitle(`${interaction.guild?.name} Queue`);
                const forward = new discord_js_light_1.MessageButton()
                    .setCustomId(`${client.user?.id}-btn-forward`)
                    .setEmoji("⏭️")
                    .setStyle("PRIMARY");
                const backward = new discord_js_light_1.MessageButton()
                    .setCustomId(`${client.user?.id}-btn-backward`)
                    .setEmoji("⏮️")
                    .setStyle("PRIMARY");
                const end = new discord_js_light_1.MessageButton()
                    .setCustomId(`${client.user?.id}-btn-end`)
                    .setEmoji("⏹️")
                    .setStyle("DANGER");
                const row1 = new discord_js_light_1.MessageActionRow().addComponents([backward, end, forward]);
                const msg = await interaction.channel?.send({ embeds: [embed], components: [row1] }).catch(() => { });
                const collector = interaction.channel?.createMessageComponentCollector({
                    filter: (b) => {
                        if (b.user.id === interaction.member?.user.id)
                            return true;
                        else {
                            b.reply({ ephemeral: true, content: `Only **${interaction.member?.user}** can use this button, if you want then you've to run the command again.` });
                            return false;
                        }
                    },
                    time: 6e4,
                    idle: 30e3
                });
                collector?.on("collect", async (button) => {
                    if (button.customId === `${client.user?.id}-btn-forward`) {
                        await button.deferUpdate().catch(() => { });
                        page = page + 1 < pages.length ? ++page : 0;
                        const embed = new discord_js_light_1.MessageEmbed()
                            .setColor(`GREEN`)
                            .setDescription(`**Now Playing**\n[${player.queue.current?.title}](${player.queue.current?.uri}) \`[${convertTime(player.queue.current?.duration)}]\` - ${player.queue.current?.requester}\n\n**Queue Songs**\n${pages[page]}`)
                            .setTimestamp()
                            .setFooter({ text: `Page ${page + 1}/${pages.length}`, iconURL: interaction.guild?.iconURL() })
                            .setTitle(`${interaction.guild?.name} Queue`);
                        await msg?.edit({
                            embeds: [embed],
                            components: [row1]
                        }).catch(() => { });
                    }
                    else if (button.customId === `${client.user?.id}-btn-backward`) {
                        await button.deferUpdate().catch(() => { });
                        page = page > 0 ? --page : pages.length - 1;
                        const embed = new discord_js_light_1.MessageEmbed()
                            .setColor(`GREEN`)
                            .setDescription(`**Now Playing**\n[${player.queue.current?.title}](${player.queue.current?.uri}) \`[${convertTime(player.queue.current?.duration)}]\` - ${player.queue.current?.requester}\n\n**Queue Songs**\n${pages[page]}`)
                            .setTimestamp()
                            .setFooter({ text: `Page ${page + 1}/${pages.length}`, iconURL: interaction.guild?.iconURL() })
                            .setTitle(`${interaction.guild?.name} Queue`);
                        await msg?.edit({
                            embeds: [embed],
                            components: [row1]
                        }).catch((err) => {
                            Logger_1.default.log("ERROR", `There is some error: ${err.stack}`);
                        });
                    }
                    else if (button.customId === `${client.user?.id}-btn-end`) {
                        await button.deferUpdate().catch(() => { });
                        collector.stop();
                    }
                    else
                        return;
                });
                collector?.on("end", async () => {
                    await msg?.delete();
                });
            }
        }
    }
    catch (err) {
        console.log(err);
    }
}
exports.queue = queue;
function generateEmbed(client, guildId, leave) {
    const guild = client.guilds.cache.get(guildId);
    if (!guild)
        return;
    const emojis = ['🎉', '🎸', '📻', '🍭', '⚡', '🍦', '✨', '🎏', '🎇', '🎱', '🎤', '🤿', '🔥', '🪄', '🎧', '🚫'];
    const embeds = [
        new discord_js_light_1.MessageEmbed()
            .setColor("RED")
            .setTitle(`📜 ${guild.name} Queue`)
            .setDescription(`**There is no queue here**`),
        new discord_js_light_1.MessageEmbed()
            .setColor("RED")
            .setTitle(`No music playing here.`)
            .setImage("https://cdn.discordapp.com/attachments/891235330735366164/891387071376269342/amelia_corp.png")
            .setFooter({ text: client.user?.tag, iconURL: guild.iconURL({ dynamic: true }) })
    ];
    const player = client.manager.players.get(guild.id);
    if (!leave && player && player.queue && player.queue.current) {
        const requester = player.queue.current.requester;
        embeds[1].setImage(`https://img.youtube.com/vi/${player.queue.current.identifier}/mqdefault.jpg`)
            .setColor("GREEN")
            .setFooter({ text: `Requested by: ${requester.tag}`, iconURL: requester.displayAvatarURL({ dynamic: true }) })
            .addField("⏰ Duration:", `[\`${convertTime(player.queue.current.duration)}\`]`, true)
            .addField("🎀 Author:", `**${player.queue.current.author}**`, true)
            .addField("📜 Queue Length:", `[\`${player.queue.length}\`]`)
            .setTitle(player.queue.current.title);
        // @ts-expect-error string
        delete embeds[1].description;
        const track = player.queue;
        const maxTrack = 10;
        const songs = track.slice(0, maxTrack);
        embeds[0] = new discord_js_light_1.MessageEmbed()
            .setTitle(`📜 ${guild.name} Queue [${player.queue.length} Tracks]`)
            .setColor("GREEN")
            .setDescription(`${songs.map((track, index) => `**\`${++index}\` - [${track.title.substring(0, 60).replace(/\[/igu, "\\[").replace(/\]/igu, "\\]")}](${track.uri})** - \`${track.isStream ? "LIVE STREAM" : convertTime(track.duration)}\``).join("\n").substring(0, 2048)}`);
        if (player.queue.length > 10) {
            embeds[0].addField(`**\` N. \` *${player.queue.length > maxTrack ? player.queue.length - maxTrack : player.queue.length} other Tracks ...***`, `\u200b`);
            embeds[0].addField(`**\` 0. \` __CURRENT TRACK__**`, `**[${player.queue.current.title.substring(0, 60).replace(/\[/igu, "\\[").replace(/\]/igu, "\\]")}](${player.queue.current.uri})** - \`${player.queue.current.isStream ? `LIVE STREAM` : convertTime(player.queue.current.duration)}\`\n> **Requested by: ${requester.tag}**`);
        }
    }
    const filterMenu = new discord_js_light_1.MessageSelectMenu()
        .setCustomId(`${client.user?.id}-filters-menus`)
        .addOptions(["Party", "Bass", "Radio", "Nightcore", "Daycore", "Vaporwave", "Pop", "Soft", "Trebblebass", "8D", "Karaoke", "Vibrato", "Earrape", "Tremolo", "Distortion", "Off"].map((x, index) => {
        return {
            label: x.substring(0, 25),
            value: x.substring(0, 25),
            description: `Load a music filter: "${x}"`.substring(0, 50),
            emoji: emojis[index]
        };
    }));
    let skip = new discord_js_light_1.MessageButton().setStyle("PRIMARY").setCustomId(`${client.user?.id}-btn-ch-skip`).setEmoji(`⏭`).setLabel(`Skip`).setDisabled();
    let stop = new discord_js_light_1.MessageButton().setStyle("DANGER").setCustomId(`${client.user?.id}-btn-ch-stop`).setEmoji(`⏹`).setLabel(`Stop`).setDisabled();
    let pause = new discord_js_light_1.MessageButton().setStyle("PRIMARY").setCustomId(`${client.user?.id}-btn-ch-pauses`).setEmoji('⏯').setLabel(`Resume/Pause`).setDisabled();
    let shuffle = new discord_js_light_1.MessageButton().setStyle("PRIMARY").setCustomId(`${client.user?.id}-btn-ch-shuffle`).setEmoji('🔀').setLabel(`Shuffle`).setDisabled();
    let repeats = new discord_js_light_1.MessageButton().setStyle("PRIMARY").setCustomId(`${client.user?.id}-btn-ch-repeats`).setEmoji(`🔁`).setLabel(`Repeat Song`).setDisabled();
    let repeatq = new discord_js_light_1.MessageButton().setStyle("PRIMARY").setCustomId(`${client.user?.id}-btn-ch-repeatq`).setEmoji(`🔂`).setLabel(`Repeat Queue`).setDisabled();
    let forward = new discord_js_light_1.MessageButton().setStyle("PRIMARY").setCustomId(`${client.user?.id}-btn-ch-forward`).setEmoji('⏩').setLabel(`+10 Sec`).setDisabled();
    let rewind = new discord_js_light_1.MessageButton().setStyle("PRIMARY").setCustomId(`${client.user?.id}-btn-ch-rewind`).setEmoji('⏪').setLabel(`-10 Sec`).setDisabled();
    if (!leave && player && player.queue && player.queue.current) {
        skip = skip.setDisabled(false);
        stop = stop.setDisabled(false);
        pause = pause.setDisabled(false);
        shuffle = shuffle.setDisabled(false);
        repeats = repeats.setDisabled(false);
        repeatq = repeatq.setDisabled(false);
        forward = forward.setDisabled(false);
        rewind = rewind.setDisabled(false);
    }
    const components = [
        new discord_js_light_1.MessageActionRow().addComponents([
            filterMenu
        ]),
        new discord_js_light_1.MessageActionRow().addComponents([
            skip,
            stop,
            pause,
            shuffle
        ]),
        new discord_js_light_1.MessageActionRow().addComponents([
            repeats,
            repeatq,
            forward,
            rewind
        ])
    ];
    return {
        embeds,
        components
    };
}
exports.generateEmbed = generateEmbed;
function generateSetup(message, client) {
    const embeds = [
        new discord_js_light_1.MessageEmbed()
            .setColor("RED")
            .setTitle(`📜 ${message.guild?.name} Queue`)
            .setDescription(`**There is no queue here**`),
        new discord_js_light_1.MessageEmbed()
            .setColor("RED")
            .setTitle(`No music playing here.`)
            .setImage("https://cdn.discordapp.com/attachments/891235330735366164/891387071376269342/amelia_corp.png")
            .setFooter({ text: client.user?.tag, iconURL: message.guild?.iconURL({ dynamic: true }) })
    ];
    const emojis = ['🎉', '🎸', '📻', '🍭', '⚡', '🍦', '✨', '🎏', '🎇', '🎱', '🎤', '🤿', '🔥', '🪄', '🎧', '🚫'];
    const filterMenu = new discord_js_light_1.MessageSelectMenu()
        .setCustomId(`${client.user?.id}-filters-menus`)
        .addOptions(["Party", "Bass", "Radio", "Nightcore", "Daycore", "Vaporwave", "Pop", "Soft", "Trebblebass", "8D", "Karaoke", "Vibrato", "Earrape", "Tremolo", "Distortion", "Off"].map((x, index) => {
        return {
            label: x.substring(0, 25),
            value: x.substring(0, 25),
            description: `Load a music filter: "${x}"`.substring(0, 50),
            emoji: emojis[index]
        };
    }));
    const components = [
        new discord_js_light_1.MessageActionRow().addComponents([
            filterMenu
        ]),
        new discord_js_light_1.MessageActionRow().addComponents([
            new discord_js_light_1.MessageButton().setStyle("PRIMARY").setCustomId(`${client.user?.id}-btn-ch-skip`).setEmoji(`⏭`).setLabel(`Skip`).setDisabled(),
            new discord_js_light_1.MessageButton().setStyle("DANGER").setCustomId(`${client.user?.id}-btn-ch-stop`).setEmoji(`⏹`).setLabel(`Stop`).setDisabled(),
            new discord_js_light_1.MessageButton().setStyle("PRIMARY").setCustomId(`${client.user?.id}-btn-ch-pauses`).setEmoji('⏯').setLabel(`⏯ Pause/Resume`).setDisabled(),
            new discord_js_light_1.MessageButton().setStyle("PRIMARY").setCustomId(`${client.user?.id}-btn-ch-shuffle`).setEmoji('🔀').setLabel(`⏯ Pause/Resume`).setDisabled(),
        ]),
        new discord_js_light_1.MessageActionRow().addComponents([
            new discord_js_light_1.MessageButton().setStyle("PRIMARY").setCustomId(`${client.user?.id}-btn-ch-repeats`).setEmoji(`🔁`).setLabel(`Repeat Song`).setDisabled(),
            new discord_js_light_1.MessageButton().setStyle("PRIMARY").setCustomId(`${client.user?.id}-btn-ch-repeatq`).setEmoji(`🔂`).setLabel(`Repeat Queue`).setDisabled(),
            new discord_js_light_1.MessageButton().setStyle("PRIMARY").setCustomId(`${client.user?.id}-btn-ch-forward`).setEmoji('⏩').setLabel(`+10 Sec`).setDisabled(),
            new discord_js_light_1.MessageButton().setStyle("PRIMARY").setCustomId(`${client.user?.id}-btn-ch-rewind`).setEmoji('⏪').setLabel(`-10 Sec`).setDisabled()
        ]),
    ];
    return { embeds, components };
}
exports.generateSetup = generateSetup;
