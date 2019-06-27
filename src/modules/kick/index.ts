import { Message }                  from "discord.js";
import { MyEmbededError }           from "../../classes/embeded";
import Command, { CommandArgument } from "../../classes/command";

const kick = async (message: Message, args: string[]) => {
  try {

    const member = message.mentions.users.first();
    const guildMember = message.guild.member(member);
    if (!guildMember) throw new Error("The user you are trying to ban does not exists");
    await guildMember.kick(args[1] || "NONE");
    await message.channel.send({
      embed: {
        author: {
          name: `Successfully kicked ${member.username}`,
          icon_url: member.avatarURL
        },
        color: 0x00a802,
        timestamp: new Date(),
        footer: {
          text: "A project launched by the PM Team",
          icon_url: member.client.user.avatarURL
        },
        fields: [
          {
            name: "Moderator",
            value: message.author.username,
            inline: true
          },
          {
            name: "Reason",
            value: args[1] || "NONE",
            inline: true
          }
        ]
      }
    });
  } catch (e) {
    message.channel.send(new MyEmbededError(e.message).embed);
  }
};

export const kickCommand = new Command("kick", "Kick a user", "SEND_MESSAGES", "(\\s+<@\\d{18}>)(\\s+(\\s*\\w+)+)?", kick, [new CommandArgument("user ID", false, 1), new CommandArgument("reason", true, 1)]);
