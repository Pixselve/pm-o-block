import { GuildMember, Message, TextChannel } from "discord.js";
// @ts-ignore
import * as captchagen                       from "captchagen";
import { client, photon }                    from "../../index";
import { MemberProtection, MyEmbededError }  from "../../classes/embeded";
import Command, { CommandArgument }          from "../../classes/command";


export const toggleVerification = async (message: Message) => {
  try {
    const [command, arg] = message.content.split(/\s+/);
    if (arg === "true" || arg === "false") {
      const guildDB = await photon.guilds.update({
        where: {
          discordId: message.guild.id
        }, data: {
          verificationRequired: arg === "true"
        }
      });
      message.channel.send(new MemberProtection(`Change done. Verification is now set to ${guildDB.verificationRequired}.`).embed);
    } else {
      throw new Error("The command should be in the format : $verification (true | false)");
    }
  } catch (e) {
    message.channel.send(new MyEmbededError(e.message).embed);
  }
};
export const toggleVerificationCommand = new Command("verification", "Toggle the verification system", "ADMINISTRATOR", "MODERATION", "((\\s+)(false|true))", toggleVerification, new CommandArgument("true | false", false, 1));


export const beforeVerification = async (member: GuildMember) => {
  try {
    const [guildUserDB] = await photon.guildUsers.findMany({
      where: {
        guild: {
          discordId: member.guild.id
        },
        user: {
          discordId: member.id
        }
      },
      select: {
        guild: true,
        verified: true
      }
    });
    if (!guildUserDB) throw new Error("The guild or the user associated to it was not found");
//  Check if the server require verification & if the user is already verified & if the user is not a bot
    if (guildUserDB.guild.verificationRequired && !guildUserDB.verified && !member.user.bot) {
      await verification(member);
    } else {
      await afterVerification(member);
    }
  } catch (e) {
    const defaultChannel = member.guild.channels.filter(channel => channel.type === "text" && channel.permissionsFor(client.user).has("SEND_MESSAGES")).first();
    if (!((logChannel): logChannel is TextChannel => logChannel.type === 'text')(defaultChannel)) return;

    defaultChannel.send(new MyEmbededError(e.message).embed);
    // console.log(e);
  }
};
const verification = async (member: GuildMember) => {

  try {
    const dmChannel = await member.createDM();
    const captcha = captchagen.create();
    captcha.generate();
    await dmChannel.send({
      embed: {
        author: {
          name: `One more step before being able to access ${member.guild.name}`,
          icon_url: member.user.avatarURL
        },
        title: `Type the following letters and numbers down bellow.`,
        timestamp: new Date(),
        footer: {
          text: "A project launched by the PM Team",
          icon_url: client.user.avatarURL
        },
      },
      files: [{
        attachment: captcha.buffer()
      }]
    });

    const filter = (message: Message) => message.author.id === member.id;
    const collected = await dmChannel.awaitMessages(filter, { maxMatches: 1 });
    if (collected.first().content === captcha.text()) {
      await afterVerification(member);
      await dmChannel.send(new MemberProtection(`:white_check_mark: Verification completed, thanks for your time`).embed);
    } else {
      dmChannel.send(new MemberProtection(`❌ Verification failed. Are you a bot ?`).embed);
      await beforeVerification(member);
    }

  } catch (e) {
    throw e;
  }
};
const afterVerification = async (member: GuildMember) => {
  try {
    const userDB = await photon.guildUsers.updateMany({
      where: {
        user: {
          discordId: member.id,
        },
        guild: {
          discordId: member.guild.id
        }
      }, data: {
        verified: true
      }
    });
    const guildDB = await photon.guilds.findOne({
      where: {
        discordId: member.guild.id
      }
    });
    if (guildDB.baseRoleAfterVerificationId) {
      const role = member.guild.roles.find(searchRole => searchRole.id === guildDB.baseRoleAfterVerificationId);
      if (!role) throw new Error(`The role with id : "${guildDB.baseRoleAfterVerificationId}" does not exists`);
      if (!role.editable) throw new Error(`The bot can't interact with higher roles. Please put the bot role at the top of your roles list`);
      await member.addRole(role);
    }
  } catch (e) {
    throw e;
  }
};