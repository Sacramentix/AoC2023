const input = Deno.readTextFileSync("./input.txt");

const lines = input.split(/\r?\n/);

const finalResult = 
    lines.reduce((result, line) => // We iterate over all line and add ...
        result + 
        (Number([...line].find(l=>/\d/.test(l)))*10) +  // The first digit matched by this regex /\d/ multiplied by 10
        Number([...line].findLast(l=>/\d/.test(l)))     // And the last digit
    ,0);

console.log(finalResult);
