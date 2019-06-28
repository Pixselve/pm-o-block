import Command, {CommandArgument} from "../../classes/command";
import {Message} from "discord.js";
import {MyEmbededError} from "../../classes/embeded";

const ban = async (message: Message, args: string[]) => {
  try {
    const member = message.mentions.users.first();
    const guildMember = message.guild.member(member);
    if (!guildMember) throw new Error("The user you are trying to ban does not exists");
    await guildMember.ban({
      days: 7,
      reason: args[1] || "NONE"
    });
    await message.channel.send({
      embed: {
        author: {
          name: `Successfully banned ${member.username}`,
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
export const banCommand = new Command("ban", "Ban a member of the server", "BAN_MEMBERS", "MODERATION", "(\\s+<@\\d{18}>)(\\s+(\\s*\\w+)+)?", ban, [new CommandArgument("user mention", false, 1), new CommandArgument("reason", true, 1)]);

const unban = async (message: Message, args: string[]) => {
  try {
    const user = await message.client.fetchUser(args[0]);
    if (!user) throw new Error("The user you are trying to unban does not exists");
    const ban = await message.guild.fetchBan(user);
    if (!ban) throw new Error("No banned user find for this ID. Did you already use the BanHammer ?");
    const reason = args[1] || "NONE";
    await message.guild.unban(user, reason);

    await message.channel.send({
      embed: {
        author: {
          name: `${user.username} was pardoned !`,
          icon_url: user.avatarURL
        },
        color: 0x00a802,
        timestamp: new Date(),
        footer: {
          text: "A project launched by the PM Team",
          icon_url: message.client.user.avatarURL
        },
        fields: [
          {
            name: "Moderator",
            value: message.author.username,
            inline: true
          },
          {
            name: "Reason",
            value: reason,
            inline: true
          }
        ]
      }
    });
  } catch (e) {
    console.log(e);
    message.channel.send(new MyEmbededError(e.message).embed);

  }
};

export const unbanCommand = new Command("unban", "Unban a user", "BAN_MEMBERS", "MODERATION", "(\\s+\\d{18})(\\s+(\\s*\\w+)+)?", unban, [new CommandArgument("user ID", false, 1), new CommandArgument("reason", true, 1)]);
