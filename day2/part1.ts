const input = Deno.readTextFileSync("./input.txt");

type Color = "red" | "green" | "blue";

const colorThreshold:Record<Color, number> = {
    red: 12,
    green: 13,
    blue: 14
}

const lines = input.split(/\r?\n/);

const result = lines.reduce((acc,line)=>{ // we iterate over each line and add ...
    const [offset, id] = /Game (\d+):/.exec(line)??[] as unknown as [string, string]; // we get the game id with a regex
    return acc + (
            line.slice(offset.length) // and we split the game id from it's content using the offset
                .split(";") // We split each game into subset
                .map(subset=>[...subset.matchAll(/(\d+) (red|green|blue)/g)].map<[number, Color]>(([_,n,color])=>[Number(n),color as Color])) // we transform each subset into tuple of [number of cube, color of cube]
                    .some(subset=>subset.some(([n,color])=> n>colorThreshold[color])) // We check if each color of cube is under their respective threshold
            ? 0 : Number(id) // We add the id of the game only is SOME some of the subset of this game had color above threshold
        );
},0);

console.log(result);