const input = Deno.readTextFileSync("./input.txt");
// const input = 
// `0 3 6 9 12 15
// 1 3 6 10 15 21
// 10 13 16 21 30 45`;
// -3 + 0 + 5 = 2;

const out = (s:string) => Deno.stdout.writeSync(new TextEncoder().encode(s));

const sequences = input.split(/\r?\n/).map(line=>line.split(/\s+/).map(s=>Number(s)));

function findExtrapolation(sequence:number[]) {
    const sequencePyramid = [sequence];
    while(true) {
        const lastSequence = sequencePyramid.at(-1)!;
        if (!lastSequence.some(n=>n!=0)) break;
        const nextSequence = [];
        for(let i=0;i<=(lastSequence.length-2);i++) {
            nextSequence.push(lastSequence[i+1]-lastSequence[i]);
        }
        sequencePyramid.push(nextSequence);
    }
    return sequencePyramid.reduceRight((acc,s, i) => s.at(0)!-acc,0);;
}

const result = sequences.reduce((acc,sequence)=>acc+findExtrapolation(sequence),0);
console.log(result);