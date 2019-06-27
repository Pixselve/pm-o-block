import { Message }                          from "discord.js";
import { photon }                           from "../../../index";
import { MemberProtection, MyEmbededError } from "../../../classes/embeded";
import Command                              from "../../../classes/command";

const badWordList = async (message: Message) => {
  try {
    const words = await photon.badWords.findMany({
      select: {
        value: true
      }
    });
    message.channel.send(new MemberProtection(`You have ${words.length} forbidden word(s) registered. Start adding more with $addBadWord followed by the list of words you would like to add.`).embed);
  } catch (e) {
    message.channel.send(new MyEmbededError(e.message).embed);
  }
};
export const badWordListCommand = new Command("badwordlist", "Add one or multiple words in the forbidden word list", "SEND_MESSAGES", "", badWordList);
