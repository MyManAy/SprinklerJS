const Discord = require("discord.js");
const random_words = require("random-words");
const mongoose = require("mongoose");

mongoose.connect(
  "mongodb+srv://Nithin:LjB6WJkfECif8Df8@justnode.rmaxk.mongodb.net/word-leaderboard?retryWrites=true&w=majority",
  { useNewUrlParser: true, useUnifiedTopology: true }
);

const { Leaderboard, Profile } = require("./leaderboard");

const client = new Discord.Client({ ws: { intents: Discord.Intents.ALL } });

const prefix = /^<.+>$/;

const ADMIN_ID = 424006675016581122;

const day_milliseconds = 86400000;

function send_to_channel(channel_id, message) {
  const found_channel = client.channels.cache.find(
    (channel) => channel.id == channel_id
  );
  found_channel.send(message);
}
function replaceChars(string, index, replacement) {
  if (index >= string.length) {
    return string.valueOf();
  }

  return string.substring(0, index) + replacement + string.substring(index + 1);
}

function repeatString(string, times) {
  if (times <= 0) return "";
  if (times === 1) return string;
  return string + repeatString(string, times - 1);
}

const db_triggered = async (rin_member, increment) => {
  var days_past = Math.floor(
    (Date.now() -
      (rin_member.timely.use_date +
        rin_member.timely.daily.count * day_milliseconds)) /
      day_milliseconds
  );
  var weeks_past = Math.floor(
    (rin_member.timely.daily.count -
      rin_member.timely.weekly.count * 7 +
      days_past) /
      7
  );
  var years_past = Math.floor(
    (rin_member.timely.daily.count -
      rin_member.timely.yearly.count * 365 +
      days_past) /
      365
  );

  if (!(days_past >= 1))
    return (() => {
      rin_member.timely.daily.words += increment;
      rin_member.timely.weekly.words += increment;
      rin_member.timely.yearly.words += increment;
    })();
  rin_member.timely.daily.words = increment;
  rin_member.timely.daily.count += days_past;
  if (!(weeks_past >= 1))
    return (() => {
      rin_member.timely.weekly.words += increment;
      rin_member.timely.yearly.words += increment;
    })();
  rin_member.timely.weekly.words = increment;
  rin_member.timely.weekly.count += weeks_past;
  if (!(years_past >= 1))
    return (() => {
      rin_member.timely.yearly.words += increment;
    })();
  rin_member.timely.yearly.words = increment;
  rin_member.timely.yearly.count += years_past;
  return;
};

const db_start = async (rin_member, increment) => {
  rin_member.timely.use_date = Date.now();
  rin_member.timely.daily.words += increment;
  rin_member.timely.weekly.words += increment;
  rin_member.timely.yearly.words += increment;
};

async function db_updater(search_id, add_to_total = true, start = true) {
  var increment = add_to_total ? 1 : 0;

  const rin_member = await Leaderboard.findById(search_id);
  rin_member.words_total += increment;

  if (rin_member.timely.use_date) {
    await db_triggered(rin_member, increment);
  } else if (start) {
    await db_start(rin_member, increment);
  }

  await rin_member.save();
}

client.once("ready", () => {
  /*    send_to_channel(820518033520984064, 
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
    );*/
  client.guilds.cache.forEach((server) => {
    hangman_games[server.id] = {};
  });
  client.guilds.cache.forEach((server) => {
    server.members.cache.forEach((member) => {
      if (member.bot) return;
      const leaderboard = new Leaderboard({
        _id: member.user.id,
        name: member.user.username,
        words_total: 0,
        avg_daily_words: 0,
      });

      leaderboard.save();
    });
  });
});

const rRegex =
  /(^|[\W\s_]+)(r[\W\s_]*)+(?=(([il][\W\s_]*)+(((n[\W\s_]*)+)?((s[\W\s_]*)+)?)?)?$)/gi;
