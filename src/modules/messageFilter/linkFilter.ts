import { Message }                          from "discord.js";
import { MemberProtection, MyEmbededError } from "../../classes/embeded";

export default async (message: Message) => {
  const messageText = message.content;
  if (inviteLink(messageText)) {
    await removeMessage(message);
    return true;
  } else {
    return false;
  }
}

const inviteLink = (message: string) => {
  return /(https?:\/\/)?(www\.)?(discord\.(gg|io|me|li)|discordapp\.com\/invite)\/.+[A-Z]/g.test(message);
};

const removeMessage = async (message: Message) => {
  try {
    const repliedMessage = await message.channel.send(new MemberProtection(`${message.author.username}, you have posted a link which is not authorised`, 0xf44242).embed);
    await message.delete();
    // @ts-ignore
    await repliedMessage.delete(10000);
  } catch (e) {
    message.channel.send(new MyEmbededError(e.message).embed);
  }

};