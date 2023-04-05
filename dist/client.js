"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const Client_1 = (0, tslib_1.__importDefault)(require("./structures/Client"));
const client = new Client_1.default(['GUILDS', 'GUILD_MESSAGES', 'GUILD_MEMBERS', 'GUILD_VOICE_STATES']);
exports.default = client;
