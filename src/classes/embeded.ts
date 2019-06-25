import {client} from "../index";

export class EmbededError {
  public embed = {
    timestamp: new Date(),
    description: "",
    color: 0xff230f,
    footer: {
      text: "A project launched by the PM Team",
      icon_url: client.user.avatarURL
    },
    author: {
      name: "❌ An error has occurred",
    }
  };


  constructor(message: string) {
    this.embed.description = message;
  }
}