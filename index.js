const Discord = require("discord.js");

const client = new Discord.Client();

client.once('ready', () => {
    console.log("we in this bitch");
});


const rRegex = /(r+[\W\s_]*)+(?=((i+[\W\s_]*)+((n+[\W\s_]*)+)?)?$)/gi;
const iRegex = /(i+[\W\s_]*)+(?=((n+[\W\s_]*)+)?$)/gi;
const nRegex = /(n+[\W\s_]*)+$/gi;
const regexRecurs = [rRegex, iRegex, nRegex];
var count = 0;
let evidence = [];

client.on("message", message => {
    if (!!message.author.bot) return;
    function rinAlg(num) {
        let match = message.content.match(regexRecurs[num]);
        let safeAttempt = message.content.match(/[rin]$/);
        let pure = message.content.match(/[\W\s_]+(r+[\W\s_]*)+(i+[\W\s_]*)+(n+[\W\s_]*)+[\W\s_]+/gi)
        if (num < 3) {
            if (pure !== null) {
                message.channel.send(`warning: consecutive messages containing "${pure.join('')}"`);
                evidence = [];
                count = 0;
            } else if (match !== null) {
                evidence.push(match);
                count += 1;
                rinAlg(num + 1);
            } else if (safeAttempt === null) {
                count = 0;
                evidence = [];
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

