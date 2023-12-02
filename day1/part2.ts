import type { ReverseKeys, ReverseString } from "./type.ts";

const input = Deno.readTextFileSync("./input.txt");

const lines = input.split(/\r?\n/);

const digits = {
    "1": 1, "one":   1,
    "2": 2, "two":   2,
    "3": 3, "three": 3,
    "4": 4, "four":  4,
    "5": 5, "five":  5,
    "6": 6, "six":   6,
    "7": 7, "seven": 7,
    "8": 8, "eight": 8,
    "9": 9, "nine":  9

} as const;

const reverse = <T extends string>(s:T):ReverseString<T> => s.split("").reverse().join("") as any;
const reverseKeys = <T extends {}>(o:T):ReverseKeys<T> => Object.entries(o).reduce((acc,[k,v]) => acc[reverse(k)] = v && acc, {} as any);
const reverseDigits = reverseKeys(digits);

const matchFirst = <T extends {}>(o:T) => {
    const regex = new RegExp(Object.keys(o).join("|"));
    return (s:string):T[keyof T] => o[regex.exec(s)?.[0] as (keyof typeof o)]
}

const matchFirstDigit = matchFirst(digits);
const findFirstDigit = (line:string) => matchFirstDigit(line);

const matchFirstReverseDigit = matchFirst(reverseDigits);
const findLastDigit = (line:string) => matchFirstReverseDigit(reverse(line));;

const finalResult = lines.reduce((r, line) => r + (findFirstDigit(line) * 10) + findLastDigit(line) ,0);

console.log(finalResult);
