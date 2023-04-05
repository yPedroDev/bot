"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const Command_1 = (0, tslib_1.__importDefault)(require("../../structures/Command"));
const discord_js_light_1 = require("discord.js-light");
class Volume extends Command_1.default {
    constructor(client) {
        super(client, {
            name: 'volume',
            aliases: ['vol'],
            group: 'Music',
            examples: ['volume 10<Number ( Max Volume 200)>'],
            cooldown: 3
        });
    }
    async exec(message, args) {
        const channel = message.member?.voice.channel;
        if (!channel) {
            const embed = new discord_js_light_1.MessageEmbed()
                .setColor("RED")
                .setAuthor({ name: "❌ Error | Voice Channel" })
                .setDescription("You're not in voice channel, make sure you join voice channel in somewhere");
            message.channel.send({ embeds: [embed] });
            return;
        }
        let vol = Number(args[0]);
        const maxVol = 200;
        if (!vol)
            return message.channel.send(`Please send me specific number`);
        else if (vol > maxVol)
            vol = 200;
        const player = this.client.manager?.players.get(message.guildId);
        if (!player)
            return message.channel.send(`There is no music play at this server!`);
        player?.setVolume(vol);
        return message.channel.send(`Volume set to: \`${vol}\`%`);
    }
}
exports.default = Volume;
