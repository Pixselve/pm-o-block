import { Message, MessageReaction, User } from "discord.js";
import Command                            from "../../../classes/command";
import { photon }                         from "../../../index";
import { NSFWVerification }               from "@generated/photon";
import { MyEmbededError }                 from "../../../classes/embeded";

const updateConfig = async (message: Message, args: string[]) => {
  try {
    const { nsfwConfig } = await photon.guilds.findOne({
      where: {
        discordId: message.guild.id
      },
      select: {
        nsfwConfig: true
      }
    });
    const configMessage = await message.channel.send({
      embed: {
        author: {
          name: "👷 Member Protection Brigade",
        },
        color: (Math.random() * 0xFFFFFF << 0),
        description: "If you want to edit this configuration, react with '✏️' on this message before 15 seconds.",
        fields: [
          {
            name: "NSFW Filter state",
            value: nsfwConfig.activated ? '✔️ Activated' : '❌ Deactivated',
            inline: false
          },
          {
            name: `Probability at which images are automatically deleted`,
            value: nsfwConfig.possibilityRemoveDirectly.toString(),
            inline: true
          },
          {
            name: "Probability of images being put to a vote",
            value: nsfwConfig.possibilityRemoveWithVote.toString(),
            inline: true
          }
        ],
        footer: {
          text: "A project launched by the PM Team",
          icon_url: message.client.user.avatarURL
        },
        timestamp: new Date()
      }
    });
    if (configMessage instanceof Array) return;
    await configMessage.react("✏");
    const filter = (reaction: MessageReaction, user: User) => reaction.emoji.name === "✏" && user.id === message.author.id;
    const collection = await configMessage.awaitReactions(filter, { time: 15000, maxEmojis: 1 });
    if (collection.first()) {
      const settingChoice = await message.channel.send({
        embed: {
          author: {
            name: "👷 Member Protection Brigade",
          },
          color: (Math.random() * 0xFFFFFF << 0),
          description: "Which setting do you want to update? React with the corresponding emoji.",
          fields: [
            {
              name: "NSFW Filter state",
              value: '🔄',
              inline: true
            },
            {
              name: `Probability at which images are automatically deleted`,
              value: "🎯",
              inline: true
            },
            {
              name: "Probability of images being put to a vote",
              value: "👥",
              inline: true
            }
          ],
          footer: {
            text: "A project launched by the PM Team",
            icon_url: message.client.user.avatarURL
          },
          timestamp: new Date()
        }
      });
      if (settingChoice instanceof Array) return;
      await Promise.all([
        settingChoice.react("🔄"),
        settingChoice.react("🎯"),
        settingChoice.react("👥"),
      ]);


      const collection = await settingChoice.awaitReactions((reaction: MessageReaction, user: User) => ((reaction.emoji.name === "🔄" || reaction.emoji.name === "🎯" || reaction.emoji.name === "👥") && user.id === message.author.id), {
        time: 15000,
        maxEmojis: 1
      });
      await settingChoice.delete();
      if (!collection.first()) throw new Error("Operation cancelled. You didn't answer in time.");
      if (collection.first().emoji.name === "🔄") {
        await toggleFilter(message);
      } else if (collection.first().emoji.name === "🎯") {
        await updateProbability(message, "DIRECT", nsfwConfig);
      } else {
        await updateProbability(message, "VOTE", nsfwConfig);
      }

    }
  } catch (e) {
    await message.channel.send(new MyEmbededError(e.message).embed);
  }
};
export default new Command("nsfwFilter", "View and update the nsfw filter", "ADMINISTRATOR", "MODERATION", "", updateConfig);

