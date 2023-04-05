"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const Command_1 = (0, tslib_1.__importDefault)(require("../../structures/Command"));
const discord_js_light_1 = require("discord.js-light");
class JoinCommand extends Command_1.default {
    constructor(client) {
        super(client, {
            name: "join",
            description: "Entrar no canal de voz",
            examples: ["join"],
            group: "Music",
            cooldown: 3
        });
    }
    async exec(message) {
        const channel = message.member?.voice.channel;
        if (!channel) {
            const embed = new discord_js_light_1.MessageEmbed()
                .setColor("RED")
                .setAuthor({ name: "❌ Error | Voice Channel" })
                .setDescription("Você Não Está Connectado no canal de voz!");
            message.channel.send({ embeds: [embed] });
            return;
        }
        let player = this.client.manager.players.get(message.guildId);
        if (player) {
            const embed = new discord_js_light_1.MessageEmbed()
                .setColor("RED")
                .setAuthor("❌ Error | Voice Channel")
                .setDescription(`Ei ${message.author}, eu ja estou no canal de voz`);
            message.channel.send({ embeds: [embed] });
            return;
        }
        player = await this.client.manager.create({
            guild: message.guildId,
            voiceChannel: channel.id,
            textChannel: message.channel.id,
            selfDeafen: true,
            volume: 50
        });
        if (player.state !== "CONNECTED") {
            await player.connect();
            const embed = new discord_js_light_1.MessageEmbed()
                .setColor("GREEN")
                .setAuthor("✅ Successful | Joined Voice Channel!")
                .setDescription(`Agora você pode usar o commando >play`);
            message.channel.send({ embeds: [embed] });
            return;
        }
        else {
            const embed = new discord_js_light_1.MessageEmbed()
                .setColor("RED")
                .setAuthor("❌ Error | Voice Channel")
                .setDescription(`Ei ${message.author}, eu ja estou no canal de voz`);
            message.channel.send({ embeds: [embed] });
            return;
        }
    }
}
exports.default = JoinCommand;
