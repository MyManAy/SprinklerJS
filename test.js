const random_words = require("random-words");
/*const rRegex = /(^|[\W\s_]+)(r[\W\s_]*)+(?=(([il][\W\s_]*)+(((n[\W\s_]*)+)?((s[\W\s_]*)+)?)?)?$)/gi;
const iRegex = /(?<=(^|[\W\s_]+)r*)([il][\W\s_]*)+(?=((n[\W\s_]*)+((s[\W\s_]*)+)?)?$)/gi;
const nRegex = /(?<=(^|[\W\s_]+)r*i*)(n[\W\s_]*)+(?=((s[\W\s_]*)+)?$)/gi;
search_word = "dog"
search_letters = search_word.split("")
var rRegex = new RegExp(`(^|[\W\s_]+)(${search_letters[0]}[\W\s_]*)+(?=((${search_letters[1]}[\W\s_]*)+(((${search_letters[2]}[\W\s_]*)+)?((s[\W\s_]*)+)?)?)?$)`, `gi`);
var iRegex = new RegExp(`(?<=(^|[\W\s_]+)${search_letters[0]}*)(${search_letters[1]}[\W\s_]*)+(?=((${search_letters[2]}[\W\s_]*)+((s[\W\s_]*)+)?)?$)`, "gi");
var nRegex = new RegExp(`(?<=(^|[\W\s_]+)${search_letters[0]}*${search_letters[1]}*)(${search_letters[2]}[\W\s_]*)+(?=((s[\W\s_]*)+)?$)`, "gi");*/
const prefix = /^<.+>$/;
var str = "<<hangman>>";
if (str.match(prefix) !== null) {
    console.log("yes");
    const args = str.replace(/[<>]/g, "").split(/ +/);
    const command = args.shift().toLowerCase();
    console.log(args + " " + command)
    if (command === "hangman") {
        var list = random_words(3);
        var empty = [];

        for (var i = 0; i < list.length; i++) {
            empty.push(list[i].split("").join(" "));
        }
        console.log(empty);
    }
}