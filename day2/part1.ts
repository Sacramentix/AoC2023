const input = Deno.readTextFileSync("./input.txt");

type Color = "red" | "green" | "blue";

const colorThreshold:Record<Color, number> = {
    red: 12,
    green: 13,
    blue: 14
}

const lines = input.split(/\r?\n/);

const result = lines.reduce((acc,line)=>{
    const [offset, id] = /Game (\d+):/.exec(line)??[] as unknown as [string, string];
    return acc + (
            line.slice(offset.length)
                .split(";")
                .map(subset=>[...subset.matchAll(/(\d+) (red|green|blue)/g)].map<[number, Color]>(([_,n,color])=>[Number(n),color as Color]))
                    .some(subset=>subset.some(([n,color])=> n>colorThreshold[color]))
            ? 0 : Number(id)
        );
},0);

console.log(result);