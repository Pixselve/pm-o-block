import {client} from "../index";

export class Embeded {
    embed = {
        timestamp: new Date(),
        description: "",
        color: 0xFFFFFF,
        footer: {
            text: "A project launched by the PM Team",
            icon_url: client.user.avatarURL
        },
        author: {
            name: "👨👨‍💼👨‍💼👨‍💼👷 Member Protection Brigade",
            icon_url: ""
        }
    };

    constructor(title: string, description: string, color?: number, icon?: string) {
        this.embed.description = description;
        this.embed.author.name = title;
        if (color) {
            this.embed.color = color;
        } else {
            this.embed.color = (Math.random() * 0xFFFFFF << 0);
        }
        if (icon) {
            this.embed.author.icon_url = icon;
        }
    }
}