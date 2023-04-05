"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const Command_1 = (0, tslib_1.__importDefault)(require("../../structures/Command"));
const discord_js_light_1 = require("discord.js-light");
class Resume extends Command_1.default {
    constructor(client) {
        super(client, {
            name: 'resume',
            description: 'Resume the music',
            group: 'Music',
            examples: ['resume'],
            cooldown: 3
        });
    }
    async exec(message) {
        const channel = message.member?.voice.channel;
        if (!channel) {
            const embed = new discord_js_light_1.MessageEmbed()
                .setColor("RED")
                .setAuthor({ name: "❌ Error | Voice Channel" })
                .setDescription("Você não está connectado no canal de voz");
            message.channel.send({ embeds: [embed] });
            return;
        }
        const player = this.client.manager?.players.get(message.guildId);
        if (!player)
            return message.channel.send(`Não tenhe nenhuma musica tocando.`);
        if (!player?.paused)
            return message.channel.send(`Musica ja está resumida.`);
        player?.pause(!player?.paused);
        return message.channel.send(`Musica resumida!`);
    }
}
exports.default = Resume;
