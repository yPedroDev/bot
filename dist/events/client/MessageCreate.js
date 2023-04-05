"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const CommandHandler_1 = (0, tslib_1.__importDefault)(require("../../class/CommandHandler"));
const Event_1 = (0, tslib_1.__importDefault)(require("../../structures/Event"));
const SentryLoggers_1 = (0, tslib_1.__importDefault)(require("../../class/SentryLoggers"));
const Logger_1 = (0, tslib_1.__importDefault)(require("../../class/Logger"));
const MusicHandler_1 = (0, tslib_1.__importDefault)(require("../../class/MusicHandler"));
class MessageCreate extends Event_1.default {
    constructor(client) {
        super(client, "messageCreate");
    }
    async exec(message) {
        if (message.author.bot || message.channel.type === "DM")
            return;
        try {
            await CommandHandler_1.default.handleCommand(this.client, message);
            await MusicHandler_1.default.musicChannel(this.client, message);
        }
        catch (err) {
            SentryLoggers_1.default.getInstance().BotLoggers(err);
            Logger_1.default.log("ERROR", err);
        }
    }
}
exports.default = MessageCreate;
