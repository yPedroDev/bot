"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.escapeRegex = exports.delay = exports.getAndUpdate = exports.getAndCreate = exports.getModel = exports.topgg = exports.formatBytes = exports.formatSeconds = exports.isDevelopers = exports.isConstructor = void 0;
const tslib_1 = require("tslib");
require("moment-duration-format");
const moment_timezone_1 = (0, tslib_1.__importDefault)(require("moment-timezone"));
const topgg_autoposter_1 = (0, tslib_1.__importDefault)(require("topgg-autoposter"));
const Logger_1 = (0, tslib_1.__importDefault)(require("../class/Logger"));
const Models = (0, tslib_1.__importStar)(require("../Models"));
const isConstructorProxyHandler = {
    construct() {
        return Object.prototype;
    }
};
function isConstructor(func, _class) {
    try {
        new new Proxy(func, isConstructorProxyHandler)();
        if (!_class)
            return true;
        return func.prototype instanceof _class;
    }
    catch (err) {
        return false;
    }
}
exports.isConstructor = isConstructor;
function isDevelopers(client, userId) {
    return client.config.developers.includes(userId);
}
exports.isDevelopers = isDevelopers;
function formatSeconds(seconds, format = "Y [year] M [month] W [week] D [day] H [hour] m [minute] s [second]") {
    const str = moment_timezone_1.default.duration(seconds, "seconds").format(format);
    const arr = str.split(" ");
    let newStr = "";
    arr.forEach((value, index) => {
        if (isNaN(parseInt(value)))
            return;
        const val = parseInt(value);
        if (val === 0)
            return;
        const nextIndex = arr[index + 1];
        newStr += `${value} ${nextIndex} `;
    });
    return newStr.trim();
}
exports.formatSeconds = formatSeconds;
function formatBytes(bytes) {
    if (bytes === 0)
        return '0 Bytes';
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${parseFloat((bytes / Math.pow(1024, i)).toFixed(2))} ${sizes[i]}`;
}
exports.formatBytes = formatBytes;
function topgg(token, client) {
    const topgg = (0, topgg_autoposter_1.default)(token, client);
    topgg.on("posted", () => {
        Logger_1.default.log("SUCCESS", "Posted stats to Top.gg!");
    })
        .on("error", (err) => {
        Logger_1.default.log("ERROR", `There is some error: ${err.stack}`);
    });
}
exports.topgg = topgg;
async function getModel(model, filter) {
    const data = await Models[model].findOne(filter);
    return data;
}
exports.getModel = getModel;
async function getAndCreate(model, filter) {
    let data = await Models[model].findOne(filter);
    if (!data) {
        data = new Models[model](filter);
    }
    return data;
}
exports.getAndCreate = getAndCreate;
async function getAndUpdate(model, filter) {
    let data = await Models[model].findOneAndUpdate(filter);
    return data;
}
exports.getAndUpdate = getAndUpdate;
function delay(delayMs) {
    try {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(2);
            }, delayMs);
        });
    }
    catch (err) {
        Logger_1.default.log("ERROR", err.stack);
    }
}
exports.delay = delay;
function escapeRegex(str) {
    try {
        return str.replace(/[.*+?^${}()|[\]\\]/g, `\\$&`);
    }
    catch (err) {
        Logger_1.default.log("ERROR", err.stack);
    }
}
exports.escapeRegex = escapeRegex;
