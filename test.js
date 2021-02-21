/*e = "rrrr  ";
var rRegex = /(r+\s*)+(?=((i+\s*)+((n+\s*)+)?)?$)/gi;
var iRegex = /(i+\s*)+(?=((n+\s*)+)?$)/gi;
var nRegex = /(n+\s*)+$/gi;
const regexRecurs = [rRegex, iRegex, nRegex];
var count = 0;
let evidence = [];

function rinAlg(num) {
    
    let match = e.match(regexRecurs[num]);
    if (num <= 3) {
        if (match !== null) {
            evidence.push(match);
            count += 1;
            rinAlg(num + 1);
        }
    }
}
rinAlg(count)
e = "rrrr i  i i   ";
rinAlg(count)
e = " nn n n n ";
rinAlg(count)
console.log(evidence.join(""))*/