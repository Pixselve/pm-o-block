import Command, { CommandArgument }         from "../../classes/command";
import { Message }                          from "discord.js";
import { MemberProtection, MyEmbededError } from "../../classes/embeded";
import { photon }                           from "../../index";


import choiceValidation from "./choiceValidation";
import saveBackup       from "./saveBackup";
import applybackup      from "./applybackup";


const backup = async (message: Message) => {
  try {
    await choiceValidation(message, "Do you really want to start the complete backup of the server ?", saveBackup);
  } catch (e) {
    await message.channel.send(new MyEmbededError(e.message).embed);
  }
};
export const backupCommand = new Command("backup", "Initiate the server backup", "ADMINISTRATOR", "", backup);

const doApplyBackup = async (message: Message, args: string[]) => {
  try {
    await choiceValidation(message, "Do you really want to apply the backup ? You will lose all your current data.", applybackup, args);
  } catch (e) {
    await message.channel.send(new MyEmbededError(e.message).embed);
  }


};
export const doApplyBackupCommand = new Command("applybackup", "Apply the server backup", "ADMINISTRATOR", "(\\s+[0-z]{25})", doApplyBackup, new CommandArgument("backup secret key", false, 1));


const dropDBBackup = async (message: Message) => {
  try {
    await photon.roles.deleteMany({
      where: {
        guildBackup: {
          guild: {
            discordId: message.guild.id
          }
        }
      }
    });
    await photon.channels.deleteMany({
      where: {
        guildBackup: {
          guild: {
            discordId: message.guild.id
          }
        }
      }
    });
    await photon.guildBackups.deleteMany({
      where: {
        guild: {
          discordId: message.guild.id
        }
      }
    });
    await message.channel.send(new MemberProtection("DB dropped").embed);
  } catch (e) {
    console.log(e);
    await message.channel.send(new MyEmbededError("ERROR").embed);
    await message.channel.send(new MyEmbededError(e.message).embed);

  }
};

export const dropDBBackupCommand = new Command("dropdbroles", "Drop the backup DB", "ADMINISTRATOR", "", dropDBBackup);
