"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const client_functions_1 = require("../utils/client-functions");
const SentryLoggers_1 = (0, tslib_1.__importDefault)(require("./SentryLoggers"));
class CommandHandler {
    static async handleCommand(client, message) {
        const self = message.guild.me;
        if (!self.permissions.has("SEND_MESSAGES") || !message.channel.permissionsFor(self).has("SEND_MESSAGES"))
            return;
        const prefix = client.config.prefix;
        const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        const prefixReg = new RegExp(`^(<@!?${client.user.id}>|${escapeRegex(prefix)})\\s*`);
        if (!prefixReg.test(message.content))
            return;
        const [macthPrefix] = message.content.match(prefixReg);
        if (message.content.toLocaleLowerCase().indexOf(macthPrefix) !== 0)
            return;
        const args = message.content.slice(macthPrefix.length).trim().split(/ +/g);
        const command = args.shift().toLowerCase();
        const cmd = client.register.findCommand(command);
        if (!cmd) {
            if (client.config.unknownErrorMessage) {
                await message.channel.send({
                    embeds: [{
                            color: "RED",
                            title: "⚠️ Unkown Command",
                            description: `${message.author}, Looks like i don't have that command. You can type \`${client.config.prefix}help\` to show all of my command.`
                        }]
                });
                return;
            }
        }
        if (cmd?.info.enabled === false)
            return;
        if (cmd?.info.onlyNsfw === true && !message.channel.nsfw && !(0, client_functions_1.isDevelopers)(client, message.author.id)) {
            await message.channel.send({
                embeds: [{
                        color: "RED",
                        title: "🔞 Eyy....",
                        description: `${message.author}, Yow yow yow. You can't use nsfw command at non-nsfw channels.`
                    }]
            });
            return;
        }
        if (cmd?.info.require) {
            if (cmd.info.require.developers && !(0, client_functions_1.isDevelopers)(client, message.author.id))
                return;
            if (cmd.info.require.userPermissions && !(0, client_functions_1.isDevelopers)(client, message.author.id)) {
                const perms = [];
                cmd.info.require.userPermissions.forEach(permission => {
                    if (message.member.permissions.has(permission))
                        return;
                    return perms.push(`\`${permission}\``);
                });
                if (perms.length) {
                    await message.channel.send({
                        embeds: [{
                                color: "YELLOW",
                                title: "⚠️ Missing Permissions",
                                description: `${message.author}, You have no permission to run this command.\n\nPermission neded: \`${perms.join("\n")}\``
                            }]
                    });
                    return;
                }
            }
            if (cmd.info.require.clientPermissions) {
                const perms = [];
                cmd.info.require.clientPermissions.forEach(permissions => {
                    if (message.guild.me?.permissions.has(permissions))
                        return;
                    return perms.push(`\`${permissions}\``);
                });
                if (perms.length) {
                    await message.channel.send({
                        embeds: [{
                                color: "YELLOW",
                                title: "⚠️ Missing Permissions",
                                description: `${message.author}, I have no permission to run this action.\n\nPermission neded: \`${perms.join("\n")}\``
                            }]
                    });
                    return;
                }
            }
        }
        let addColdown = false;
        const now = Date.now();
        const timestamp = client.register.getCooldownTimestamps(cmd?.info.name);
        const cooldownAmout = cmd?.info.cooldown ? cmd.info.cooldown * 1000 : 0;
        if (cmd?.info.cooldown) {
            if (timestamp.has(message.author.id)) {
                const currentTime = timestamp.get(message.author.id);
                if (!currentTime)
                    return;
                const expTime = currentTime + cooldownAmout;
                if (now < expTime) {
                    if (message.deletable) {
                        await message.delete();
                        const timeLeft = (expTime - now) / 1000;
                        await message.channel.send({
                            embeds: [{
                                    color: "RED",
                                    title: "⏲️ Yow! Calm Down",
                                    description: `${message.author}, You can run this command again in \`${(0, client_functions_1.formatSeconds)(Math.floor(timeLeft))}\` just relax mate.`
                                }]
                        }).then(msg => setTimeout(async () => await msg.delete().catch(() => { }), 3000));
                        return;
                    }
                    await message.channel.send({
                        embeds: [{
                                color: "RED",
                                title: "⚠️ Missing Permissions",
                                description: `${message.author}, I have no permissions to delete this message.\n\n\Permissions neded: \`MANAGE_MESSAGE\``
                            }]
                    });
                    return;
                }
            }
            addColdown = true;
        }
        try {
            let applyCooldown = true;
            await cmd?.exec(message, args, () => {
                applyCooldown = false;
            });
            if (typeof addColdown !== "undefined" && typeof applyCooldown !== "undefined" && !(0, client_functions_1.isDevelopers)(client, message.author.id)) {
                timestamp.set(message.author.id, now);
                setTimeout(() => timestamp.delete(message.author.id), cooldownAmout);
            }
        }
        catch (err) {
            SentryLoggers_1.default.getInstance().BotLoggers(err);
            await cmd?.onError(message, err);
        }
    }
}
exports.default = CommandHandler;
