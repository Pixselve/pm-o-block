import {GuildMember} from "discord.js";
import {photon} from "../../index";

export default async (user: GuildMember) => {
    await photon.users.upsert({
        where: {
            discordId: user.id
        }, update: {
            joinDate: new Date(),
            verified: false
        }, create: {
            discordId: user.id,
            joinDate: new Date()
        }
    })
}