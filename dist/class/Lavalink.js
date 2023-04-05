"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const erela_js_1 = require("erela.js");
const lavasfy_1 = require("lavasfy");
const erela_js_deezer_1 = (0, tslib_1.__importDefault)(require("erela.js-deezer"));
const erela_js_apple_1 = (0, tslib_1.__importDefault)(require("erela.js-apple"));
const erela_js_facebook_1 = (0, tslib_1.__importDefault)(require("erela.js-facebook"));
const erela_js_filter_1 = (0, tslib_1.__importDefault)(require("erela.js-filter"));
const Register_1 = (0, tslib_1.__importDefault)(require("./Register"));
const client_config_1 = require("../utils/client-config");
class Lavalink {
    constructor(client) {
        this.client = client;
        this.register = new Register_1.default(client);
    }
    async connect() {
        const client = this.client;
        const { clientID, clientSecret } = process.env;
        client.lavasfy = new lavasfy_1.LavasfyClient({
            clientID: clientID,
            clientSecret: clientSecret,
            playlistLoadLimit: 5,
            audioOnlyResults: true,
            autoResolve: true,
            useSpotifyMetadata: true
        }, [
            {
                id: 'KiaraLavalink',
                host: process.env.HOST,
                port: client_config_1.LAVA_PORT,
                password: process.env.PASSWORD,
                secure: client_config_1.LAVA_SECURE,
            }
        ]);
        client.manager = new erela_js_1.Manager({
            plugins: [
                new erela_js_deezer_1.default({ albumLimit: 10, playlistLimit: 10 }),
                // @ts-ignore
                new erela_js_apple_1.default(),
                new erela_js_facebook_1.default(),
                new erela_js_filter_1.default()
            ],
            nodes: [
                {
                    identifier: 'Kiara Lavalink',
                    host: process.env.HOST,
                    port: client_config_1.LAVA_PORT,
                    password: process.env.PASSWORD,
                    secure: client_config_1.LAVA_SECURE,
                    retryDelay: 3000
                }
            ],
            send(id, payload) {
                const guild = client.guilds.cache.get(id);
                if (guild)
                    guild.shard.send(payload);
            }
        });
    }
}
exports.default = Lavalink;
