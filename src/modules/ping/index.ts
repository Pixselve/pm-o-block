import { Message } from "discord.js";
import { client }  from "../../index";
import Command     from "../../classes/command";

const ping = async (message: Message) => {
  await message.reply(`My pingy pong is ${Math.round(client.ping)} ms :smirk:`);
};

const pingCommand = new Command("ping", "Give my pingy pong", "SEND_MESSAGES", "", ping);
export default pingCommand;