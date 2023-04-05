"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const express_1 = (0, tslib_1.__importDefault)(require("express"));
const body_parser_1 = (0, tslib_1.__importDefault)(require("body-parser"));
const cookie_parser_1 = (0, tslib_1.__importDefault)(require("cookie-parser"));
const path_1 = require("path");
const route_1 = (0, tslib_1.__importDefault)(require("../route"));
const Logger_1 = (0, tslib_1.__importDefault)(require("../class/Logger"));
class WebClient {
    async Main() {
        const app = (0, express_1.default)();
        app
            .use((0, cookie_parser_1.default)())
            .use(body_parser_1.default.json())
            .use(body_parser_1.default.urlencoded({ extended: true }))
            .use(express_1.default.static("./src/public"))
            .set("view engine", ".ejs")
            .set("views", (0, path_1.join)(__dirname, "..", "..", "views"))
            .set("port", process.env.PORT || 3000)
            .use("/", route_1.default)
            .listen(app.get("port"), () => {
            Logger_1.default.log("SUCCESS", `Website linstning on :::${app.get("port")}:::`);
        });
        process.on("uncaughtException", r => {
            console.dir(r);
        });
    }
}
exports.default = WebClient;
