import {client} from "../index";


class MyEmbeded {
  public footer = {
    text: "A project launched by the PM Team",
    icon_url: client.user.avatarURL
  };
  public timestamp = new Date();
  public description = "";
  public color = (Math.random() * 0xFFFFFF << 0);
  public author = {
    name: "",
    icon_url: ""
  };

  constructor(color?: number) {
    if (color) {
      this.color = color;
    }
  }

  get embed() {
    return {
      embed: {
        footer: this.footer,
        timestamp: this.timestamp,
        description: this.description,
        color: this.color,
        author: this.author
      }
    };
  }
}


export class MyEmbededError extends MyEmbeded {
  constructor(message: string, ...args: [number?]) {
    super(args[0]);
    this.description = message;
    this.author.name = "❌ An error has occurred";
    this.color = 0xff230f;
  }
}

export class MemberProtection extends MyEmbeded {
  constructor(message: string, ...args: [number?]) {
    super(args[0]);
    this.description = message;
    this.author.name = "👷 Member Protection Brigade";
  }
}