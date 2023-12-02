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

const reverse = <T extends string>(s:T):ReverseString<T> => s.split("").reverse().join("") as any; // Take a string and return the reverse. one => eno;
const reverseKeys = <T extends {}>(o:T):ReverseKeys<T> => Object.entries(o).reduce((acc,[k,v]) => acc[reverse(k)] = v && acc, {} as any);
const reverseDigits = reverseKeys(digits); // Take the digits object and reverse each key and preserve value {one: 1} => {eno: 1}

const matchFirst = <T extends {}>(o:T) => {
    const regex = new RegExp(Object.keys(o).join("|"));
    return (s:string):T[keyof T] => o[regex.exec(s)?.[0] as (keyof typeof o)]
} // A function that return a function that return the value (1,2,3...) assiocated with the first key (one,two,three...) match.

const matchFirstDigit = matchFirst(digits); // create a function that match digit and return the corresponding number
const findFirstDigit = (line:string) => matchFirstDigit(line);

const matchFirstReverseDigit = matchFirst(reverseDigits); // create a function that match digit in reverse (eno,owt,eerht...) and return the corresponding number
const findLastDigit = (line:string) => matchFirstReverseDigit(reverse(line)); // match the first reverse digit while reading line backward

const finalResult = lines.reduce((r, line) => r + (findFirstDigit(line) * 10) + findLastDigit(line) ,0);

console.log(finalResult);
