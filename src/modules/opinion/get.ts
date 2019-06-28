import { MyEmbededError }           from "../../classes/embeded";
import { Message }                  from "discord.js";
import Command, { CommandArgument } from "../../classes/command";
import { client, photon }           from "../../index";

const getOpinion = async (message: Message) => {
  try {
    const member = message.mentions.users.first();
    if (!member) throw new Error("You must mention a valid user");
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
        opinion: true
      }
    });
    if (!userDB) throw new Error("The user is not registered in the database");
    if (userDB.opinion) {
      await message.channel.send({
        embed: {
          author: {
            name: `Take a look at ${member.username}'s opinion in ${message.guild.name}`,
            icon_url: member.avatarURL
          },
          title: "Opinion",
          description: userDB.opinion,
          color: 0x00a802,
          footer: {
            text: "A project launched by the PM Team",
            icon_url: client.user.avatarURL
          },
          timestamp: new Date()
        }
      });
    } else {
      await message.channel.send({
        embed: {
          author: {
            name: `Take a look at ${member.username}'s opinion in ${message.guild.name}`,
            icon_url: member.avatarURL
          },
          color: 0x00a802,
          title: "This user has no opinion yet",
          footer: {
            text: "A project launched by the PM Team",
            icon_url: client.user.avatarURL
          },
          timestamp: new Date()
        }
      });
    }
  } catch (e) {
    message.channel.send(new MyEmbededError(e.message).embed);

  }
};

export default new Command("getopinion", "Gives the moderator's opinion on this user", "KICK_MEMBERS", "MODERATION", "(\\s+<@\\d{18}>)", getOpinion, new CommandArgument("user mention", false, 1));