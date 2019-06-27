import { GuildMember, Message, TextChannel } from "discord.js";
import { PNG }                               from "pngjs";
// @ts-ignore
import * as download                         from "image-downloader";
import { photon }                            from "../../index";
import { NSFWJS }                            from "nsfwjs/dist";
import { MemberProtection, MyEmbededError }  from "../../classes/embeded";
import * as fs                               from "fs";
import * as jpeg                             from "jpeg-js";
import { RawImageData }                      from "jpeg-js";
import * as tf                               from "@tensorflow/tfjs-node";

const readImage = async (path: string) => {
  const buf = fs.readFileSync(path);
  const fileType = path.split(".").pop();
  if (fileType === "jpg" || fileType === "jpeg") {
    return jpeg.decode(buf, true);
  } else if (fileType === "png") {
    return PNG.sync.read(buf);
  } else {
    return "";
  }

};

const imageByteArray = (image: RawImageData<Uint8Array> | "", numChannels: number) => {
  if (image === "") return;
  const pixels = image.data;
  const numPixels = image.width * image.height;
  const values = new Int32Array(numPixels * numChannels);

  for (let i = 0; i < numPixels; i++) {
    for (let channel = 0; channel < numChannels; ++channel) {
      values[i * numChannels + channel] = pixels[i * 4 + channel];
    }
  }

  return values;
};

const imageToInput = (image: RawImageData<Uint8Array> | "", numChannels: number) => {
  if (image === "") return;
  const values = imageByteArray(image, numChannels);
  const outShape = [image.height, image.width, numChannels];
  // @ts-ignore
  const input = tf.tensor3d(values, outShape, 'int32');

  return input;
};

export default async (message: Message, model: NSFWJS) => {
  try {

    const image = message.attachments.first();
    const { filename } = await download.image({
      url: image.url,
      dest: `src/images/${image.id}_${image.filename}`
    });
    const logo = await readImage(filename);
    const input = imageToInput(logo, 3);
    const predictions = await model.classify(input);

    if (message.channel instanceof TextChannel && !message.channel.nsfw) {
      if (predictions[0].className === "Neutral" || predictions[0].className === "Drawing") {
      } else {
        if (predictions[0].probability >= 0.60) {
          await message.delete();
          const [{ id, warns }] = await photon.guildUsers.findMany({
            where: {
              guild: {
                discordId: message.guild.id
              },
              user: {
                discordId: message.author.id
              }
            },
            select: {
              warns: true,
              id: true
            }
          });
          await photon.warns.create({
            data: {
              reason: "Posted some NSFW content",
              authorId: "BOT",
              timestamp: new Date(),
              target: {
                connect: {
                  id: id
                }
              }
            }
          });
          const repliedMessage = await message.channel.send(new MemberProtection(`It seems that your message contains inappropriate content. Please go to an NSFW channel to send this photograph. You have been warned. You have ${warns.length + 1} warns in total`, 0xf44242).embed);

          // @ts-ignore
          await repliedMessage.delete(10000);
          return true;
        } else if (predictions[0].probability >= 0.50) {
          const repliedMessage = await message.channel.send(new MemberProtection("It is possible that the previously posted content is inappropriate for this channel. If you consider it inappropriate, react with the emoji :thumbsup:.", 0xff8800).embed);
          // @ts-ignore
          await repliedMessage.react("👍");
          // @ts-ignore
          const collected = await repliedMessage.awaitReactions((reaction, user) => reaction.emoji.name === '👍', { time: 10000 });
          const thumbsUps = collected.first().count - 1;
          // @ts-ignore
          const onlineUser = repliedMessage.guild.members.filter((m: GuildMember) => m.presence.status === "online").array().length;


          if (thumbsUps >= onlineUser * 0.10) {
            await message.delete();
            // @ts-ignore
            await repliedMessage.delete();
            const confirmationMessage = await message.channel.send(new MemberProtection("The message has been deleted. Thank you for your participation.", 0x5fd827).embed);
            // @ts-ignore
            await confirmationMessage.delete(10000);
            return true;
          } else {
            // @ts-ignore
            await repliedMessage.delete();
            const confirmationMessage = await message.channel.send(new MemberProtection("The message has not been deleted.", 0xf44242).embed);
            // @ts-ignore
            await confirmationMessage.delete(10000);
            return false;
          }
        }
      }
    }
    fs.unlinkSync(filename);
  } catch (e) {
    console.log(e);
    const repliedMessage = await message.channel.send(new MyEmbededError("The image could not be analysed").embed);
    // @ts-ignore
    repliedMessage.delete(10000);
  }

}