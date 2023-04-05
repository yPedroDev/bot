"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const discord_js_light_1 = require("discord.js-light");
const Command_1 = (0, tslib_1.__importDefault)(require("../../structures/Command"));
const client_functions_1 = require("../../utils/client-functions");
class HelpCommand extends Command_1.default {
    constructor(client) {
        super(client, {
            name: 'help',
            group: 'Info',
            description: 'Mostra todos os commandos',
            cooldown: 5,
            examples: ['help filter<Command Name>']
        });
    }
    getAvailableGroups(message) {
        const registry = this.client.register;
        const groupKeys = registry.getAllGroupNames();
        const groups = [];
        groupKeys.forEach((group) => {
            const commandsInGroup = registry.findCommandsInGroup(group);
            const commands = [];
            commandsInGroup.forEach(commandName => {
                const command = registry.findCommand(commandName);
                if (!command.isUsable(message))
                    return;
                commands.push(commandName);
            });
            if (commands.length)
                groups.push({ name: group, commands });
        });
        return groups;
    }
    async sendHelpMessage(message, groups) {
        const embed = new discord_js_light_1.MessageEmbed({
            color: "GREEN",
            title: "Help",
            footer: {
                text: `Type "${this.client.config.prefix}help [command-name]" for more information.`
            }
        });
        groups.forEach(group => embed.addField(`${group.name} Commands`, group.commands.map((x) => `\`${x}\``).join(" ")));
        await message.channel.send({ embeds: [embed] });
    }
    async exec(message, args) {
        const groups = this.getAvailableGroups(message);
        if (!args[0])
            return await this.sendHelpMessage(message, groups);
        const command = this.client.register.findCommand(args[0].toLocaleLowerCase());
        if (!command)
            return await this.sendHelpMessage(message, groups);
        var isAvailable = true;
        groups.forEach(group => {
            if (group.commands.includes(command.info.name))
                isAvailable = true;
        });
        if (!isAvailable)
            return await this.sendHelpMessage(message, groups);
        const embed = new discord_js_light_1.MessageEmbed({
            color: 'GREEN',
            title: 'Help',
            fields: [
                {
                    name: 'Name',
                    value: command.info.name
                },
                {
                    name: 'Group',
                    value: command.info.group
                },
                {
                    name: 'Cooldown',
                    value: command.info.cooldown ? (0, client_functions_1.formatSeconds)(command.info.cooldown) : 'No cooldown'
                },
                {
                    name: 'Aliases',
                    value: command.info.aliases ? command.info.aliases.map((x) => `\`${x}\``).join(' ') : 'No aliases'
                },
                {
                    name: 'Example Usages',
                    value: command.info.examples ? command.info.examples.map((x) => `\`${x}\``).join('\n') : 'No examples'
                },
                {
                    name: 'Description',
                    value: command.info.description ? command.info.description : 'No description'
                }
            ]
        });
        if (command.info.require) {
            if (command.info.require.developers)
                embed.setFooter('This is a developer command.');
            if (command.info.require.userPermissions)
                embed.addField('Permission Requirements', command.info.require.userPermissions.map((x) => `\`${x}\``).join('\n'));
        }
        await message.channel.send({ embeds: [embed] });
    }
}
exports.default = HelpCommand;
