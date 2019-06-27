import { Message, MessageReaction, User } from "discord.js";
import { MemberProtection }               from "../../classes/embeded";

export default async (message: Message, text: string, callback: any, callBackArgs?: string[]) => {
  try {
    const confirmationMessage = await message.channel.send(new MemberProtection("Do you really want to start the complete backup of the server ?").embed);
    if (confirmationMessage instanceof Array) return;
    await Promise.all([confirmationMessage.react("❌"), confirmationMessage.react("✅")]);
    const filter = (reaction: MessageReaction, user: User) => ((reaction.emoji.name === "❌" || reaction.emoji.name === "✅") && user.id === message.author.id);
    const collected = await confirmationMessage.awaitReactions(filter, { maxEmojis: 1 });
    if (collected.first().emoji.name === "❌") {
      await message.channel.send(new MemberProtection("Action canceled").embed);
    } else {
      await callback(message, callBackArgs);
    }
  } catch (e) {
    throw e;
  }
}