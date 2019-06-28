import { MemberProtection, MyEmbededError } from "../../classes/embeded";
import { Message }                          from "discord.js";
import Command, { CommandArgument }         from "../../classes/command";
import { photon }                           from "../../index";

const getOpinion = async (message: Message, args: string[]) => {
  try {
    const member = message.mentions.users.first();
    if (!member) throw new Error("You must mention a valid user");
    const [mention, ...argsWithoutMension] = args;
    const opinion = argsWithoutMension.join(" ");
    const userDB = await photon.guildUsers.updateMany({
      where: {
        guild: {
          discordId: message.guild.id
        },
        user: {
          discordId: member.id
        }
      },
      data: {
        opinion: opinion
      }
    });
    await message.channel.send(new MemberProtection("The user's opinion has been updated").embed);
  } catch (e) {
    message.channel.send(new MyEmbededError(e.message).embed);

  }
};

export default new Command("giveopinion", "Allows you to add an opinion on a user", "KICK_MEMBERS", "MODERATION", "(\\s+<@\\d{18}>)(\\s+.+)?", getOpinion, [new CommandArgument("user mention", false, 1), new CommandArgument("opinion", false, 1)]);