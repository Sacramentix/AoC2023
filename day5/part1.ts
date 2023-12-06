const input = Deno.readTextFileSync("./input.txt");


const [seedsLine, ...rawblocks] = input.split(/\r?\n\r?\n/);

const seeds = seedsLine.substring(seedsLine.indexOf(": ")+2).split(/\s+/).map(s=>Number(s));
console.log(seeds);

const DEST = 0;
const SRC = 1;
const LEN = 2;

const convertors = rawblocks.map(block=>{
    const lines = block.split(/\:\r?\n/)[1].split(/\r?\n/);
    const ranges = lines.map(line=>line.split(/\s+/).map(s=>Number(s))) as [destination:number,source:number,length:number][];
    ranges.sort((a,b)=>a[SRC]-b[SRC]);
    // console.log(ranges.map(r=>r[SRC].toLocaleString("fr")));
    return function (input:number) {
        for (const r of ranges) {
            if (input < r[SRC]) break;
            if (input > (r[SRC]+r[LEN])) continue;
            return r[DEST] + input - r[SRC];
        }
        return input;
    }
});

function convert(input:number) {
    return convertors.reduce((acc,c)=>c(acc),input);
}

let lowest = Number.MAX_SAFE_INTEGER;

console.log(seeds.length);

const perf = performance.now();

const dupedSeeds = [...seeds,...seeds,...seeds,...seeds,...seeds];

for (const seed of seeds) {
    const location = convert(seed);
    lowest = Math.min(lowest,location);
}

console.log(`in ${performance.now()-perf}`);
console.log(lowest);