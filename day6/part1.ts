const input = Deno.readTextFileSync("./input.txt");

const lines = input.split(/\r?\n/);
const times = lines[0].substring(lines[0].indexOf(":")+1).trim().split(/\s+/).map(s=>Number(s));
const distances = lines[1].substring(lines[1].indexOf(":")+1).trim().split(/\s+/).map(s=>Number(s));

function* toTuples<T>(a:T[],b:T[]):Generator<[T,T], void, unknown> {
    for (let i=0;i< a.length;i++) {
        yield [a[i], b[i]];
    }
}
let result = 1;
for (const [time,distance] of toTuples(times, distances)) {
    for (let x=1;Math.floor(time/2);x++) {
        const y = (time-x)*x;
        if (y>distance) {
            result *= (time-x*2)+1;
            break;
        }
    }
}

console.log(result);