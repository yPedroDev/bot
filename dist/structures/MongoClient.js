"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const mongoose_1 = (0, tslib_1.__importDefault)(require("mongoose"));
const Logger_1 = (0, tslib_1.__importDefault)(require("../class/Logger"));
class Mongod {
    async connect() {
        mongoose_1.default.connect(process.env.MONGOD);
        mongoose_1.default.connection
            .on("connected", () => {
            Logger_1.default.log("SUCCESS", "MongoDB Successfully Connected");
        })
            .on("err", (err) => {
            Logger_1.default.log("ERROR", `MongoDB Connection error: ${err.stack}`);
        })
            .on("disconnected", () => {
            Logger_1.default.log("WARNING", "MongoDB Disconnected");
        });
    }
}
exports.default = Mongod;
