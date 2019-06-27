import { Message }                          from "discord.js";
import { photon }                           from "../../../index";
import { MemberProtection, MyEmbededError } from "../../../classes/embeded";

export default async (message: Message) => {
  try {
    const badWords = await photon.badWords.findMany({
      select: {
        value: true
      }
    });
    if (badWords.some(word => message.content.toLowerCase().split(" ").includes(word.value.toLowerCase()))) {
      const repliedMessage = await message.channel.send(new MemberProtection("Your language, young man!", 0xf44242).embed);
      message.delete();
      // @ts-ignore
      await repliedMessage.delete(5000);
      return true;
    } else {
      return false;
    }
  } catch (e) {
    message.channel.send(new MyEmbededError(e.message).embed);
    return true;
  }
};