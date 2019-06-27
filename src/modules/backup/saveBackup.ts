import { Message }          from "discord.js";
import { MemberProtection } from "../../classes/embeded";
import { photon }           from "../../index";

export default async (message: Message) => {
  try {
    await message.channel.send(new MemberProtection("Backup started").embed);
    const filteredRoles = message.guild.roles.filter(role => !role.managed && role.name !== "@everyone");
    const roles = filteredRoles.map(role => ({
      name: role.name,
      color: role.color,
      permissions: role.permissions,
      mentionable: role.mentionable,
      position: role.position,
      hoist: role.hoist
    }));
    const channels = message.guild.channels.map(channel => ({
      name: channel.name,
      parent: channel.parentID || "",
      channelId: channel.id,
      type: channel.type,
      position: channel.position,
      permissions: {
        create: channel.permissionOverwrites.map(permission => ({
          allow: permission.allow,
          deny: permission.deny,
          type: permission.type
        }))
      }
    }));
    const { id: guildID } = await photon.guilds.findOne({ where: { discordId: message.guild.id } });
    const backup = await photon.guildBackups.create({
      data: {
        guild: {
          connect: {
            id: guildID
          }
        },
        roles: {
          create: roles
        },
        channels: {
          create: channels
        }
      }
    });
    await message.channel.send(new MemberProtection("Backup completed").embed);
    const DMChannel = await message.author.createDM();
    await DMChannel.send(new MemberProtection(`If you want to apply your backup on any server, you will have to provide this unique key : \`${backup.id}\`. The key is link to this backup only and each backup you make will give you a new key.`).embed);
  } catch (e) {
    throw e;
  }
}