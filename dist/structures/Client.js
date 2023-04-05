"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const discord_js_light_1 = require("discord.js-light");
const Register_1 = (0, tslib_1.__importDefault)(require("../class/Register"));
const Lavalink_1 = (0, tslib_1.__importDefault)(require("../class/Lavalink"));
const WebClient_1 = (0, tslib_1.__importDefault)(require("./WebClient"));
const MongoClient_1 = (0, tslib_1.__importDefault)(require("./MongoClient"));
const Models = (0, tslib_1.__importStar)(require("../Models"));
class DiscordClient extends discord_js_light_1.Client {
    constructor(intents) {
        super({ intents, makeCache: discord_js_light_1.Options.cacheWithLimits({
                ChannelManager: Infinity,
                GuildChannelManager: Infinity,
                GuildManager: Infinity,
                GuildMemberManager: Infinity,
                MessageManager: Infinity,
                StageInstanceManager: Infinity,
                UserManager: Infinity,
                VoiceStateManager: Infinity // guild.voiceStates
            }) });
        this.config = {
            token: process.env.TOKEN,
            prefix: process.env.PREFIX,
            developers: JSON.parse(process.env.DEVELOPERS),
            unknownErrorMessage: false
        };
        this.erela = new Lavalink_1.default(this);
        this.erela.connect();
        this.register = new Register_1.default(this);
        this.register.registerAll();
        this.web = new WebClient_1.default();
        this.mongo = new MongoClient_1.default();
        this.model = Models;
    }
    async start() {
        await this.web.Main();
        await this.mongo.connect();
        await this.login(this.config.token);
    }
}
exports.default = DiscordClient;
