
import { isMainThread, parentPort } from "node:worker_threads";
import { readFileSync } from "node:fs";
import { THREAD_AMOUNT } from "./part2.js";

const input = readFileSync("./input.txt", "utf-8");
// const input = Deno.readTextFileSync("./input.txt");

const [seedsLine, ...rawblocks] = input.split(/\r?\n\r?\n/);

const seeds = seedsLine.substring(seedsLine.indexOf(": ")+2).split(/\s+/).map(s=>Number(s));
// console.log(seeds);

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
            if (input > (r[SRC]+r[LEN]-1)) continue;
            return r[DEST] + input - r[SRC];
        }
        return input;
    }
});

function convert(input:number) {
    return convertors.reduce((acc,c)=>c(acc),input);
}

function* pairs<T>(array:T[]):Generator<[T,T], void, unknown> {
    for (let i = 0; i < array.length; i += 2) {
        yield [array[i], array[i + 1]];
    }
}

const initialRanges = [...pairs(seeds)].sort((a,b)=>a[0]-b[0]);
let previousTop = 0;
for (const range of initialRanges) {
    if (range[0] < previousTop) {
        range[1] -= (previousTop - range[0])
        range[0] = previousTop+1;
    }
    previousTop = range[0]+range[1];70478642
}
868814849
const n = initialRanges.reduce((acc,r)=>acc+r[1],0);

const perf = performance.now();

let lowest = Number.MAX_SAFE_INTEGER;
let done = -1;
if (isMainThread) {
    console.log(convert(82));
}
export function processPart(worker_input:number) {
    const quantity = (n/THREAD_AMOUNT)+1;
    const startAt = quantity*worker_input-1;
    functionbrk:
    for (const range of initialRanges) {
        for(let seed=range[0];seed<(range[0]+range[1]);seed++) {
            done++;
            if (done < startAt) continue;
            const location = convert(seed);
            lowest = Math.min(lowest,location);
            // (done % 10_000_000) == 0 && console.log(`${done.toLocaleString("fr")} / ${n.toLocaleString("fr")} in ${performance.now()-perf}ms | ${lowest}`);
            if (done >= (startAt+quantity+1)) break functionbrk;
        }
    }
    // console.log(`Worker complete :${done} in ${performance.now()-perf}ms | ${lowest}`);
    parentPort.postMessage(lowest);
}




