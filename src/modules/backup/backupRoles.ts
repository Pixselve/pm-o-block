import { Message }       from "discord.js";
import { Channel, Role } from "@generated/photon";

export default async (message: Message, backup: { channels: Channel[], roles: Role[] }) => {
  try {
    // Remove all the roles
    await message.guild.roles.deleteAll();
    await Promise.all(backup.roles.map(role => message.guild.createRole({
      name: role.name,
      color: role.color,
      position: role.position,
      permissions: role.permissions,
      mentionable: role.mentionable,
      hoist: role.hoist
    }, "Backup")));
  } catch (e) {
    throw e;
  }
};