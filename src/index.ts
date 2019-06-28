import Photon          from '@generated/photon';
import * as Discord    from "discord.js";
import profileCreation from './modules/profileCreation';
import { load }        from "nsfwjs";
import config          from "./config";

import commands from "./modules/commands";

import { beforeVerification } from './modules/joinVerification';
import addBotServer           from './modules/addBotServer';
import messageFilter          from './modules/messageFilter';
import { MyEmbededError }     from "./classes/embeded";

export const photon = new Photon();
export const client = new Discord.Client();


(async () => {
  const model = await load(`file://nsfwjs/`, { size: 299 });
  client.on("ready", async () => {
    console.log(`Logged as ${client.user.tag}`);
  });
  client.on("guildCreate", async (guild) => {
    await addBotServer(guild);
  });
  client.on("guildMemberAdd", async (user) => {
    await profileCreation(user);
    await beforeVerification(user);
  });
  client.on("guildMemberUpdate", async (user) => {
    // await profileCreation(user);
    // await beforeVerification(user);
    // await photon.guilds.create({
    //   data: {
    //     discordId: "591948284134817798",
    //     nsfwConfig: {
    //       create: {
    //         activated: true,
    //         possibilityRemoveDirectly: 0.5,
    //         possibilityRemoveWithVote: 0.5
    //       }
    //     }
    //   }
    // });

    // await photon.nSFWVerifications.create({
    //   data: {
    //     guild: {
    //       connect: {
    //         discordId: user.guild.id
    //       }
    //     }
    //   }
    // });
  });
  client.on("message", async message => {
    if (await messageFilter(message, model)) return;

    const foundCommand = commands.find(command => command.commandTest(message));
    if (foundCommand) {
      const testResults = foundCommand.test(message);
      if (testResults === true) {
        // @ts-ignore
        await foundCommand.exec(message, foundCommand.getArgs(message.content));
      } else {
        if (testResults === "PERMISSION") {
          await message.channel.send(new MyEmbededError("You do not have the required permissions to execute this command.").embed);
        } else {
          await message.channel.send(new MyEmbededError(`The structure of the command is not correct. Make ${commands.find(command => command.name === "help").command} ${foundCommand.name} for more information.`).embed);
        }
      }
    } else {
      return;
    }


  });
  client.on("messageUpdate", (async (oldMessage, newMessage) => {
    if (await messageFilter(newMessage, model)) return;
  }));
  client.login(config.token);
})();


async function cleanup() {
  await photon.disconnect();
}

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);

