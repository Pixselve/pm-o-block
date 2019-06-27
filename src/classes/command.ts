import config from "../config";
import {Message, PermissionResolvable} from "discord.js";


export class CommandArgument {
  constructor(public type: string, public optional: boolean, public quantity: number | "INF") {

  }

  get formatted() {
    return `\<${this.type}${this.optional ? ": optional" : ""}\> ${this.quantity === "INF" ? "..." : ""}`;
  }
}

export default class Command {
  private readonly prefix = config.commandPrefix;
  public readonly command: string;

  constructor(public name: string, public description: string, public permission: PermissionResolvable, public argsRegex: string, public exec: object, public args?: CommandArgument | CommandArgument[]) {
    this.command = `${this.prefix}${name}`;
  }

  test(message: Message) {
    const regex = new RegExp(`^\\${this.prefix}${this.name}${this.argsRegex}$`, "i");


    return regex.test(message.content) && message.member.hasPermission(this.permission);


  }

  getArgs(message: string) {
    const [command, ...args] = message.split(/\s+/);
    return args;
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
}