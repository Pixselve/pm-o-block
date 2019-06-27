import { Message }   from "discord.js";
import { NSFWJS }    from "nsfwjs/dist";
import nsfwFilter    from "./nsfwFilter";
import badWordFilter from "./badWord/badWordFilter";
import linkFilter    from "./linkFilter";

export default async (message: Message, model: NSFWJS) => {
  try {
    if (message.author.bot) return true;
    if (message.attachments.filter(attach => {
      const fileExtension = attach.filename.split(".").pop();
      return fileExtension === "png" || fileExtension === "jpeg" || fileExtension === "jpg";
    }).array().length > 0) {
      await nsfwFilter(message, model);
    }
    if (await badWordFilter(message)) return true;
    if (await linkFilter(message)) return true;
    return false;
  } catch (e) {
    throw e;
  }
}