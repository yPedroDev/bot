"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const Event_1 = (0, tslib_1.__importDefault)(require("../../structures/Event"));
const SentryLoggers_1 = (0, tslib_1.__importDefault)(require("../../class/SentryLoggers"));
const MusicHandler_1 = (0, tslib_1.__importDefault)(require("../../class/MusicHandler"));
class InteractionCreate extends Event_1.default {
    constructor(client) {
        super(client, "interactionCreate");
    }
    async exec(interaction) {
        try {
            await MusicHandler_1.default.textMusic(interaction, this.client);
            await MusicHandler_1.default.musicText(interaction, this.client);
        }
        catch (err) {
            SentryLoggers_1.default.getInstance().BotLoggers(err);
            if (interaction.isApplicationCommand() || interaction.isMessageComponent() || interaction.isSelectMenu() || interaction.isContextMenu()) {
                return interaction[interaction.replied ? 'editReply' : 'reply'](`Algo deu errado ao usar, /commando`);
            }
        }
    }
}
exports.default = InteractionCreate;
