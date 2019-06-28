import { Message }                  from "discord.js";
import { client, photon }           from "../../index";
import { MyEmbededError }           from "../../classes/embeded";
import Command, { CommandArgument } from "../../classes/command";

export const warnList = async (message: Message) => {
  let member;
  if (message.guild.member(message.mentions.users.first())) {
    member = message.mentions.users.first();
  } else {
    member = message.author;
  }


  const [userDB] = await photon.guildUsers.findMany({
    where: {
      guild: {
        discordId: message.guild.id
      },
      user: {
        discordId: member.id
      }
    },
    select: {
      id: true,
      opinion: true
    }
  });
  const warns = await photon.warns.findMany({
    where: {
      target: {
        id: userDB.id
      }
    }
  });

  if (warns.length > 0) {
    message.channel.send({
      embed: {
        author: {
          name: `Take a look at ${member.username}'s warns in ${message.guild.name}`,
          icon_url: member.avatarURL
        },
        color: 0x00a802,
        fields: [
          {
            name: "Warn count",
            value: `${warns.length} warns for rules violation.`,
            inline: true
          },
          {
            name: `Latest warn : ${new Date(warns[0].timestamp).toLocaleDateString("fr")}`,
            value: warns[warns.length - 1].reason,
            inline: true
          },
          {
            name: "Moderator's opinion",
            value: userDB.opinion || "You don't have an opinion wet."
          }
        ],
        footer: {
          text: "A project launched by the PM Team",
          icon_url: client.user.avatarURL
        },
        timestamp: new Date()
      }
    });
  } else {
    message.channel.send({
      embed: {
        author: {
          name: `Take a look at ${member.username}'s warns in ${message.guild.name}`,
          icon_url: member.avatarURL
        },
        fields: [
          {
            name: "Warn count",
            value: "You don't have any warn. Good job !"
          },
          {
            name: "Moderator's opinion",
            value: userDB.opinion || "You don't have an opinion yet"
          }
        ],
        color: 0x00a802,
        footer: {
          text: "A project launched by the PM Team",
          icon_url: client.user.avatarURL
        },
        timestamp: new Date()
      }
    });
  }

};
export const warnListCommand = new Command("infowarn", "Allows to know the warn number of a user", "KICK_MEMBERS", "MODERATION", "(\\s+<@\\d{18}>)?", warnList, new CommandArgument("user mention", true, 1));


const giveWarn = async (message: Message, args: string[]) => {
  try {
    const member = message.mentions.users.first();
    if (!member) throw new Error("You must mention a valid user");
    const [mention, ...argsWithoutMension] = args;
    const reason = argsWithoutMension.join(" ") || "NONE";
    const [{ id, warns }] = await photon.guildUsers.findMany({
      where: {
        guild: {
          discordId: message.guild.id
        },
        user: {
          discordId: member.id
        }
      },
      select: {
        warns: true,
        id: true
      }
    });
    if (!id) new Error("The user is not registered in the database");
    await photon.warns.create({
      data: {
        reason: reason,
        authorId: message.author.id,
        timestamp: new Date(),
        target: {
          connect: {
            id
          }
        }
      }
    });
    await message.channel.send({
      embed: {
        author: {
          name: `${member.username} has been properly warned`,
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
            value: reason,
            inline: true
          }
        ]
      }
    });

  } catch (e) {
    message.channel.send(new MyEmbededError(e.message).embed);

  }
};
export const giveWarnCommand = new Command("warn", "Allows to warn a user", "KICK_MEMBERS", "MODERATION", "(\\s+<@\\d{18}>)(\\s+.+)?", giveWarn, [new CommandArgument("user mention", false, 1), new CommandArgument("reason", true, 1)]);
