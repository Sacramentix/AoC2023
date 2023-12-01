const input = Deno.readTextFileSync("./input.txt");

const lines = input.split(/\r?\n/);

const finalResult = 
    lines.reduce((result, line) => 
        result + 
        (Number([...line].find(l=>/\d/.test(l)))*10) +
        Number([...line].findLast(l=>/\d/.test(l)))
    ,0);

console.log(finalResult);
