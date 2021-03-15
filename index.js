const Discord = require("discord.js");
const random_words = require("random-words");

const client = new Discord.Client();

const prefix = /^<.+>$/;

function send_to_channel(channel_id, message) {
    const found_channel = client.channels.cache.find(channel => channel.id == channel_id);
    found_channel.send(message);
}
function replaceChars(string, index, replacement) {
    if (index >= string.length) {
        return string.valueOf();
    }
 
    return string.substring(0, index) + replacement + string.substring(index + 1);
}

client.once('ready', () => {
    console.log("we in this bitch");
    var list = random_words(3);
    var empty = [];

    for (var i = 0; i < list.length; i++) {
        empty.push(list[i].split("").join(" "));
    }
    send_to_channel(820518033520984064, 
        `
\`\`\`bash
\"
__/\\\\\\________/\\\\\\______________________________________________        
 _\\/\\\\\\_______\\/\\\\\\______________________________________________       
  _\\/\\\\\\_______\\/\\\\\\___________________________________/\\\\\\\\\\\\\\\\__      
   _\\/\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\___/\\\\\\\\\\\\\\\\\\______/\\\\/\\\\\\\\\\\\_____/\\\\\\////\\\\\\_     
    _\\/\\\\\\/////////\\\\\\__\\////////\\\\\\____\\/\\\\\\////\\\\\\___\\//\\\\\\\\\\\\\\\\\\_    
     _\\/\\\\\\_______\\/\\\\\\____/\\\\\\\\\\\\\\\\\\\\___\\/\\\\\\__\\//\\\\\\___\\///////\\\\\\_   
      _\\/\\\\\\_______\\/\\\\\\___/\\\\\\/////\\\\\\___\\/\\\\\\___\\/\\\\\\___/\\\\_____\\\\\\_  
       _\\/\\\\\\_______\\/\\\\\\__\\//\\\\\\\\\\\\\\\\/\\\\__\\/\\\\\\___\\/\\\\\\__\\//\\\\\\\\\\\\\\\\__ 
        _\\///________\\///____\\////////\\//___\\///____\\///____\\////////___
\"
\`\`\`
\`\`\`fix
__/\\\\\\\\____________/\\\\\\\\________________________________                
 _\\/\\\\\\\\\\\\________/\\\\\\\\\\\\________________________________               
  _\\/\\\\\\//\\\\\\____/\\\\\\//\\\\\\________________________________              
   _\\/\\\\\\\\///\\\\\\/\\\\\\/_\\/\\\\\\___/\\\\\\\\\\\\\\\\\\______/\\\\/\\\\\\\\\\\\___             
    _\\/\\\\\\__\\///\\\\\\/___\\/\\\\\\__\\////////\\\\\\____\\/\\\\\\////\\\\\\__            
     _\\/\\\\\\____\\///_____\\/\\\\\\____/\\\\\\\\\\\\\\\\\\\\___\\/\\\\\\__\\//\\\\\\_           
      _\\/\\\\\\_____________\\/\\\\\\___/\\\\\\/////\\\\\\___\\/\\\\\\___\\/\\\\\\_          
       _\\/\\\\\\_____________\\/\\\\\\__\\//\\\\\\\\\\\\\\\\/\\\\__\\/\\\\\\___\\/\\\\\\_         
        _\\///______________\\///____\\////////\\//___\\///____\\///__   
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
            if (args[0] === undefined || isNaN(args[0])) {
                var lives = 6;
            } else {
                var lives = parseInt(args[0]);
            }
            for (var i = 0; i < list.length; i++) {
                empty.push(list[i].split("").join(" "));
            }
            var current_status = empty.join("    ").replace(/\S/gi, "_");

            hangman_games = Object.assign(hangman_games, { [message.author.id]: { "current_status": current_status, "complete_word": empty.join("    "), "lives": lives } });
            send_to_channel(message.channel.id, 
                `\`\`\`
lives: ${lives}
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
                if (guess.match(/[a-z]/i) !== null) {
                    var matches = [];
                    for (var i = 0; i < hangman_games[message.author.id]["complete_word"].length; i++) {
                        if (hangman_games[message.author.id]["complete_word"][i] === guess) {
                            matches.push(i);
                        }
                    }
                    if (!matches.length) {
                        hangman_games[message.author.id]["lives"]--;
                        if (hangman_games[message.author.id]["lives"] === 0) {
                            send_to_channel(message.channel.id, `\`\`\`diff\n- Hehe you lost all your lives. Guess your friend's gonna sleep with the fishes now >:)\n\`\`\``);
                            delete hangman_games[message.author.id];
                            return;
                        } else {
                            send_to_channel(message.channel.id, `\`\`\`diff\n- No letters found! you lost a life!\n\`\`\``);
                        }
                        send_to_channel(message.channel.id, 
                            `\`\`\`
lives: ${hangman_games[message.author.id]["lives"]}
                                |                               
                                |
                                O
                              - | -
                               / \\
                        
${hangman_games[message.author.id]["current_status"]}
                            \`\`\``
                        ); 
                    } else {
                        for (var j = 0; j < matches.length; j++) {
                            hangman_games[message.author.id]["current_status"] = replaceChars(hangman_games[message.author.id]["current_status"], matches[j], guess);
                        }
                        send_to_channel(message.channel.id, `\`\`\`css\nYou found ${matches.length} letters!\n\`\`\``);
                        send_to_channel(message.channel.id, 
                            `\`\`\`
lives: ${hangman_games[message.author.id]["lives"]}
                                |                               
                                |
                                O
                              - | -
                               / \\
                        
${hangman_games[message.author.id]["current_status"]}
                            \`\`\``
                        ); 
                        if (!hangman_games[message.author.id]["current_status"].includes("_")) {
                            send_to_channel(message.channel.id, `\`\`\`ini\n[ Congrats! Your dumb ass managed to save your friend! ]\n\`\`\``);
                            delete hangman_games[message.author.id];
                            return;
                        }
                
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

