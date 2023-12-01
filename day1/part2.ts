const input = Deno.readTextFileSync("./input.txt");

const lines = input.split(/\r?\n/);

const digitToValue = {
    "1": 1,
    "2": 2,
    "3": 3,
    "4": 4,
    "5": 5,
    "6": 6,
    "7": 7,
    "8": 8,
    "9": 9,
    "one":   1,
    "two":   2,
    "three": 3,
    "four":  4,
    "five":  5,
    "six":   6,
    "seven": 7,
    "eight": 8,
    "nine":  9
} as const;

const reverseDigitToValue = Object.entries(digitToValue).reduce<any>((acc,[k,v]) => {
    acc[reverse(k)] = v;
    return acc;
}, {});

function reverse(s:string) {
    return s.split("").reverse().join("");
}
const regex = new RegExp(Object.keys(digitToValue).join("|"));
function findFirstDigit(line:string) {
   return digitToValue[regex.exec(line)?.[0] as (keyof typeof digitToValue)];
}

const reverseRegex = new RegExp(Object.keys(reverseDigitToValue).join("|"));
function findLastDigit(line:string) {
    return reverseDigitToValue[reverseRegex.exec(reverse(line))?.[0] as (keyof typeof reverseDigitToValue)];
}

const finalResult = 
    lines.reduce((result, line) => 
        result + 
        (findFirstDigit(line) * 10) +
        findLastDigit(line)
    ,0);

console.log(finalResult);
