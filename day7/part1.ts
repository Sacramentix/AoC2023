const input = Deno.readTextFileSync("./input.txt");

const card = {
    "A": 13, "J": 10, "8": 7, "5": 4,
    "K": 12, "T": 9, "7": 6, "4": 3,
    "Q": 11, "9": 8, "6": 5, "3": 2,
    "2": 1,
} as const;

const HIGHEST_1_HAND = 16+16**2+16**3+16**4+16**5;
const HIGHEST_2_HAND = HIGHEST_1_HAND+16+16**2+16**3+16**4;
const HIGHEST_2X2_HAND = HIGHEST_2_HAND+16+16**2+16**3;
const HIGHEST_3_HAND = HIGHEST_2X2_HAND+16+16**2+16**3;
const HIGHEST_3X2_HAND = HIGHEST_3_HAND+16+16**2
const HIGHEST_4_HAND = HIGHEST_3X2_HAND+16+16**2;

const rawGames = input.split(/\r?\n/).map(s=>s.split(/\s+/)) as [hand:string,bid:string][];
const games = rawGames.map<[[number,number],number,string]>(r=>
    [
        calculateHandStrength(r[0]),
        Number(r[1]),
        r[0]
    ]);
// const HIGHEST_5_HAND = HIGHEST_CARD_HAND+16;
// function calculateHandStrength(hand:[number, number][]) {
//     return  hand[0][1] == 5 ?   HIGHEST_4_HAND+hand[0][0] :
//             hand[0][1] == 4 ?   HIGHEST_3X2_HAND+16*hand[0][0]+hand[1][0] :
//             hand[0][1] == 3 && hand[1][1] == 2 ? HIGHEST_3_HAND+16*hand[0][0]+hand[1][0] :
//             hand[0][1] == 3 ?   HIGHEST_2X2_HAND+256*hand[0][0]+16*hand[1][0]+hand[2][0] :
//             hand[0][1] == 2 && hand[1][1] == 2 ? HIGHEST_2_HAND+256*hand[0][0]+16*hand[1][0]+hand[2][0] :
//             hand[0][1] == 2 ?   HIGHEST_1_HAND+4096*hand[0][0]+256*hand[1][0]+16*hand[2][0]+hand[3][0] :
//                                 65536*hand[0][0]+4096*hand[1][0]+256*hand[2][0]+16*hand[3][0]+hand[4][0];
// }

function calculateHandStrength(raw_hand:string):[number,number] {
    const raw_hand_value = raw_hand.split('').map(c=>card[c as keyof typeof card]);
    const hand_combo_entries = raw_hand_value.reduce((map, n) => map.set(n, (map.get(n) ?? 0) + 1), new Map<number, number>()).entries();
    const hand = [...hand_combo_entries].sort((a,b)=>b[1]-a[1]);
    const value = 65536*raw_hand_value[0]+4096*raw_hand_value[1]+256*raw_hand_value[2]+16*raw_hand_value[3]+raw_hand_value[4];
    return  hand[0][1] == 5 ? [6,value] :
            hand[0][1] == 4 ? [5,value] :
            hand[0][1] == 3 && hand[1][1] == 2 ?  [4,value] :
            hand[0][1] == 3 ? [3,value] :
            hand[0][1] == 2 && hand[1][1] == 2 ?  [2,value] :
            hand[0][1] == 2 ? [1,value] :
                              [0,value];
}


games.sort((a,b)=>a[0][0]-b[0][0] || a[0][1]-b[0][1]);


const result = games.reduce((acc,game,i)=>acc+game[1]*(i+1),0);
console.log(calculateHandStrength("22224"))
console.log(result);

// 1118710
// 1552737