const iRegex =
  /(?<=(^|[\W\s_]+)r*)([il][\W\s_]*)+(?=((n[\W\s_]*)+((s[\W\s_]*)+)?)?$)/gi;
const nRegex = /(?<=(^|[\W\s_]+)r*i*)(n[\W\s_]*)+(?=((s[\W\s_]*)+)?$)/gi;
const regexRecurs = [rRegex, iRegex, nRegex];
var count = 0;
let evidence = [];
let hangman_games = {};
let user_rooms = {};

client.on("message", async (message) => {
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
        send_to_channel(
          message.channel.id,
          "please enter a game name ex: <hangman room1>"
        );
        return;
      } else if (args[0] in current_hangman_lobby) {
        send_to_channel(
          message.channel.id,
          "sorry that name has already been taken"
        );
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

      current_hangman_lobby = Object.assign(current_hangman_lobby, {
        [room_name]: {
          current_status: current_status,
          complete_word: empty.join("    "),
          lives: lives,
          perms: [message.author.id],
          owner: message.author.id,
          isPublic: isPublic,
          guessed: [],
        },
      });
      user_rooms[message.author.id] = room_name;
      send_to_channel(
        message.channel.id,
        `\`\`\`
name: ${room_name}
lives: ${lives}
${isPublic ? "public" : "private"}
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
          if (!current_hangman_lobby[room_name]["guessed"].includes(guess)) {
            current_hangman_lobby[room_name]["guessed"].push(guess);
            var matches = [];
            for (
              var i = 0;
              i < current_hangman_lobby[room_name]["complete_word"].length;
              i++
            ) {
              if (
                current_hangman_lobby[room_name]["complete_word"][i] === guess
              ) {
                matches.push(i);
              }
            }
            if (!matches.length) {
              current_hangman_lobby[room_name]["lives"]--;
              if (current_hangman_lobby[room_name]["lives"] === 0) {
                send_to_channel(
                  message.channel.id,
                  `\`\`\`diff\n- Hehe you lost all your lives. Guess your friend's gonna sleep with the fishes now >:)\n\nThe correct phrase was: \n+ ${current_hangman_lobby[room_name]["complete_word"]}\n\`\`\``
                );
                delete current_hangman_lobby[room_name];
                return;
              } else {
                send_to_channel(
                  message.channel.id,
                  `\`\`\`diff\n- No letters found! you lost a life!\n\`\`\``
                );
              }
              send_to_channel(
                message.channel.id,
                `\`\`\`
name: ${room_name}
lives: ${current_hangman_lobby[room_name]["lives"]}
${current_hangman_lobby[room_name]["isPublic"] ? "public" : "private"}
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
                current_hangman_lobby[room_name]["current_status"] =
                  replaceChars(
                    current_hangman_lobby[room_name]["current_status"],
                    matches[j],
                    guess
                  );
              }
              send_to_channel(
                message.channel.id,
                `\`\`\`css\nYou found ${matches.length} letters!\n\`\`\``
              );
              send_to_channel(
                message.channel.id,
                `\`\`\`
name: ${room_name}
lives: ${current_hangman_lobby[room_name]["lives"]}
${current_hangman_lobby[room_name]["isPublic"] ? "public" : "private"}
                                |                               
                                |
                                O
                              - | -
                               / \\
                            
${current_hangman_lobby[room_name]["current_status"]}
                                \`\`\``
              );
              if (
                !current_hangman_lobby[room_name]["current_status"].includes(
                  "_"
                )
              ) {
                send_to_channel(
                  message.channel.id,
                  `\`\`\`ini\n[ Congrats! You managed to save your friend! ]\n\`\`\``
                );
                delete current_hangman_lobby[room_name];
                return;
              }
            }
          } else {
            send_to_channel(
              message.channel.id,
              `You've already guessed ${guess}`
            );
          }
        }
      } else {
        send_to_channel(
          message.channel.id,
          "You are not currently in a game! create a new game using <hangman [game name] [optional: lives]> or join another game using <join [game name]>"
        );
      }
    } else if (command === "json" && message.author.id == ADMIN_ID) {
      send_to_channel(
        message.channel.id,
        `\`\`\`\n${JSON.stringify(hangman_games, null, 4)}\n\`\`\``
      );
    } else if (command === "invite") {
      var invitees = [];
      var room_name = args.shift();

      try {
        if (current_hangman_lobby[room_name]["owner"] === message.author.id) {
          args.forEach((item) => {
            var item_id = item.replace(/[*!<@>]/g, "");
            current_hangman_lobby[room_name]["perms"].push(item_id);
            var username = client.users.cache.get(item_id).username;
            var nickname = message.guild.members.cache.get(item_id).nickname;
            nickname ? invitees.push(nickname) : invitees.push(username);
          });
          send_to_channel(
            message.channel.id,
            `You have successfully invited **${invitees.join(", ")}**`
          );
        } else {
          send_to_channel(
            message.channel.id,
            "Sorry you are not the owner of this game"
          );
        }
      } catch (e) {
        if (e instanceof TypeError) {
          send_to_channel(
            message.channel.id,
            "please specify the room name you would like to invite people to"
          );
        } else {
          throw e;
        }
      }
    } else if (command === "join") {
      var room_name = args[0];
      if (room_name in current_hangman_lobby) {
        if (
          current_hangman_lobby[room_name]["perms"].includes(
            message.author.id
          ) ||
          current_hangman_lobby[room_name]["isPublic"]
        ) {
          user_rooms[message.author.id] = room_name;
          send_to_channel(
            message.channel.id,
            `You've joined **${room_name}**!`
          );
        } else {
          send_to_channel(
            message.channel.id,
            "Sorry, you don't have permissions to join this game"
          );
        }
      } else {
        send_to_channel(
          message.channel.id,
          "This game doesn't exist, please make sure you spelled it correctly"
        );
      }
    } else if (command === "rooms") {
      var display_string = "```\n";
      Object.keys(current_hangman_lobby).forEach((key) => {
        display_string += `${key}, ${
          client.users.cache.get(current_hangman_lobby[key]["owner"]).username
        }, ${
          current_hangman_lobby[key]["isPublic"] ? "public" : "private"
        }, access? ${
          current_hangman_lobby[key]["isPublic"] ||
          current_hangman_lobby[key]["perms"].includes(message.author.id)
            ? "✅"
            : "❌"
        } ${user_rooms[message.author.id] == key ? "🌀" : ""}\n`;
      });
      send_to_channel(message.channel.id, display_string + "```");
    } else if (command === "rin") {
      Leaderboard.findById(message.author.id).then((member) =>
        send_to_channel(
          message.channel.id,
          `you have said "rin" ${member.words_total.toString()} times today`
        )
      );
    } else if (command === "toprin") {
      let display_list = ["```"];
      if (parseInt(args[0]) <= 30) {
        var query_limit = parseInt(args[0]);
      } else if (args[0] === undefined) {
        var query_limit = 10;
      } else {
        send_to_channel(
          message.channel.id,
          "You can only display 30 spots at the same time"
        );
        return;
      }
      Leaderboard.find()
        .sort({ words_total: "desc" })
        .limit(query_limit)
        .then((all) => {
          all.forEach((member_data, iter) => {
            display_list.push(
              `${iter + 1}- ${member_data.name}: ${member_data.words_total}`
            );
          });
          send_to_channel(message.channel.id, display_list.join("\n") + "```");
        });
    } else if (command === "avgrin") {
      await db_updater(message.author.id, false, false);
      switch (args[0]) {
        case undefined:
          Leaderboard.findById(message.author.id).then((member) =>
            send_to_channel(
              message.channel.id,
              `\`\`\`
daily: ${member.words_total / (member.timely.daily.count + 1)}
weekly: ${member.words_total / (member.timely.weekly.count + 1)}
yearly: ${member.words_total / (member.timely.yearly.count + 1)}
                                \`\`\``
            )
          );
          break;
        case "daily":
          Leaderboard.findById(message.author.id).then((member) =>
            send_to_channel(
              message.channel.id,
              `\`\`\`
daily: ${member.words_total / (member.timely.daily.count + 1)}
                                \`\`\``
            )
          );
          break;
        case "weekly":
          Leaderboard.findById(message.author.id).then((member) =>
            send_to_channel(
              message.channel.id,
              `\`\`\`
weekly: ${member.words_total / (member.timely.weekly.count + 1)}
                                \`\`\``
            )
          );
          break;
        case "yearly":
          Leaderboard.findById(message.author.id).then((member) =>
            send_to_channel(
              message.channel.id,
              `\`\`\`
yearly: ${member.words_total / (member.timely.yearly.count + 1)}
                                \`\`\``
            )
          );
          break;
        default:
          send_to_channel(
            message.channel.id,
            "Please enter daily, weekly, or yearly for arguments"
          );
      }
    } else if (command === "dababy") {
      send_to_channel(
        message.channel.id,
        `les goo${repeatString("o", Math.floor(Math.random() * 25))}`
      );
    } else if (command === "saveprofile") {
      const profileData = {
        guild: message.member.guild.id,
        roles: message.member.roles.cache.map((role) => role.id),
      };
      Profile.findById(message.author.id)
        .then((member) => {
          const profileGuildFinder = (guild) =>
            guild.guild === message.member.guild.id;
          const previousProfile = member.guilds.some(profileGuildFinder);
          if (previousProfile) {
            const profileGuildIndex =
              member.guilds.findIndex(profileGuildFinder);
            member.guilds.splice(profileGuildIndex, 1);
          }
          member.guilds.push(profileData);
          member.save();
        })
        .catch(() => {
          const profile = new Profile({
            _id: message.member.id,
            guilds: [profileData],
          });
          profile.save();
        });

      send_to_channel(message.channel.id, `profile has been saved`);
    } else if (command === "loadprofile") {
      Profile.findById(message.author.id)
        .then((profileUser) => {
          const { roles: profileRoles } = profileUser.guilds.find(
            (guild) => guild.guild === message.member.guild.id
          );

          profileRoles.forEach((role_id) => {
            const foundRole = message.member.guild.roles.cache.find(
              (guildRole) => guildRole.id === role_id
            );
            if (!foundRole)
              return send_to_channel(
                message.channel.id,
                `Sorry, one of the roles from your saved profile does not exist and we could not add the role`
              );
            message.member.roles.add(foundRole);
          });
          send_to_channel(
            message.channel.id,
            `Your previous profile has been loaded!`
          );
        })
        .catch(() => {
          send_to_channel(
            message.channel.id,
            `You do not have a profile saved yet, use <saveprofile>`
          );
        });
    }
  }
  async function rinAlg(num) {
    let match = message.content.match(regexRecurs[num]);
    let safeAttempt = message.content.match(/[riln\W\s_]$/gi);
    let pure = message.content.match(
      /(^|[\W\s_]+)((r[\W\s_]*)+([il][\W\s_]*)+(n[\W\s_]*)+)+([\W\s_]+|$)/gi
    );
    if (num < 3) {
      if (pure !== null) {
        db_updater(message.author.id);
        // message.channel.send(`warning: consecutive messages containing "${pure.join('').trim()}"`);
        evidence = [];
        count = 0;
      } else if (match !== null) {
        evidence.push(match.join("").trim());
        count += 1;
        rinAlg(num + 1);
      } else if (safeAttempt === null) {
        count = 0;
        evidence = [];
      }
    } else {
      db_updater(message.author.id);
      evidence = [];
      count = 0;
    }
  }
  rinAlg(count);
});

client.on("guildCreate", (server) => {
  hangman_games[server.id] = {};
});

client.login("ODEyOTIzODUwNjAxNzkxNTI5.YDH0VQ.iyHBPYchdoF6pYrWFzPKdwnAArI");
