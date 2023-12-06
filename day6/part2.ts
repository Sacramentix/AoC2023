const input = Deno.readTextFileSync("./input.txt");

const lines = input.split(/\r?\n/);
const time = +lines[0].substring(lines[0].indexOf(":")+1).trim().split(/\s+/).join("");
const distance = +lines[1].substring(lines[1].indexOf(":")+1).trim().split(/\s+/).join("");

const perf = performance.now();
let result = 1;
for (let x=1;Math.floor(time/2);x++) {
    const y = (time-x)*x;
    if (y>distance) {
        result *= (time-x*2)+1;
        break;
    }
}

console.log(`solve in ${performance.now()-perf}ms`);

console.log(result);