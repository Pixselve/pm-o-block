import config                            from "../config";
import { Message, PermissionResolvable } from "discord.js";


export class CommandArgument {
  constructor(public type: string, public optional: boolean, public quantity: number | "INF") {

  }

  get formatted() {
    return `\<${this.type}${this.optional ? ": optional" : ""}\> ${this.quantity === "INF" ? "..." : ""}`;
  }
}

export default class Command {
  public readonly command: string;
  private readonly prefix = config.commandPrefix;

  constructor(public name: string, public description: string, public permission: PermissionResolvable, public commandType: "MODERATION" | "MISC", public argsRegex: string, public exec: object, public args?: CommandArgument | CommandArgument[]) {
    this.command = `${this.prefix}${name}`;
  }

  get format() {

    if (this.args instanceof Array) {

      return `${this.command} ${this.args.map(arg => arg.formatted).join(" ")}`;
    } else if (this.args) {

      return `${this.command} ${this.args.formatted}`;
    } else {
      return this.command;
    }

  }

  test(message: Message) {
    const regex = new RegExp(`^\\${this.prefix}${this.name}${this.argsRegex}$`, "i");
    if (regex.test(message.content) && message.member.hasPermission(this.permission)) {
      return true;
    } else {
      if (!message.member.hasPermission(this.permission)) {
        return "PERMISSION";
      }
      if (!regex.test(message.content)) {
        return "COMMAND";
      }
    }
  }

  commandTest(message: Message) {
    const regex = new RegExp(`^\\${this.prefix}${this.name}`, "i");

    return regex.test(message.content);

  }

  getArgs(message: string) {
    const [command, ...args] = message.split(/\s+/);
    return args;
  }
}