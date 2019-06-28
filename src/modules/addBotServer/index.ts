import { Guild, TextChannel }               from "discord.js";
import { photon }                           from "../../index";
import { MemberProtection, MyEmbededError } from "../../classes/embeded";

export default async (guild: Guild) => {
  try {
    const defaultChannel = guild.channels.find(channel => channel.type === "text");

    const alreadyGuild = await photon.guilds.findMany({
      where: {
        discordId: guild.id
      }
    });

    if (alreadyGuild.length > 0) {
      if (defaultChannel instanceof TextChannel) {
        defaultChannel.send(new MemberProtection(`Your server has been successfully recovered. Welcome to ${guild.client.user.username}`).embed);
      } else {
        return;
      }
    } else {
      await photon.guilds.create({
        data: {
          discordId: guild.id,
          nsfwConfig: {
            create: {
              activated: true,
              possibilityRemoveWithVote: 0.5,
              possibilityRemoveDirectly: 0.6
            }
          }
        }
      });
      if (defaultChannel instanceof TextChannel) {
        defaultChannel.send(new MemberProtection(`Your server has been properly configured. Welcome to ${guild.client.user.username}`).embed);
      } else {
        return;
      }
    }


  } catch (e) {
    const defaultChannel = guild.channels.find(channel => channel.type === "text");
    if (defaultChannel instanceof TextChannel) {
      defaultChannel.send(new MyEmbededError("An error occurred during the configuration of your server. Please try again.").embed);
    } else {
      console.log(e);
    }
  }
}