import {Message} from "discord.js";
import {client} from "../../index";

export const ping = async (message: Message) => {
    message.channel.send(`My pingy pong is ${client.ping} ms :smirk:`)
}