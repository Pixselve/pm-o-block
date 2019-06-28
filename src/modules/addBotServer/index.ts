import { Guild }  from "discord.js";
import { photon } from "../../index";

export default async (guild: Guild) => {
  try {
    const alreadyGuild = await photon.guilds.findOne({
      where: {
        discordId: guild.id
      }
    });
    if (alreadyGuild) return;
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
    console.log("Guild added");
  } catch (e) {

  }
}