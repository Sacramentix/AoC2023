
const input = Deno.readTextFileSync("./input.txt");

type Color = "red" | "green" | "blue";

const order:Record<Color,number> = {
    red: 0,
    green: 1,
    blue: 2
}

const lines = input.split(/\r?\n/);

const result = lines.reduce((acc,line)=>{ // we iterate over each line and add ...
    const [offset, id] = /Game (\d+):/.exec(line)??[] as unknown as [string, string]; // we get the game id with a regex
    return acc + 
            line.slice(offset.length) // and we split the game id from it's content using the offset
                .split(";") // We split each game into subset
                .map(subset=>[...subset.matchAll(/(\d+) (red|green|blue)/g)].map<[number, Color]>(([_,n,color])=>[Number(n),color as Color])) // we transform each subset into tuple of [number of cube, color of cube]
                    .reduce((gameAcc, subset)=> // We iterate over each subset of the game and keep track of highest cube quantity per color in a tuple [red cube, green cube,blue cube]
                        subset.reduce( (subsetAcc,[n,color]) => { // We iterate ovevr each color to check if quantity is higher than previous
                            subsetAcc[order[color]] = n > subsetAcc[order[color]] ? n : subsetAcc[order[color]]
                            return subsetAcc;
                        }, gameAcc)
                    , [0,0,0])
                    .reduce((acc,colorPower, i) => acc*colorPower,1); // we multiply each color highest quantity together [r,g,b] => 1*r*g*b, that will be added to previous game
},0);

console.log(result);