import Photon from '@generated/photon';
import * as Discord from "discord.js";

export const photon = new Photon();
export const client = new Discord.Client();


import nsfwDetector from "./modules/nsfwDetector/index"
import profileCreation from './modules/profileCreation';
import {warnList} from "./modules/warns";
import {ping} from './modules/ping';
import {load} from "nsfwjs";
import {addBadWord, badWord, badWordList} from "./modules/badWord";
import config from "./config"

(async () => {
    const model = await load(`file://nsfwjs/`, {size: 299});
    client.on("ready", async () => {
        console.log(`Logged as ${client.user.tag}`);
    });
    client.on("guildMemberAdd", async (user) => {
        await profileCreation(user)
    })
    client.on("message", async message => {
        if (message.author.bot) return;
        if (await badWord(message)) return
        if (message.content.includes("$warnlist")) {
            await warnList(message)
        }
        if (message.content.includes("$badWordList")) {
            await badWordList(message)
        }
        if (message.content.includes("$ping")) {
            await ping(message)
        }
        if (message.content.includes("$addBadWord")) {
            await addBadWord(message)
        }
        if (message.attachments.array().length > 0) {
            await nsfwDetector(message, model)
        }
    });
    client.login(config.token);
})();


async function cleanup() {
    await photon.disconnect();
}

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);

