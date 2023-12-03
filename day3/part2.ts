const input = Deno.readTextFileSync("./input.txt");

// We replace all extra symbol by X to simplify the process
const grid = input.split(/\r?\n/).map(line=>line.replaceAll(/[^\*\.0-9]/g,'X').split(""));

/**
 * The current position of cursor of the grid iterator
 * it's used to skip iteration when part is found
 */
const cursor = {
    x: 0,
    y: 0
}

/**
 * Generator function to ease iteration of grid go cell by cell, line by line
 * x:0 y:0 -> x:1 y:0 -> x:2 y:0 ... x:0 y:1 -> x:1 y:1 -> x:2 y:1 ...
 * We can skip some of the cell by changing cursor
 */
function* iterateGrid() {
    for (cursor.y=0;cursor.y<grid.length;cursor.y++) {
        const line = grid[cursor.y];
        for (cursor.x=0;cursor.x<line.length;cursor.x++) { 
            yield { x: cursor.x, y: cursor.y, cell: grid[cursor.y][cursor.x] }
        }
    } 
}

const digits = ['0','1','2','3','4','5','6','7','8','9'];

/**
 * 
 * @param cell the cell to check
 * @returns if this cell iscount as symbol
 * Gear denoted by '*' seems to also be valid symbol for part count
 */
const isSymbol = (cell:string) => cell == 'X' || cell == '*';

/**
 * 
 * @param x pos of cell
 * @param y pos of cell
 * @param n current value of cell
 * @returns -1 if cell is not part otherwise return cell value
 */
function iterateNeighbor(x:number, y:number, n:string) {
    // order of neightbor visit
    // 1 4 7
    // 2 5 8
    // 3 6 9
    // Cell we should skip in different scenario
    // When n have more that 1 digit it means neighbor at the left
    // as already been visited by previous pass
    const skipCell = n.length > 1 ?
                        ( (di:number) => di < 4 || di%3 == 2 ) :    // 4 6 7 9
                        ( (di:number) => di == 5 || di == 8 )       // 1 2 3 4 6 7 9
    let i = 0;
    for (let dx=x-1;dx<=(x+1);dx++) {
        for (let dy=y-1;dy<=(y+1);dy++) {
            i++;
            if (skipCell(i)) continue;
            const cell = grid[dy]?.[dx];
            // if we found a neighbor cell that is a valid symbol
            // we can grab the rest of the digit to the right
            // to complete the part number
            // and move the cursor to prevent counting it twice
            if (isSymbol(cell)) {
                let result = n;
                let di = 1;
                while (true) {
                    const rightCell = grid[y][x+di];
                    if (!digits.includes(rightCell)) break;
                    result += rightCell;
                    di++;
                }
                cursor.x = x+di;
                return Number(result);
            }
        }
    }
    const rightCell = grid[y][x+1];
    if (digits.includes(rightCell)) return iterateNeighbor(x+1,y,n+rightCell);
    cursor.x = x+1;
    if (isSymbol(rightCell)) return Number(n);
    return -1;
}

const EMPTY = -2;

const allGearCoord = [];

// We initiliaze a part grid map with onyl empty cell that match the size of th grid
const partGrid = Array.from(Array(grid.length), (_) => Array.from(Array(grid[0].length), (_) => EMPTY));

// We iterate the grid to add all valid part number to the part grid
for (const { x, y, cell } of iterateGrid()) {
    if (digits.includes(cell)) {
        const n = iterateNeighbor(x,y,cell);
        // if iterateNeighbor not return -1 it means we found a part
        if (n!=-1) {
            // a part number with 3 digit for example take 3 cell in the part grid
            // we use a for to place the part number in all needed cell
            for (let i=0;i<(`${n}`).length;i++) {
                partGrid[y][x+i] = n;
            }
        }
    }
}

// We re iterate to find all gear coord because some cells have been skipped in previous block
for (const { x, y, cell } of iterateGrid()) {
    if (cell == "*") {
        allGearCoord.push([x,y]);
    }
}

/**
 * 
 * @param x pos of gear
 * @param y pos of gear
 * @returns the gear ratio for gear with 2 neighbor otherwise return 0
 */
function iterateGearNeighbor(x:number,y:number) {
    const neighbors = [];
    for (let dy=y-1;dy<=(y+1);dy++) {
        // We keep track is the previous cell to the left was a valid part
        // to avoid counting for example a 3 digit part number as 3 neighbor
        let previousIsPart = false;
        for (let dx=x-1;dx<=(x+1);dx++) {
            const isPart = partGrid[dy][dx] > 0;
            if (isPart && !previousIsPart) {
                if (neighbors.length>=2) return 0;
                neighbors.push(partGrid[dy][dx]);
            }
            previousIsPart = isPart;
        }   
    }
    if (neighbors.length != 2) return 0;
    return neighbors[0] * neighbors[1];
}

let result = 0;
// We sum all gear ratio
for (const [x,y] of allGearCoord) {
    result += iterateGearNeighbor(x,y);
}

console.log(result);
