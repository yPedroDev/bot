"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const Command_1 = (0, tslib_1.__importDefault)(require("../../structures/Command"));
const discord_js_light_1 = require("discord.js-light");
class ForwardCommand extends Command_1.default {
    constructor(client) {
        super(client, {
            name: "forward",
            aliases: ["skip"],
            description: "Pular a musica",
            examples: ["skip/forward <Segundos>"],
            group: "Music",
            cooldown: 3
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
        if (!args[0]) {
            const embed = new discord_js_light_1.MessageEmbed()
                .setColor("RED")
                .setAuthor("❌ Error | Missing Permissions")
                .setDescription("Porfavor digite um numero, para pular a musica");
            message.channel.send({ embeds: [embed] });
            return;
        }
        const player = this.client.manager.players.get(message.guildId);
        if (!player) {
            const embed = new discord_js_light_1.MessageEmbed()
                .setColor("RED")
                .setAuthor("❌ Erro | No Player")
                .setDescription("Não tenhe nenhuma musica tocando agora.");
            message.channel.send({ embeds: [embed] });
            return;
        }
        let seektime = player.position + Number(args[0]);
        if (Number(args[0]) <= 0)
            seektime = player.position;
        if (seektime >= Number(player.queue.current?.duration))
            seektime = Number(player.queue.current?.duration) - 1000;
        player.seek(seektime);
        const embed = new discord_js_light_1.MessageEmbed()
            .setColor("GREEN")
            .setAuthor("Musica Pulada ate \`${convertTime(player.position)}\`");
        message.channel.send({ embeds: [embed] });
        return;
    }
}
exports.default = ForwardCommand;
