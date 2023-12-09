const input = Deno.readTextFileSync("./input.txt");

const [raw_lrs, raw_paths] = input.split(/\r?\n\r?\n/);

const lrs = raw_lrs.split("").map(c=>c=="L"?0:1);

const lettersToNumber = (s:string)=>s.split("").reduce((acc, c)=>acc*32+(c.charCodeAt(0)-"A".charCodeAt(0)),0);

const nodeMap = new Map<number,[number,number]>();
raw_paths.split(/\r?\n/)
    .map(line=>[line.substring(0,3),line.substring(7,10),line.substring(12,15)])
    .forEach(([node,left,right],i)=>nodeMap.set(lettersToNumber(node),[lettersToNumber(left), lettersToNumber(right)]));

// const startNode = lettersToNumber("LCP");
const startNode = lettersToNumber("AAA");
const endNode = lettersToNumber("ZZZ");

let currentNode = startNode;
let i = 0;
const perf = performance.now();
while (currentNode != endNode) {
    currentNode = nodeMap.get(currentNode)![lrs[i++%lrs.length]];
}

console.log("finish");
console.log(i);