"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const discord_js_1 = require("discord.js");
const path_1 = (0, tslib_1.__importDefault)(require("path"));
const require_all_1 = (0, tslib_1.__importDefault)(require("require-all"));
const RegisterError_1 = (0, tslib_1.__importDefault)(require("../errors/RegisterError"));
const Command_1 = (0, tslib_1.__importDefault)(require("../structures/Command"));
const Event_1 = (0, tslib_1.__importDefault)(require("../structures/Event"));
const client_functions_1 = require("../utils/client-functions");
const Logger_1 = (0, tslib_1.__importDefault)(require("./Logger"));
const Lava_1 = (0, tslib_1.__importDefault)(require("../structures/Lava"));
class Register {
    constructor(client) {
        this.commandPaths = [];
        this.eventsPath = [];
        this.lavaPaths = [];
        this.client = client;
        this.events = new discord_js_1.Collection();
        this.cooldowns = new discord_js_1.Collection();
        this.groups = new discord_js_1.Collection();
        this.commands = new discord_js_1.Collection();
        this.lava = new discord_js_1.Collection();
    }
    registerEvent(event) {
        if (this.events.some((e) => e.name === event.name))
            throw new RegisterError_1.default(`A event with the name "${event.name}" is already registered.`);
        this.events.set(event.name, event);
        this.client.on(event.name, event.exec.bind(event));
        Logger_1.default.log("INFO", `Event "${event.name}" loaded.`);
    }
    registerLava(lava) {
        if (this.lava.some((e) => e.info.name === lava.info.name))
            throw new RegisterError_1.default(`A LavaEvent with the name "${lava.info.name}" is already registered`);
        this.lava.set(lava.info.name, lava);
        this.client.manager?.on(lava.info.name, lava.run.bind(lava));
        Logger_1.default.log("INFO", `Lava "${lava.info.name}" loaded.`);
    }
    registerAllLava() {
        const lava = [];
        if (this.lavaPaths.length)
            this.lavaPaths.forEach(p => {
                delete require.cache[p];
            });
        (0, require_all_1.default)({
            dirname: path_1.default.join(__dirname, '..', 'lava'),
            recursive: true,
            filter: /\w*.[tj]s/g,
            resolve: x => lava.push(x),
            map: (name, filePath) => {
                if (filePath.endsWith('.ts') || filePath.endsWith('.js'))
                    this.lavaPaths.push(path_1.default.resolve(filePath));
                return name;
            }
        });
        for (let event of lava) {
            const valid = (0, client_functions_1.isConstructor)(event, Lava_1.default) || (0, client_functions_1.isConstructor)(event.default, Lava_1.default) || event instanceof Lava_1.default || event.default instanceof Lava_1.default;
            if (!valid)
                continue;
            if ((0, client_functions_1.isConstructor)(event, Lava_1.default))
                event = new event(this.client);
            else if ((0, client_functions_1.isConstructor)(event.default, Lava_1.default))
                event = new event.default(this.client);
            if (!(event instanceof Lava_1.default))
                throw new RegisterError_1.default(`Invalid Lava object to register: ${event}`);
            this.registerLava(event);
        }
    }
    registerAllEvents() {
        const events = [];
        if (this.eventsPath.length) {
            this.eventsPath.forEach(p => {
                delete require.cache[p];
            });
        }
        (0, require_all_1.default)({
            dirname: path_1.default.join(__dirname, "..", "events"),
            recursive: true,
            filter: /\w*.[tj]s/g,
            resolve: x => events.push(x),
            map: (name, filePath) => {
                if (filePath.endsWith(".ts") || filePath.endsWith(".js"))
                    this.eventsPath.push(path_1.default.resolve(filePath));
                return name;
            }
        });
        for (let event of events) {
            const valid = (0, client_functions_1.isConstructor)(event, Event_1.default) || (0, client_functions_1.isConstructor)(event.default, Event_1.default) || event instanceof Event_1.default || event.default instanceof Event_1.default;
            if (!valid)
                continue;
            if ((0, client_functions_1.isConstructor)(event, Event_1.default))
                event = new event(this.client);
            else if ((0, client_functions_1.isConstructor)(event.default, Event_1.default))
                event = new event.default(this.client);
            if (!(event instanceof Event_1.default))
                throw new RegisterError_1.default(`Invalid event object to register: ${event}`);
            this.registerEvent(event);
        }
    }
    registerCommand(command) {
        if (this.commands.some((x) => {
            if (x.info.name === command.info.name)
                return true;
            else if (x.info.aliases && x.info.aliases.includes(command.info.name))
                return true;
            return false;
        })) {
            throw new RegisterError_1.default(`A command with the name/alias "${command.info.name}" is already registered.`);
        }
        if (command.info.aliases) {
            for (const alias of command.info.aliases) {
                if (this.commands.some((x) => {
                    if (x.info.name === alias)
                        return true;
                    else if (x.info.aliases && x.info.aliases.includes(alias))
                        return true;
                    return false;
                })) {
                    throw new RegisterError_1.default(`A command with the name/alias "${alias}" is already registered.`);
                }
            }
        }
        this.commands.set(command.info.name, command);
        if (!this.groups.has(command.info.group)) {
            this.groups.set(command.info.group, [command.info.name]);
        }
        else {
            const groups = this.groups.get(command.info.group);
            groups.push(command.info.name);
            this.groups.set(command.info.group, groups);
        }
        Logger_1.default.log("INFO", `Command "${command.info.name}" loaded.`);
    }
    registerAllCommands() {
        const commands = [];
        if (this.commandPaths.length) {
            this.commandPaths.forEach(p => {
                delete require.cache[p];
            });
        }
        (0, require_all_1.default)({
            dirname: path_1.default.join(__dirname, "..", "commands"),
            recursive: true,
            filter: /\w*.[tj]s/g,
            resolve: x => commands.push(x),
            map: (name, filePath) => {
                if (filePath.endsWith(".ts") || filePath.endsWith(".js"))
                    this.commandPaths.push(path_1.default.resolve(filePath));
                return name;
            }
        });
        for (let command of commands) {
            const valid = (0, client_functions_1.isConstructor)(command, Command_1.default) || (0, client_functions_1.isConstructor)(command.default, Command_1.default) || command instanceof Command_1.default || command.default instanceof Command_1.default;
            if (!valid)
                continue;
            if ((0, client_functions_1.isConstructor)(command, Command_1.default))
                command = new command(this.client);
            else if ((0, client_functions_1.isConstructor)(command.default, Command_1.default))
                command = new command.default(this.client);
            if (!(command instanceof Command_1.default))
                throw new RegisterError_1.default(`Invalid command object to register: ${command}`);
            this.registerCommand(command);
        }
    }
    findCommand(command) {
        return this.commands.get(command) || [...this.commands.values()].find(cmd => cmd.info.aliases && cmd.info.aliases.includes(command));
    }
    findCommandsInGroup(group) {
        return this.groups.get(group);
    }
    getAllGroupNames() {
        return [...this.groups.keys()];
    }
    getCooldownTimestamps(commandName) {
        if (!this.cooldowns.has(commandName))
            this.cooldowns.set(commandName, new discord_js_1.Collection());
        return this.cooldowns.get(commandName);
    }
    pregisterAll() {
        this.registerAllCommands();
        this.registerAllEvents();
        this.registerAllLava();
    }
    registerAll() {
        const allEvents = [...this.events.keys()];
        allEvents.forEach(event => this.client.removeAllListeners(event));
        this.events = new discord_js_1.Collection();
        this.cooldowns = new discord_js_1.Collection();
        this.groups = new discord_js_1.Collection();
        this.commands = new discord_js_1.Collection();
        this.lava = new discord_js_1.Collection();
        this.pregisterAll();
    }
}
exports.default = Register;
