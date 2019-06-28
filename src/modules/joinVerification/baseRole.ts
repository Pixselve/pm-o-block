import { Message }                  from "discord.js";
import Command, { CommandArgument } from "../../classes/command";
import { photon }                   from "../../index";
import { MyEmbededError }           from "../../classes/embeded";

const setBaseRole = async (message: Message, args: string[]) => {
  try {

    let roleId: string;
    if (/<@\d{18}>/i.test(args[0])) {
      roleId = args[0].split(/<@|>/)[1];
    } else {
      roleId = args[0];
    }
    const guildRole = message.guild.roles.find(role => role.id === roleId);

    if (!guildRole) throw new Error(`The role with id : "${roleId}" does not exists`);
    if (!guildRole.editable) throw new Error(`The bot can't interact with higher roles. Please put the bot role at the top of your roles list`);
    await photon.guilds.update({
      where: {
        discordId: message.guild.id
      }, data: {
        baseRoleAfterVerificationId: guildRole.id
      }
    });
    await message.channel.send({
      embed: {
        author: {
          name: `Base role successfully changed !`,
          icon_url: message.client.user.avatarURL
        },
        color: 0x00a802,
        timestamp: new Date(),
        footer: {
          text: "A project launched by the PM Team",
          icon_url: message.client.user.avatarURL
        },
        fields: [
          {
            name: "The role given after the verification is now :",
            value: guildRole.name,
            inline: true
          }
        ]
      }
    });
  } catch (e) {
    message.channel.send(new MyEmbededError(e.message).embed);
  }
};

export const setBaseRoleCommand = new Command("setbaserole", "Set the role the bot will give after the captcha validation", "ADMINISTRATOR", "MODERATION", "((\\s+<@\\d{18}>)|(\\s+\\d{18}))", setBaseRole, new CommandArgument("user ID or user mention", false, 1));
