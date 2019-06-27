import { Message, TextChannel } from "discord.js";
import { MemberProtection }     from "../../classes/embeded";
import backupChannels           from "./backupChannels";
import backupRoles              from "./backupRoles";
import { photon }               from "../../index";


const backupFinished = async (message: Message) => {
  try {
    const defaultChannel = message.guild.channels.find(channel => channel.type === "text");
    if (defaultChannel instanceof TextChannel) {
      defaultChannel.send(new MemberProtection("Backup completed. Enjoy !").embed);
    }
  } catch (e) {
    throw e;
  }
};


export default async (message: Message, args: string[]) => {
  try {
    await message.channel.send(new MemberProtection("Backup application started").embed);
    const backup = await photon.guildBackups.findOne({
      where: { id: args[0] },
      select: { channels: true, roles: true }
    });
    if (!backup) throw new Error("The backup key you entered is incorrect");
    await backupChannels(message, backup);
    await backupRoles(message, backup);
    await backupFinished(message);
  } catch (e) {
    throw e;
  }
};