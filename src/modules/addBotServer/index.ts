import {Guild} from "discord.js";
import {photon} from "../../index";

export default async (guild: Guild) => {
  await photon.guilds.upsert({
    where: {
      discordId: guild.id
    }, create: {
      discordId: guild.id,
    }, update: {}
  })
  console.log("Guild added")
}