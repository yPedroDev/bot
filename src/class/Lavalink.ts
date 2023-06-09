import DiscordClient from "../structures/Client";
import { Manager } from "erela.js";
import { LavasfyClient } from "lavasfy";
import Deezer from "erela.js-deezer";
import Apple from "erela.js-apple";
import Facebook from "erela.js-facebook"
import Filter from "erela.js-filter";
import Register from "./Register";
import { LAVA_PORT, LAVA_SECURE } from "../utils/client-config";

export default class Lavalink {
    readonly client: DiscordClient;
    readonly register: Register
    constructor(client: DiscordClient) {
        this.client = client;
        this.register = new Register(client);
    }

    async connect() {
        const client = this.client;
        const { clientID , clientSecret } = process.env;
        client.lavasfy = new LavasfyClient(
            {
                clientID: clientID as string,
                clientSecret: clientSecret as string,
                playlistLoadLimit: 5,
                audioOnlyResults: true,
                autoResolve: true,
                useSpotifyMetadata: true
            }, [
                {
                    id: 'KiaraLavalink',
                    host: process.env.HOST as string,
                    port: LAVA_PORT,
                    password: process.env.PASSWORD as string,
                    secure: LAVA_SECURE,
            }
        ]);
        client.manager = new Manager({
            plugins: [
                new Deezer({ albumLimit: 10, playlistLimit: 10 }),
                // @ts-ignore
                new Apple(),
                new Facebook(),
                new Filter()
            ],
            nodes: [
                {
                    identifier: 'Kiara Lavalink',
                    host: process.env.HOST as string,
                    port: LAVA_PORT,
                    password: process.env.PASSWORD as string,
                    secure: LAVA_SECURE,
                    retryDelay: 3000
                }
            ],
            send(id, payload) {
                const guild = client.guilds.cache.get(id);
                if (guild) guild.shard.send(payload);
            }
        });
    }
}