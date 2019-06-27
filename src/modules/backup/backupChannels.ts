import { Message }       from "discord.js";
import { Channel, Role } from "@generated/photon";

export default async (message: Message, backup: { channels: Channel[], roles: Role[] }) => {
  try {
    //  Remove all the channels
    await message.guild.channels.deleteAll();


    const categoryChannels = backup.channels.filter(channel => channel.type === "category");
    const normalChannels = backup.channels.filter(channel => channel.type !== "category");

    await Promise.all(categoryChannels.map(async channel => {

      // @ts-ignore
      const parentChannel = await message.guild.createChannel(channel.name, {
        type: channel.type,
        position: channel.position
      });

      await Promise.all(normalChannels.filter(secondaryChannel => {
        return secondaryChannel.parent === channel.channelId;
        // @ts-ignore
      }).map(secondaryChannel => message.guild.createChannel(secondaryChannel.name, {
        type: secondaryChannel.type,
        position: secondaryChannel.position,
        parent: parentChannel.id
      })));

    }));
  } catch (e) {
    throw e;
  }
}