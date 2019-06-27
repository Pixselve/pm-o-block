import { Message }                          from "discord.js";
import { photon }                           from "../../../index";
import { MemberProtection, MyEmbededError } from "../../../classes/embeded";
import Command                              from "../../../classes/command";

const resetBadWords = async (message: Message) => {
  try {
    await photon.badWords.deleteMany({
      where: {
        guild: {
          discordId: message.guild.id
        }
      }
    });
    await message.channel.send(new MemberProtection("You have successfully reset your forbidden words list").embed);
  } catch (e) {
    message.channel.send(new MyEmbededError(e.message).embed);

  }
};
export const resetBadWordsCommand = new Command("resetbadwords", "Add one or multiple words in the forbidden word list", "ADMINISTRATOR", "", resetBadWords);
