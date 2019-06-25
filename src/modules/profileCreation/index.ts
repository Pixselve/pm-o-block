import {GuildMember} from "discord.js";
import {photon} from "../../index";
import {EmbededError} from "../../classes/embeded";

export default async (user: GuildMember) => {
  try {
    const userDB = await photon.users.upsert({
      where: {
        discordId: user.id
      },
      create: {
        discordId: user.id
      },
      update: {}
    });
    const [alreadyInTheDb] = await photon.guildUsers.findMany({
      where: {
        guild: {
          discordId: user.guild.id
        },
        user: {
          discordId: user.id
        }
      }
    });
    const {id: guildID} = await photon.guilds.findOne({
      where: {
        discordId: user.guild.id
      }
    });


    if (alreadyInTheDb) {

    } else {
      await photon.guildUsers.create({
        data: {
          guild: {
            connect: {
              discordId: guildID
            }
          },
          user: {
            connect: {
              id: userDB.id
            }
          }
        }
      });
    }
  } catch (e) {
    user.guild.defaultChannel.send(new EmbededError(e.message));
  }
}