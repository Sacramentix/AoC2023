const input = Deno.readTextFileSync("./input.txt");

const lines = input.split(/\r?\n/).map(line=>line.replaceAll(/[^\.0-9]/g,'X').split(""));

const coord = {
    x: 0,
    y: 0
}

function* iterateGrid() {
    for (coord.y=0;coord.y<lines.length;coord.y++) {
        const line = lines[coord.y];
        for (coord.x=0;coord.x<line.length;coord.x++) { 
            yield { x: coord.x, y: coord.y, cell: lines[coord.y][coord.x] }
        }
    } 
}
const digits = ['0','1','2','3','4','5','6','7','8','9'];

function iterateNeighbor(x:number, y:number, n:string) {
    // 1 4 7
    // 2 5 8
    // 3 6 9
    const skipCell = n.length > 1 ?
                        ( (di:number) => di < 4 || di%3 == 2 ) :    // 4 6 7 9
                        ( (di:number) => di == 5 || di == 8 )       // 1 2 3 4 6 7 9
    let i = 0;
    for (let dx=x-1;dx<=(x+1);dx++) {
        for (let dy=y-1;dy<=(y+1);dy++) {
            i++;
            if (skipCell(i)) continue;
            // console.log(`dx: ${dx} dy: ${dy} i: ${i}`);
            const cell = lines[dy]?.[dx];
            if (cell == 'X') {
                let result = n;
                let di = 1;
                while (true) {
                    const rightCell = lines[y][x+di];
                    if (!digits.includes(rightCell)) break;
                    result += rightCell;
                    di++;
                }
                coord.x = x+di;
                return Number(result);
            }
        }
    }
    const rightCell = lines[y][x+1];
    if (digits.includes(rightCell)) return iterateNeighbor(x+1,y,n+rightCell);
    coord.x = x+1;
    if (rightCell == 'X') return Number(n);
    console.log(`x: ${x} y: ${y} n: ${n}`);
    return -1;
}

let sum = 0;
for (const { x, y, cell } of iterateGrid()) {
    if (digits.includes(cell)) {
        const n = iterateNeighbor(x,y,cell);
        if (n!=-1) sum += n;
    }
}

console.log(sum);
