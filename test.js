/*const rRegex = /(^|[\W\s_]+)(r[\W\s_]*)+(?=(([il][\W\s_]*)+(((n[\W\s_]*)+)?((s[\W\s_]*)+)?)?)?$)/gi;
const iRegex = /(?<=(^|[\W\s_]+)r*)([il][\W\s_]*)+(?=((n[\W\s_]*)+((s[\W\s_]*)+)?)?$)/gi;
const nRegex = /(?<=(^|[\W\s_]+)r*i*)(n[\W\s_]*)+(?=((s[\W\s_]*)+)?$)/gi;
search_word = "dog"
search_letters = search_word.split("")
var rRegex = new RegExp(`(^|[\W\s_]+)(${search_letters[0]}[\W\s_]*)+(?=((${search_letters[1]}[\W\s_]*)+(((${search_letters[2]}[\W\s_]*)+)?((s[\W\s_]*)+)?)?)?$)`, `gi`);
var iRegex = new RegExp(`(?<=(^|[\W\s_]+)${search_letters[0]}*)(${search_letters[1]}[\W\s_]*)+(?=((${search_letters[2]}[\W\s_]*)+((s[\W\s_]*)+)?)?$)`, "gi");
var nRegex = new RegExp(`(?<=(^|[\W\s_]+)${search_letters[0]}*${search_letters[1]}*)(${search_letters[2]}[\W\s_]*)+(?=((s[\W\s_]*)+)?$)`, "gi");*/