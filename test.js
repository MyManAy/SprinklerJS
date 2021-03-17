const random_words = require("random-words");
function replaceChars(string, index, replacement) {
    if (index >= string.length) {
        return string.valueOf();
    }
 
    return string.substring(0, index) + replacement + string.substring(index + 1);
}
/*const rRegex = /(^|[\W\s_]+)(r[\W\s_]*)+(?=(([il][\W\s_]*)+(((n[\W\s_]*)+)?((s[\W\s_]*)+)?)?)?$)/gi;
const iRegex = /(?<=(^|[\W\s_]+)r*)([il][\W\s_]*)+(?=((n[\W\s_]*)+((s[\W\s_]*)+)?)?$)/gi;
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
`
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
function hello(word) {
    return word;
}
console.log(hello("world"));
hello = word => word;
console.log(hello("world"));