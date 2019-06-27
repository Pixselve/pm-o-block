import {Message} from "discord.js";
import {client, photon} from "../../index";

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
        discordId: message.author.id
      }
    },
    select: {
      warns: true,
      opinion: true
    }
  });

  if (userDB.warns.length > 0) {
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
            value: `${userDB.warns.length} warns for rules violation.`,
            inline: true
          },
          {
            name: `Latest warn : ${new Date(userDB.warns[0].timestamp).toLocaleDateString("fr")}`,
            value: userDB.warns[0].reason,
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