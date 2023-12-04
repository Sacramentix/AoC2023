// See part 2 for comment
const input = Deno.readTextFileSync("./input.txt");

const lines = input.split(/\r?\n/);

let originalCardCount = 0;
const copyMap:Record<number,number> = {}
for (const line of lines) {
    const [card, numbers] = line.split(":");
    const gameId = parseInt(card.substring(5));
    const cardAmount = (copyMap[gameId] ?? 0) + 1;
    const [winNumbers, ourNumbers] = numbers.split("|").map(allNumberString=>allNumberString.trim().split(/\s+/).map(n=>Number(n)));
    const gain = ourNumbers.reduce((acc,n) => winNumbers.indexOf(n) != -1 ? acc+1: acc,0);
    for(let i=1;i<=gain;i++) {
        copyMap[gameId+i] = (copyMap[gameId+i] ?? 0) + cardAmount;
    }
    originalCardCount++;
}

const result = Object.values(copyMap).reduce((acc,n)=>acc+n,0) + originalCardCount;

console.log(result);