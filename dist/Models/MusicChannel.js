"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IMusic = void 0;
const mongoose_1 = require("mongoose");
const IMusicSchema = new mongoose_1.Schema({
    guildId: String,
    channelId: String,
    musicId: String
});
exports.IMusic = (0, mongoose_1.model)("IMusic", IMusicSchema);
