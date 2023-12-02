


type Split<T extends string, SEP extends string = never> = T extends `${infer P}${SEP}${infer L}`
 ? [P , ...Split<L, SEP>]
 : T extends `${infer _}`
   ? T extends SEP ? [] : [T]
   : string []


type Join<T extends unknown[], U extends string | number> = T extends [infer F extends string, ...infer R]
  ? `${F}${R extends [] ? '' : U}${Join<R, U>}`
  : ''

type ReverseArray<T extends unknown[]> = T extends [...infer Rest, infer Last] ? [Last, ...ReverseArray<Rest>] : T;

export type ReverseString<T extends string> = Join<ReverseArray<Split<T,''>>,''>;

export type ReverseKeys<T> = { [K in keyof T as ReverseString<K & string>]: T[K] };


