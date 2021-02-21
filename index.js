const Discord = require("discord.js");

const client = new Discord.Client();

client.once('ready', () => {
    console.log("we in this bitch");
});


const rRegex = /(r+\s*)+(?=((i+\s*)+((n+\s*)+)?)?$)/gi;
const iRegex = /(i+\s*)+(?=((n+\s*)+)?$)/gi;
const nRegex = /(n+\s*)+$/gi;
const regexRecurs = [rRegex, iRegex, nRegex];
var count = 0;
let evidence = [];

client.on("message", message => {
    if (!!message.author.bot) return;
    function rinAlg(num) {
        let match = message.content.match(regexRecurs[num]);
        if (num < 3) {
            if (match !== null) {
                evidence.push(match);
                count += 1;
                rinAlg(num + 1);
            } else if (message.content.match(iRegex) === null){
                evidence = [];
                count = 0;
            }
        } else {
            message.channel.send(`warning: consecutive messages containing "${evidence.join('')}"`);
            evidence = [];
            count = 0;
        }
    }
    rinAlg(count);
    
});

client.login(process.env.token);

