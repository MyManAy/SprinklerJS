const rRegex =
  /(^|[\W\s_]+)(r[\W\s_]*)+(?=(([il][\W\s_]*)+(((n[\W\s_]*)+)?((s[\W\s_]*)+)?)?)?$)/gi;
/*const iRegex = /(?<=(^|[\W\s_]+)r*)([il][\W\s_]*)+(?=((n[\W\s_]*)+((s[\W\s_]*)+)?)?$)/gi;
const nRegex = /(?<=(^|[\W\s_]+)r*i*)(n[\W\s_]*)+(?=((s[\W\s_]*)+)?$)/gi;
search_word = "dog"
search_letters = search_word.split("")
var rRegex = new RegExp(`(^|[\W\s_]+)(${search_letters[0]}[\W\s_]*)+(?=((${search_letters[1]}[\W\s_]*)+(((${search_letters[2]}[\W\s_]*)+)?((s[\W\s_]*)+)?)?)?$)`, `gi`);
var iRegex = new RegExp(`(?<=(^|[\W\s_]+)${search_letters[0]}*)(${search_letters[1]}[\W\s_]*)+(?=((${search_letters[2]}[\W\s_]*)+((s[\W\s_]*)+)?)?$)`, "gi");
var nRegex = new RegExp(`(?<=(^|[\W\s_]+)${search_letters[0]}*${search_letters[1]}*)(${search_letters[2]}[\W\s_]*)+(?=((s[\W\s_]*)+)?$)`, "gi");*/
/*const prefix = /^<.+>$/;
var str = "<<hangman>>";
var empty = [];
if (str.match(prefix) !== null) {
    console.log("yes");
    const args = str.replace(/[<>]/g, "").split(/ +/);
    const command = args.shift().toLowerCase();
    console.log(args + " " + command)
    if (command === "hangman") {
        var list = random_words(3);

        for (var i = 0; i < list.length; i++) {
            empty.push(list[i].split("").join(" "));
        }
        console.log(empty);
    }
}*/

`
hangman_games: [
    user: {
        current_status: ""
        complete_word: ""
    }
]
`;
/*var hangman_games = {};
var current_status = empty.join("    ").replace(/\S/gi, "_");
var test = 48292459853

hangman_games = Object.assign(hangman_games, { [test]: { "current_status": current_status, "complete_word": empty.join("    ") } });
hangman_games = Object.assign(hangman_games, { ["jess"]: { "current_status": current_status, "complete_word": empty.join("    ") } });
hangman_games = Object.assign(hangman_games, { ["jecc"]: { "current_status": current_status, "complete_word": empty.join("    ") } });
console.log(JSON.stringify(hangman_games[test]["complete_word"], null, 4));
if (hangman_games[test]["complete_word"].includes("z")) {
    console.log("yup")
}*/

/*var matches = [];
for (var i = 0; i < "apple".length; i++) {
    if ("apple"[i] === "p") {
        matches.push(i);
    }
}
if (!matches.length) {
    console.log("nope");
} else {
    var app = "apple";
    for (var i = 0; i < matches.length; i++) {
        app = replaceChars(app, matches[i], "_")
    }
    console.log(app);
}*/
/*const schema = new Schema({
    
    guild_id: {
        member_id: {
            name: {type: String},
            words_today: { type: Number },
            avg_daily_words: { type: Number }
        }
    }

})*/
/*list  = ["Admn", "dede", "devenoper"]
  
if (list.some(role => {
        switch(role) {
            case "Admin":
                console.log(role);
                return true;
            
            case "bot access":
                console.log(role);
                return true;
                
            case "developer":
                console.log(role);
                return true;

        }
    })) { 
} else {
    console.log("Sorry you don't have the correct permissions!");
    return;
}*/

list = [5, 4];
list.splice(undefined, 1);
console.log(list);
