"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const Command_1 = (0, tslib_1.__importDefault)(require("../../structures/Command"));
const discord_js_light_1 = require("discord.js-light");
class Stop extends Command_1.default {
    constructor(client) {
        super(client, {
            name: 'stop',
            description: 'Stop the music',
            group: 'Music',
            examples: ['stop'],
            cooldown: 3
        });
    }
    async exec(message) {
        const channel = message.member?.voice.channel;
        if (!channel) {
            const embed = new discord_js_light_1.MessageEmbed()
                .setColor("RED")
                .setAuthor({ name: "❌ Error | Voice Channel" })
                .setDescription("Você Não está connectado, no canal de voz.");
            message.channel.send({ embeds: [embed] });
            return;
        }
        const player = this.client.manager?.players.get(message.guildId);
        if (!player)
            return message.channel.send(`Não Tenhe nenhuma musica tocando neste momento.`);
        player.destroy();
        await message.react('✅');
        return message.channel.send(`Musica parou com successo!`);
    }
}
exports.default = Stop;
