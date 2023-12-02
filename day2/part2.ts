
const input = Deno.readTextFileSync("./input.txt");

type Color = "red" | "green" | "blue";

const order:Record<Color,number> = {
    red: 0,
    green: 1,
    blue: 2
}

const lines = input.split(/\r?\n/);

const result = lines.reduce((acc,line)=>{
    const [offset, id] = /Game (\d+):/.exec(line)??[] as unknown as [string, string];
    return acc + 
            line.slice(offset.length)
                .split(";")
                .map(subset=>[...subset.matchAll(/(\d+) (red|green|blue)/g)].map<[number, Color]>(([_,n,color])=>[Number(n),color as Color]))
                    .reduce((gameAcc, subset)=>
                        subset.reduce( (subsetAcc,[n,color]) => {
                            subsetAcc[order[color]] = n > subsetAcc[order[color]] ? n : subsetAcc[order[color]]
                            return subsetAcc;
                        }, gameAcc)
                    , [0,0,0])
                    .reduce((acc,colorPower, i) => acc*colorPower,1);
},0);

console.log(result);