"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const Logger_1 = (0, tslib_1.__importDefault)(require("../class/Logger"));
const SentryLoggers_1 = (0, tslib_1.__importDefault)(require("../class/SentryLoggers"));
const client_functions_1 = require("../utils/client-functions");
class Command {
    constructor(client, info) {
        this.client = client;
        this.info = info;
    }
    async onError(message, error) {
        SentryLoggers_1.default.getInstance().BotLoggers(error);
        Logger_1.default.log("ERROR", `${error.stack}`);
        await message.channel.send({
            embeds: [{
                    color: "RED",
                    title: "❌ Error",
                    description: `${message.author}, an error occured while running this command. Please try again later.`
                }]
        });
    }
    isUsable(message, checkNsfw = false) {
        if (this.info.enabled === false)
            return false;
        if (checkNsfw && this.info.onlyNsfw === true && !message.channel.nsfw && !(0, client_functions_1.isDevelopers)(this.client, message.author.id))
            return false;
        if (this.info.require) {
            if (this.info.require.developers && !(0, client_functions_1.isDevelopers)(this.client, message.author.id))
                return false;
            if (this.info.require.userPermissions && !(0, client_functions_1.isDevelopers)(this.client, message.author.id)) {
                const perms = [];
                this.info.require.userPermissions.forEach(permission => {
                    if (message.member.permissions.has(permission))
                        return;
                    return perms.push(permission);
                });
                if (perms.length)
                    return false;
            }
            if (this.info.require.clientPermissions) {
                const perms = [];
                this.info.require.clientPermissions.forEach(permissions => {
                    if (message.guild?.me.permissions.has(permissions))
                        return;
                    return perms.push(permissions);
                });
                if (perms.length)
                    return false;
            }
        }
        return true;
    }
}
exports.default = Command;
