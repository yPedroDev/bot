import Command from '../../structures/Command';
import DiscordClient from '../../structures/Client';
import { MessageEmbed, Message } from "discord.js-light";

export default class Resume extends Command {
    constructor(client: DiscordClient) {
        super(client, {
            name: 'resume',
            description: 'Resume the music',
            group: 'Music',
            examples: ['resume'],
            cooldown: 3
        });
    }

    async exec(message: Message) {
        const channel = message.member?.voice.channel;
        if (!channel) {
            const embed = new MessageEmbed()
            .setColor("RED")
            .setAuthor({ name: "❌ Error | Voice Channel" })
            .setDescription("Você não está connectado no canal de voz")
            message.channel.send({ embeds: [embed] });
            return;
        }

        const player = this.client.manager?.players.get(message.guildId as string);
        if (!player) return message.channel.send(`Não tenhe nenhuma musica tocando.`);
        if (!player?.paused) return message.channel.send(`Musica ja está resumida.`);

        player?.pause(!player?.paused);
        return message.channel.send(`Musica resumida!`);
    }
}