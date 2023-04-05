"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
/* eslint-disable @typescript-eslint/no-extraneous-class */
const chalk_1 = (0, tslib_1.__importDefault)(require("chalk"));
const moment_1 = (0, tslib_1.__importDefault)(require("moment"));
class Logger {
    static log(type, message, space = false, format = "DD/MM/YYY HH:mm:ss") {
        let color;
        switch (type) {
            case "SUCCESS":
                color = "green";
                break;
            case "WARNING":
                color = "yellow";
                break;
            case "ERROR":
                color = "red";
                break;
            case "INFO":
                color = "blue";
        }
        console.log(`${space ? "\n" : ""}${chalk_1.default.magenta(`${(0, moment_1.default)().format(format)}`)} ${chalk_1.default[color].bold(`${type}`)} ${message}${space ? "\n" : ""}`);
    }
}
exports.default = Logger;
