const input = Deno.readTextFileSync("./input.txt");

const sequences = input.split(/\r?\n/).map(line=>line.split(/\s+/).map(s=>Number(s)));

function findExtrapolation(sequence:number[]) {
    const sequencePyramid = [sequence];
    while(true) {
        const lastSequence = sequencePyramid.at(-1)!;
        if (!lastSequence.some(n=>n!=lastSequence[0])) break;
        const nextSequence = [];
        for(let i=0;i<=(lastSequence.length-2);i++) {
            nextSequence.push(lastSequence[i+1]-lastSequence[i]);
        }
        sequencePyramid.push(nextSequence);
    }
    return sequencePyramid.reduce((acc,sequence)=>sequence.at(-1)!+acc,0);
}

const result = sequences.reduce((acc,sequence)=>acc+findExtrapolation(sequence),0);
console.log(result);