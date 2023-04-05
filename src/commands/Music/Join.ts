import Command from "../../structures/Command";
import DiscordClient from "../../structures/Client";
import { Message, MessageEmbed } from "discord.js-light";

export default class JoinCommand extends Command {
    constructor(client: DiscordClient) {
        super(client, {
            name: "join",
            description: "Entrar no canal de voz",
            examples: ["join"],
            group: "Music",
            cooldown: 3
        });
    }

    async exec(message: Message) {
        const channel = message.member?.voice.channel;
        if (!channel) {
            const embed = new MessageEmbed()
            .setColor("RED")
            .setAuthor({ name: "❌ Error | Voice Channel" })
            .setDescription("Você Não Está Connectado no canal de voz!")
            message.channel.send({ embeds: [embed] });
            return;
        }

        let player = this.client.manager.players.get(message.guildId as string);
        if (player) {
            const embed = new MessageEmbed()
            .setColor("RED")
            .setAuthor("❌ Error | Voice Channel")
            .setDescription(`Ei ${message.author}, eu ja estou no canal de voz`)
            message.channel.send({ embeds: [embed] });
            return;
        }

        player = await this.client.manager.create({
            guild: message.guildId as string,
            voiceChannel: channel.id as string,
            textChannel: message.channel.id as string,
            selfDeafen: true,
            volume: 50
        });

        if (player.state !== "CONNECTED") {
            await player.connect();
            const embed = new MessageEmbed()
            .setColor("GREEN")
            .setAuthor("✅ Successful | Joined Voice Channel!")
            .setDescription(`Agora você pode usar o commando >play`)
            message.channel.send({ embeds: [embed] });
            return;
        } else {
            const embed = new MessageEmbed()
            .setColor("RED")
            .setAuthor("❌ Error | Voice Channel")
            .setDescription(`Ei ${message.author}, eu ja estou no canal de voz`)
            message.channel.send({ embeds: [embed] });
            return;
        }
    }
}