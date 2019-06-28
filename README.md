# PM-o Block#4566


## A cool bot made in 🇫🇷 for the Hack Week contest by Discord

*A word from the developers*
>I think you all know that **French quality** is deserved.
>For once, we change the rules and offer you a bot made in France (in Brittany for those who know it) accessible to everyone.
>Maybe that's how we'll be able to walk the streets with a beautiful t-shirt from our favorite company ❤. Fingers crossed and good luck to all participants.
>Anyway, I guess it's the bot that interests you so let's stop blabbering and **be ready to be surprised** (no need to play "Try not to be surprised", you'll lose :smirk:).



### Our team of budding frenchies developers who do this for fun

- Mael : Pixselve#1942

- Pascal : Pascal ✔#8855


### The bot's features

- [x] Block NSFW images posted in non NSFW text channels (thanks to nsfwjs and GantMan's nsfw model for TensorFlow)

- [x] Create a backup of your server which you can use in all of your guild providing the secret key of this backup

- [x] Verification system when new users join the server with the ability to provide a custom base role

- [x] Block a list of bad words you can specify

- [x] Give the ability to warn a user and store all the information in the database

- [ ] Do the chores

- [ ] Break up with your wife

- [ ] Bring your children back to school

- [x] ...and more to see


### How to use this ~~excellent and useful~~ bot ?

- Use the '$help' command

- Learn about some command like the '$addbadword' command

- Feed your server with the most powerful moderation commands ever !


### Are you thinking : 'Whoah, this bot is perfect for my server ! But is my guild good enough for this bot ?' ?

- If it's 'yes', take a look at this [bot invite](https://discordapp.com/oauth2/authorize?client_id=591947906664235008&scope=bot&permissions=8) and take care of our bot...

- If it's 'no', ask you again this question because ALL OF THE DISCORD SERVERS ARE GREAT ! Uh, Fortnite servers still exist today ? I didn't know that...

### Technical details if you want to host the bot by yourself

- We use Prisma 2 which is only in preview at the time of our use. This version only works on Mac and Linux. You will therefore need to use one of these systems in order to be able to run the bot.

- Rename the file "config.demo.ts" to "config.ts" in the "src" folder and modify the configuration.

- You will need to download the model that will allow you to filter the NSFW images by [clicking here](https://s3.amazonaws.com/nsfwdetector/nsfwjs.zip). Then create a "nsfwjs" folder at the root and add the model files (group1-[...] and model.json) to it. (Source : [github.com/gantman/nsfw_model](https://github.com/gantman/nsfw_model))

- Start the bot with "npm run start"