const toggleFilter = async (message: Message) => {
  try {
    const choice = await message.channel.send({
      embed: {
        author: {
          name: "👷 Member Protection Brigade",
        },
        color: (Math.random() * 0xFFFFFF << 0),
        description: "React to this message depending on whether you want to activate the filter or not.",
        footer: {
          text: "A project launched by the PM Team",
          icon_url: message.client.user.avatarURL
        },
        timestamp: new Date()
      }
    });
    if (choice instanceof Array) return;
    await Promise.all([
      choice.react("✅"),
      choice.react("❌")
    ]);
    const collection = await choice.awaitReactions((reaction: MessageReaction, user: User) => ((reaction.emoji.name === "✅" || reaction.emoji.name === "❌") && user.id === message.author.id), {
      time: 15000,
      maxEmojis: 1
    });
    if (!collection.first()) {
      await choice.delete();
      throw new Error("Operation cancelled. You didn't answer in time.");
    }
    let state: boolean;
    if (collection.first().emoji.name === "✅") {
      state = true;
    } else {
      state = false;
    }
    const guildUpdated = await photon.guilds.update({
      where: {
        discordId: message.guild.id
      },
      data: {
        nsfwConfig: {
          update: {
            activated: state
          }
        }
      },
      select: {
        nsfwConfig: true
      }
    });
    await choice.delete();
    const confirmation = await message.channel.send({
      embed: {
        author: {
          name: "👷 Member Protection Brigade",
        },
        color: (Math.random() * 0xFFFFFF << 0),
        description: `NSFW's check is now ${guildUpdated.nsfwConfig.activated ? "activated" : "deactivated"}.`,
        footer: {
          text: "A project launched by the PM Team",
          icon_url: message.client.user.avatarURL
        },
        timestamp: new Date()
      }
    });
  } catch (e) {
    throw e;
  }
};

const updateProbability = async (message: Message, probability: "DIRECT" | "VOTE", nsfwConfig: NSFWVerification) => {
  try {
    const choice = await message.channel.send({
      embed: {
        author: {
          name: "👷 Member Protection Brigade",
        },
        color: (Math.random() * 0xFFFFFF << 0),
        description: "Enter the probability you want. It must be a number between 0 and 1.",
        footer: {
          text: "A project launched by the PM Team",
          icon_url: message.client.user.avatarURL
        },
        timestamp: new Date()
      }
    });
    if (choice instanceof Array) return;
    const collection = await choice.channel.awaitMessages((newMessage: Message) => newMessage.author.id === message.author.id && /^[0-1](.\d+)?$/.test(newMessage.content), {
      time: 15000,
      max: 1,
      errors: ["time"]
    });
    if (!collection.first()) throw new Error("NO VALUE");
    const probabilityValue = parseFloat(collection.first().content);
    if (probability === "DIRECT") {
      if (probabilityValue <= nsfwConfig.possibilityRemoveWithVote) throw new Error("The probability that a message will be deleted directly must be greater than the probability that a vote will be required.");
      const updatedGuild = await photon.guilds.update({
        where: {
          discordId: message.guild.id
        },
        data: {
          nsfwConfig: {
            update: {
              possibilityRemoveDirectly: parseFloat(collection.first().content)
            }
          }
        },
        select: {
          nsfwConfig: true
        }
      });
      const confirmation = await message.channel.send({
        embed: {
          author: {
            name: "👷 Member Protection Brigade",
          },
          color: (Math.random() * 0xFFFFFF << 0),
          description: `The probability that a message will be deleted directly is now : ${updatedGuild.nsfwConfig.possibilityRemoveDirectly}`,
          footer: {
            text: "A project launched by the PM Team",
            icon_url: message.client.user.avatarURL
          },
          timestamp: new Date()
        }
      });
    } else {
      if (probabilityValue >= nsfwConfig.possibilityRemoveDirectly) throw new Error("The probability that a message will be deleted by a vote must be lower than the probability that the message will be deleted directly.");
      const updatedGuild = await photon.guilds.update({
        where: {
          discordId: message.guild.id
        },
        data: {
          nsfwConfig: {
            update: {
              possibilityRemoveWithVote: parseFloat(collection.first().content)
            }
          }
        },
        select: {
          nsfwConfig: true
        }
      });
      const confirmation = await message.channel.send({
        embed: {
          author: {
            name: "👷 Member Protection Brigade",
          },
          color: (Math.random() * 0xFFFFFF << 0),
          description: `The probability that a message will be deleted according to a vote is now : ${updatedGuild.nsfwConfig.possibilityRemoveWithVote}`,
          footer: {
            text: "A project launched by the PM Team",
            icon_url: message.client.user.avatarURL
          },
          timestamp: new Date()
        }
      });
    }
  } catch (e) {
    throw e;
  }
};