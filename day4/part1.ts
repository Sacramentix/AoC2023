// See part 2 for comment
const input = Deno.readTextFileSync("./input.txt");

const lines = input.split(/\r?\n/);

let result = 0;
const copyMap:Record<number,number> = {}
for (const line of lines) {
    const [card, numbers] = line.split(":");
    const [winNumbers, ourNumbers] = numbers.split("|").map(allNumberString=>allNumberString.trim().split(/\s+/).map(n=>Number(n)));
    const gain = ourNumbers.reduce((acc,n) => winNumbers.indexOf(n) != -1 ? Math.max(acc*2,1) : acc,0);
    result += gain;
}

console.log(result);