import {Message}                  from "discord.js";
import Command, {CommandArgument} from "../../classes/command";
import commands                   from "../commands";
import {MyEmbededError}           from "../../classes/embeded";
import command                    from "../../classes/command";

const helpCommand = async (message: Message, args?: string[]) => {
  try {
    if (args.length > 0) {
      const command = commands.find(command => command.name === args[0]);
      if (!command) throw new Error(`The command "${args[0]}" does not exists`);
      await message.channel.send({
        embed: {
          author: {
            name: `Here are more infos about the ${command.name} command`,
            icon_url: message.client.user.avatarURL
          },
          color: 0x081570,
          timestamp: new Date(),
          footer: {
            text: "A project launched by the PM Team",
            icon_url: message.client.user.avatarURL
          },
          fields: [
            {
              name: "What does the command do ?",
              value: command.description
            },
            {
              name: "How to use it ?",
              value: command.format
            },
            {
              name: "Required permission",
              value: command.permission
            },

          ]
        }
      });
    } else {
      await message.channel.send({
        embed: {
          author: {
            name: "Here is my command list",
            icon_url: message.client.user.avatarURL
          },
          color: 0x081570,
          timestamp: new Date(),
          footer: {
            text: "A project launched by the PM Team",
            icon_url: message.client.user.avatarURL
          },
          fields: [
            {
              name: "Information",
              value: `To get more information about a command, type \`${helpCommandCommand.command}\` followed by the command name. Example : \`${helpCommandCommand.command} ${commands[0].name}\``
            },
            {
              name: "Moderation commands",
              value: commands.filter(command => command.commandType === "MODERATION").map(command => `\`${command.command}\`: ${command.description}`).join("\n")
            }, {
              name: "Miscellaneous commands",
              value: commands.filter(command => command.commandType === "MISC").map(command => `\`${command.command}\`: ${command.description}`).join("\n")
            },
          ]
        }
      });
    }
  } catch (e) {
    await message.channel.send(new MyEmbededError(e.message).embed);
  }
};
const helpCommandCommand = new Command("help", "Display all the command help", "SEND_MESSAGES", "MISC", "(\\s+[A-z]+)?", helpCommand, new CommandArgument("command", true, 1));
export default helpCommandCommand;