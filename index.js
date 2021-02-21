const Discord = require("discord.js");

const client = new Discord.Client();

client.once('ready', () => {
    console.log("we in this bitch");
});
client.on("message", message => {
    if (!!message.author.bot) return;
    yoAssCaught = message.content.match(/(r+\s*)+(i+\s*)+(n+\s*)+/gi);
    if (yoAssCaught !== null) {
        message.delete();
        message.channel.send(`${message.author.username}'s message was deleted for containing '${yoAssCaught.join('')}'`);
    }
});

client.login(process.env.token);

