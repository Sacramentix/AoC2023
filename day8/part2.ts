const input = Deno.readTextFileSync("./input.txt");
// const input = 
// `LR

// DDA = (DDB, XXX)
// DDB = (XXX, DDZ)
// DDZ = (DDB, XXX)
// EEA = (EEB, XXX)
// EEB = (EEC, EEC)
// EEC = (EEZ, EEZ)
// EEZ = (EEB, EEB)
// XXX = (XXX, XXX)`;

const [raw_lrs, raw_paths] = input.split(/\r?\n\r?\n/);

const lrs = raw_lrs.split("").map(c=>c=="L"?0:1);

const lettersToNumber = (s:string)=>s.split("").reduce((acc, c)=>acc*32+(c.charCodeAt(0)-"A".charCodeAt(0)),0);

const nodeMap = new Map<number,[number,number]>();
const startNodes:number[] = [];
raw_paths.split(/\r?\n/)
    .map(line=>[line.substring(0,3),line.substring(7,10),line.substring(12,15)])
    .forEach(([node,left,right],i)=>{
        const nodeN = lettersToNumber(node);
        nodeMap.set(nodeN,[lettersToNumber(left), lettersToNumber(right)]);
        ((nodeN & 0b11111) == 0) && startNodes.push(nodeN);
        // console.log(nodeN);
    });

const endNode = lettersToNumber("ZZZ");

const currentNodes = startNodes.slice();

const perf = performance.now();

const nodesZ:number[][] = Array.from(Array(startNodes.length), _=>[]);

for (let j=0;j<currentNodes.length;j++) {
    const visitedNodes = new Set<bigint>();
    let i = 0;
    while (true) {
        const visit = BigInt(currentNodes[j]) + BigInt((i%lrs.length) << 15) ;
        if (visitedNodes.has(visit)) break;
        visitedNodes.add(visit);
        currentNodes[j] = nodeMap.get(currentNodes[j])![lrs[i++%lrs.length]];
        if ((currentNodes[j] & 0b11111)==25) nodesZ[j].push(i);
    }
}

function gcd(a: bigint, b: bigint): bigint {
    return b === 0n ? a : gcd(b, a % b);
}
  
function lcm(a: bigint, b: bigint): bigint {
    return (a * b) / gcd(a, b);
}
  
function findSmallestCommonMultiplier(arrays: number[][]): bigint {
    // Calculate LCM for each sub-array
    const lcms = arrays.map(subArray => {
      return subArray.reduce((acc, val) => {
        return lcm(acc, BigInt(val));
      }, 1n);
    });
  
    // Find LCM of all LCMs
    return lcms.reduce((acc, val) => {
      return lcm(acc, val);
    }, 1n);
}

console.log("finish");
console.log(`${performance.now() - perf}ms`);
console.log(findSmallestCommonMultiplier(nodesZ));
console.log(nodesZ.reduce((x,ms)=>x*ms.reduce((y,m)=>Math.min(y,m),Number.MAX_SAFE_INTEGER),1));