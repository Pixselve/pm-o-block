import {Message} from "discord.js";
import {photon} from "../../index";
import {Embeded} from "../../classes";

export const badWord = async (message: Message) => {
    const badWords = await photon.badWords.findMany({
        select: {
            value: true
        }
    })
    if (badWords.some(word => message.content.toLowerCase().split(" ").includes(word.value.toLowerCase()))) {
        const repliedMessage = await message.channel.send(new Embeded("👷 Member Protection Brigade", "Your language, young man!", 0xf44242));
        message.delete();
        // @ts-ignore
        await repliedMessage.delete(5000);
        return true
    } else {
        return false
    }
}
export const addBadWord = async (message: Message) => {
    try {
        const [first, ...args] = message.content.split(/\s+/)
        await Promise.all(args.map(arg => photon.badWords.create({
            data: {
                value: arg
            }
        })))
        message.channel.send("Word(s) added")
    } catch (e) {
        message.channel.send("ERROR")
        console.log(e)
    }
}
export const badWordList = async (message: Message) => {
    try {
        const words = await photon.badWords.findMany({
            select: {
                value: true
            }
        })
        message.channel.send(new Embeded("👷 Member Protection Brigade", `You have ${words.length} forbidden word(s) registered. Start adding more with $addBadWord followed by the list of words you would like to add.`))
    } catch (e) {
        message.channel.send("ERROR")
        console.log(e)
    }
}