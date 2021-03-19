const Discord = require("discord.js");
const random_words = require("random-words");
const mongoose = require("mongoose");


mongoose.connect(process.env.MONGO_DB_CONN, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(result => console.log`Successfuly Connected with ${result}`)
    .catch(err => console.log(`ERROR: ${err}`));

const client = new Discord.Client();

const prefix = /^<.+>$/;

const ADMIN_ID = 424006675016581122;

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
    client.guilds.cache.forEach(server => {
        hangman_games[server.id] = {};
    });
});


const rRegex = /(^|[\W\s_]+)(r[\W\s_]*)+(?=(([il][\W\s_]*)+(((n[\W\s_]*)+)?((s[\W\s_]*)+)?)?)?$)/gi;
const iRegex = /(?<=(^|[\W\s_]+)r*)([il][\W\s_]*)+(?=((n[\W\s_]*)+((s[\W\s_]*)+)?)?$)/gi;
const nRegex = /(?<=(^|[\W\s_]+)r*i*)(n[\W\s_]*)+(?=((s[\W\s_]*)+)?$)/gi;
const regexRecurs = [rRegex, iRegex, nRegex];
var count = 0;
let evidence = [];
let hangman_games = {};
let user_rooms = {};


client.on("message", message => {
    let current_hangman_lobby = hangman_games[message.guild.id];
    if (!!message.author.bot) return;

    if (message.content.match(prefix) !== null) {
        const [command, ...args] = message.content
            .replace(/[<>]/g, "")
            .trim()
            .toLowerCase()
            .split(/\s+/);
        if (command === "hangman") {
            var list = random_words(3);
            var empty = [];
            if (args[0] === undefined || Number.isInteger(args[0])) {
                send_to_channel(message.channel.id, "please enter a game name ex: <hangman room1>");
                return;
            } else if (args[0] in current_hangman_lobby) {
                send_to_channel(message.channel.id, "sorry that name has already been taken");
                return;
            } else {
                var room_name = args[0];
            }
            if (args.includes("public")) {
                var isPublic = true;
            } else {
                var isPublic = false;
            }
            if (args[1] === undefined || isNaN(args[1])) {
                var lives = 6;
            } else {
                var lives = parseInt(args[1]);
            }
            for (var i = 0; i < list.length; i++) {
                empty.push(list[i].split("").join(" "));
            }
            var current_status = empty.join("    ").replace(/\S/gi, "_");

            current_hangman_lobby = Object.assign(current_hangman_lobby, 
            { 
                [room_name]: { 
                    "current_status": current_status, 
                    "complete_word": empty.join("    "), 
                    "lives": lives, 
                    "perms": [message.author.id],
                    "owner": message.author.id,
                    "isPublic": isPublic,
                    "guessed": []
                } 
            });
            user_rooms[message.author.id] = room_name;
            send_to_channel(message.channel.id, 
                `\`\`\`
name: ${room_name}
lives: ${lives}
${isPublic ? "public": "private"}
                                |                               
                                |
                                O
                              - | -
                               / \\
            
${current_status}
                \`\`\``
            );
        } else if (command === "guess") {
            /*var count_of_games = 0;
            for (const property in hangman_games) {
                if (hangman_games[property]["perms"].includes(message.author.id)) {
                    count++;
                }
            }
            switch (count) {
                case 0: 
                    send_to_channel(message.channel.id, "you haven't created or been invited to any games yet!"); 
                    return;
                case 1:
                    guess = args[0];
                    break;
                default:
                    send_to_channel(message.channel.id, "you are in multiple games");
                    return;
            }*/
            var room_name = user_rooms[message.author.id];
            if (room_name in current_hangman_lobby) {
                guess = args[0];
                if (guess.match(/[a-z]/i) !== null) {
                    if (!current_hangman_lobby[room_name]["guessed"].includes(guess)){
                        current_hangman_lobby[room_name]["guessed"].push(guess);
                        var matches = [];
                        for (var i = 0; i < current_hangman_lobby[room_name]["complete_word"].length; i++) {
                            if (current_hangman_lobby[room_name]["complete_word"][i] === guess) {
                                matches.push(i);
                            }
                        }
                        if (!matches.length) {
                            current_hangman_lobby[room_name]["lives"]--;
                            if (current_hangman_lobby[room_name]["lives"] === 0) {
                                send_to_channel(message.channel.id, `\`\`\`diff\n- Hehe you lost all your lives. Guess your friend's gonna sleep with the fishes now >:)\n\nThe correct phrase was: \n+ ${current_hangman_lobby[room_name]["complete_word"]}\n\`\`\``);
                                delete current_hangman_lobby[room_name];
                                return;
                            } else {
                                send_to_channel(message.channel.id, `\`\`\`diff\n- No letters found! you lost a life!\n\`\`\``);
                            }
                            send_to_channel(message.channel.id, 
                                `\`\`\`
name: ${room_name}
lives: ${current_hangman_lobby[room_name]["lives"]}
${current_hangman_lobby[room_name]["isPublic"] ? "public": "private"}
                                |                               
                                |
                                O
                              - | -
                               / \\
                            
${current_hangman_lobby[room_name]["current_status"]}
                                \`\`\``
                            ); 
                        } else {
                            for (var j = 0; j < matches.length; j++) {
                                current_hangman_lobby[room_name]["current_status"] = replaceChars(current_hangman_lobby[room_name]["current_status"], matches[j], guess);
                            }
                            send_to_channel(message.channel.id, `\`\`\`css\nYou found ${matches.length} letters!\n\`\`\``);
                            send_to_channel(message.channel.id, 
                                `\`\`\`
name: ${room_name}
lives: ${current_hangman_lobby[room_name]["lives"]}
${current_hangman_lobby[room_name]["isPublic"] ? "public": "private"}
                                |                               
                                |
                                O
                              - | -
                               / \\
                            
${current_hangman_lobby[room_name]["current_status"]}
                                \`\`\``
                            ); 
                            if (!current_hangman_lobby[room_name]["current_status"].includes("_")) {
                                send_to_channel(message.channel.id, `\`\`\`ini\n[ Congrats! You managed to save your friend! ]\n\`\`\``);
                                delete current_hangman_lobby[room_name];
                                return;
                            }
                    
                        }
                    } else {
                        send_to_channel(message.channel.id, `You've already guessed ${guess}`);
                    }
                    
                }
            } else {
                send_to_channel(message.channel.id, "You are not currently in a game! create a new game using <hangman [game name] [optional: lives]> or join another game using <join [game name]>");
            }
        } else if (command === "json" && message.author.id == ADMIN_ID) {
            send_to_channel(message.channel.id, `\`\`\`\n${JSON.stringify(hangman_games, null, 4)}\n\`\`\``);
        } else if (command === "invite") {
            var invitees = [];
            var room_name = args.shift();
            
            try {
                if (current_hangman_lobby[room_name]["owner"] === message.author.id) {
                    args.forEach(item => {
                        var item_id = item.replace(/[*!<@>]/g, "");
                        current_hangman_lobby[room_name]["perms"].push(item_id);
                        var username = client.users.cache.get(item_id).username;
                        var nickname = message.guild.members.cache.get(item_id).nickname;
                        nickname ? invitees.push(nickname) : invitees.push(username);
                    })
                    send_to_channel(message.channel.id, `You have successfully invited **${invitees.join(", ")}**`);
                } else {
                    send_to_channel(message.channel.id, "Sorry you are not the owner of this game"); 
                }
            } catch (e) {
                if (e instanceof TypeError) {
                    send_to_channel(message.channel.id, "please specify the room name you would like to invite people to");
                } else {
                    throw e;
                }
            }
            
        } else if (command === "join") {
            var room_name = args[0];
            if (room_name in current_hangman_lobby) {
                if (current_hangman_lobby[room_name]["perms"].includes(message.author.id) || current_hangman_lobby[room_name]["isPublic"]) {
                    user_rooms[message.author.id] = room_name;
                    send_to_channel(message.channel.id, `You've joined **${room_name}**!`)
                } else {
                    send_to_channel(message.channel.id, "Sorry, you don't have permissions to join this game");
                }
            } else {
                send_to_channel(message.channel.id, "This game doesn't exist, please make sure you spelled it correctly");
            }

        } else if (command === "rooms") {
            var display_string = "\`\`\`\n";
            Object.keys(current_hangman_lobby).forEach(key => {
                display_string += `${key}, ${client.users.cache.get(current_hangman_lobby[key]["owner"]).username}, ${current_hangman_lobby[key]["isPublic"] ? "public": "private"}, access? ${current_hangman_lobby[key]["isPublic"] || current_hangman_lobby[key]["perms"].includes(message.author.id) ? "✅" : "❌"} ${user_rooms[message.author.id] == key ? "🌀" : ""}\n`;
            });
            send_to_channel(message.channel.id, display_string + "\`\`\`");
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

client.on("guildCreate", server => {
    hangman_games[server.id] = {};
})



client.login(process.env.token);

