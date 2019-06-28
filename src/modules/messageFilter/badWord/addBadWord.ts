import { Message }                          from "discord.js";
import { photon }                           from "../../../index";
import { MemberProtection, MyEmbededError } from "../../../classes/embeded";
import Command, { CommandArgument }         from "../../../classes/command";

const addBadWord = async (message: Message) => {
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

      message.channel.send(new MemberProtection(`The word(s) have been added to the list`).embed);

    } else {
      throw new Error("The command should follow : $addBadWord word ...words");
    }

  } catch (e) {
    message.channel.send(new MyEmbededError(e.message).embed);
  }
};
export const addBadWordCommand = new Command("addbadword", "Add one or multiple words in the forbidden word list", "ADMINISTRATOR", "MODERATION", "(\\s+[A-z]+)+", addBadWord, new CommandArgument("word", false, "INF"));
