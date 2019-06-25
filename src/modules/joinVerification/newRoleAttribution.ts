import {Message} from "discord.js";
import {client, photon} from "../../index";
import {EmbededError} from "../../classes/embeded";

export default async (guildId: string, memberId: string) => {
  try {
    const guildDB = await photon.guilds.findOne({
      where: {
        discordId: guildId
      }
    });
    const guild = client.guilds.find(guild => guild.id === guildId);
    const member = guild.members.find(member => member.id === memberId);
    member.addRole(guildDB.baseRoleAfterVerificationId, "Successful verification");
  } catch (e) {
    console.log(e);
  }

}
export const attrRole = async (message: Message) => {
  try {
    const [command, role] = message.content.split(/\s+/);
    const roleInGuild = message.guild.roles.find(searchRole => searchRole.id === role);
    if (roleInGuild) {
      if (roleInGuild.editable) {
        await photon.guilds.update({
          where: {
            discordId: message.guild.id
          }, data: {
            baseRoleAfterVerificationId: roleInGuild.id
          }
        });
        message.reply(`Updated`);
      } else {
        message.channel.send(new EmbededError("The role should be placed after the bot's role."));
      }
    } else {
      message.reply(`The role with ID "${role}" does'nt exits.`);
    }
  } catch (e) {
    message.channel.send(new EmbededError(e.message));
  }
};