const Discord = require("discord.js");
const random_words = require("random-words");

const client = new Discord.Client();

const prefix = /^<.+>$/;

function send_to_channel(channel_id, message) {
    const found_channel = client.channels.cache.find(channel => channel.id == channel_id);
    found_channel.send(message);
}

client.once('ready', () => {
    console.log("we in this bitch");
    var list = random_words(3);
    var empty = [];

    for (var i = 0; i < list.length; i++) {
        empty.push(list[i].split("").join(" "));
    }
    send_to_channel(820518033520984064, 
        `\`\`\`                                
                                |                   
                                |
                                O
                              - | -
                               / \\
    
${empty.join("    ").replace(/\S/gi, "_")}
        \`\`\``
    );
});


const rRegex = /(^|[\W\s_]+)(r[\W\s_]*)+(?=(([il][\W\s_]*)+(((n[\W\s_]*)+)?((s[\W\s_]*)+)?)?)?$)/gi;
const iRegex = /(?<=(^|[\W\s_]+)r*)([il][\W\s_]*)+(?=((n[\W\s_]*)+((s[\W\s_]*)+)?)?$)/gi;
const nRegex = /(?<=(^|[\W\s_]+)r*i*)(n[\W\s_]*)+(?=((s[\W\s_]*)+)?$)/gi;
const regexRecurs = [rRegex, iRegex, nRegex];
var count = 0;
let evidence = [];
var hangman_games = {};

client.on("message", message => {
    if (!!message.author.bot) return;

    if (message.content.match(prefix) !== null) {
        const args = message.content.replace(/[<>]/g, "").split(/\s+/);
        const command = args.shift().toLowerCase();
        if (command === "hangman") {
            var list = random_words(3);
            var empty = [];
            for (var i = 0; i < list.length; i++) {
                empty.push(list[i].split("").join(" "));
            }
            var current_status = empty.join("    ").replace(/\S/gi, "_");

            hangman_games = Object.assign(hangman_games, { [message.author.id]: { "current_status": current_status, "complete_word": empty.join("    ") } });
            send_to_channel(message.channel.id, 
                `\`\`\`
                                |                               
                                |
                                O
                              - | -
                               / \\
            
${current_status}
                \`\`\``
            );
        } else if (command === "guess") {
            if (message.author.id in hangman_games) {
                guess = args[0];
                if (guess.match(/[a-z]i/) !== null) {
                    if (hangman_games[message.author.id]["complete_word"].includes(guess)) {
                        send_to_channel(message.channel.id, "yes!!!")
                    } else {
                        send_to_channel(message.channel.id, "noooope")
                    }
                }
            }
        } else if (command === "json") {
            send_to_channel(message.channel.id, `\`\`\`\n${JSON.stringify(hangman_games, null, 4)}\n\`\`\``);
        }
    }
    function rinAlg(num) {
        let match = message.content.match(regexRecurs[num]);
        let safeAttempt = message.content.match(/[riln\W\s_]$/gi);
        let pure = message.content.match(/(^|[\W\s_]+)((r[\W\s_]*)+([il][\W\s_]*)+(n[\W\s_]*)+)+([\W\s_]+|$)/gi)
        if (num < 3) {
            if (pure !== null) {
                message.channel.send(`warning: consecutive messages containing "${pure.join('').trim()}"`);
                evidence = [];
                count = 0;
            } else if (match !== null) {
                evidence.push(match.join('').trim());
                count += 1;
                rinAlg(num + 1);
            } else if (safeAttempt === null) {
                count = 0;
                evidence = [];
            }
        } else {
            message.channel.send(`warning: consecutive messages containing "${evidence.join('').trim()}"`);
            evidence = [];
            count = 0;
        }
        
    }
    rinAlg(count);
    
});

client.login(process.env.token);

