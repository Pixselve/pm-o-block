import {Message} from "discord.js";
import {photon} from "../../index";
import {Embeded} from "../../classes";
import {EmbededError} from "../../classes/embeded";

export const badWord = async (message: Message) => {
  try {
    const badWords = await photon.badWords.findMany({
      select: {
        value: true
      }
    });
    if (badWords.some(word => message.content.toLowerCase().split(" ").includes(word.value.toLowerCase()))) {
      const repliedMessage = await message.channel.send(new Embeded("👷 Member Protection Brigade", "Your language, young man!", 0xf44242));
      message.delete();
      // @ts-ignore
      await repliedMessage.delete(5000);
      return true;
    } else {
      return false;
    }
  } catch (e) {
    message.channel.send(new EmbededError(e.message));
    return true;
  }
};
export const addBadWord = async (message: Message) => {
  try {
    const [first, ...args] = message.content.split(/\s+/);
    if (args.length > 0) {
      const {id: guildId} = await photon.guilds.findOne({where: {discordId: message.guild.id}});
      await Promise.all(args.map(arg => photon.badWords.create({
        data: {
          value: arg,
          guild: {
            connect: {
              discordId: guildId
            }
          }
        }
      })));

      message.channel.send(new Embeded("👷 Member Protection Brigade", `The word(s) have been added to the list`));

    } else {
      throw new Error("The command should follow : $addBadWord word ...words");
    }

  } catch (e) {
    message.channel.send(new EmbededError(e.message));
  }
};
export const badWordList = async (message: Message) => {
  try {
    const words = await photon.badWords.findMany({
      select: {
        value: true
      }
    });
    message.channel.send(new Embeded("👷 Member Protection Brigade", `You have ${words.length} forbidden word(s) registered. Start adding more with $addBadWord followed by the list of words you would like to add.`));
  } catch (e) {
    message.channel.send(new EmbededError(e.message));
  }
};