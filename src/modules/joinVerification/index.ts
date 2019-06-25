import {GuildMember, Message, User} from "discord.js";

// @ts-ignore
import * as captchagen from "captchagen";
import {client, photon} from "../../index";
import {Embeded} from "../../classes";
import newRoleAttribution from "./newRoleAttribution";
import {EmbededError} from "../../classes/embeded";

export const joinVerification = async (member: GuildMember) => {
  try {
    const [userDB] = await photon.guildUsers.findMany({
      where: {
        guild: {
          discordId: member.guild.id
        },
        user: {
          discordId: member.id
        }
      }, select: {
        guild: true,
        verified: true
      }
    });
    if (userDB.guild.verificationRequired && !userDB.verified) {
      const dmChannel = await member.createDM();


      const captcha = captchagen.create();
      captcha.generate();
      await photon.guildUsers.updateMany({
        where: {
          user: {
            discordId: member.id
          },
          guild: {
            discordId: member.guild.id
          }
        }, data: {
          captchaText: captcha.text()
        }
      });
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
    } else {
      await photon.guildUsers.updateMany({
        where: {
          guild: {
            discordId: member.guild.id
          },
          user: {
            discordId: member.id
          }
        }, data: {
          verified: true
        }
      });
    }

  } catch (e) {
    console.log(e);
  }
};

export const captchaVerification = async (message: Message) => {
  try {
    const userDb = await photon.guildUsers.findMany({
      where: {
        user: {
          discordId: message.author.id,
        },
        verified: false
      },
      select: {
        guild: true,
        verified: true,
        user: true,
        captchaText: true
      }
    });

    if (userDb.length > 0) {
      const guild = client.guilds.find(guild => guild.id === userDb[userDb.length - 1].guild.discordId);


      if (message.content === userDb[userDb.length - 1].captchaText) {
        await photon.guildUsers.updateMany({
          where: {
            user: {
              discordId: message.author.id,
            },
            verified: false
          }, data: {
            verified: true
          }
        });
        await newRoleAttribution(guild.id, message.author.id);
        await message.channel.send({
          embed: {
            author: {
              name: `👮 Verification team of ${guild.name}`
            },
            color: 0x40f91b,
            title: "Verification completed, thanks for your time.",
            timestamp: new Date(),
            footer: {
              text: "A project launched by the PM Team",
              icon_url: client.user.avatarURL
            }
          }
        });
      } else {
        await message.channel.send({
          embed: {
            author: {
              name: `👮 Verification team of ${guild.name}`
            },
            color: 0xf91b1b,
            title: "Verification failed. Are you a bot ?",
            timestamp: new Date(),
            footer: {
              text: "A project launched by the PM Team",
              icon_url: client.user.avatarURL
            }
          }
        });
        return;
      }
    } else {
      message.reply("I don't know how I can help, sorry. Are you already verified ?");
    }

  } catch (e) {
    message.channel.send(new EmbededError(e.message));
  }

};

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
      message.reply(`Change done. Verification is now set to ${guildDB.verificationRequired}.`);
    } else {
      throw new Error("The command should be in the format : $verification (true | false)");
    }
  } catch (e) {
    message.channel.send(new EmbededError(e.message));
  }
};