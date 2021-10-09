
/**
 * 成员具体化
 * @example
 * @deprecated please use Required<>
Concrete<{       // => {
  a?: number     // =>   a: number
  b?: string     // =>   b: string
  c? () : void   // =>   c () : void
  d?: {          // =>   d: {
    e?: boolean  // =>     e: boolean
  }              // =>   }
}>               // => }
 */
export type Concrete<Type> = {
  [Property in keyof Type]-?: Concrete<Type[Property]>
}


/**
 * 成员可选化
 * @example
 * @deprecated please use Partial<>
Concrete<{       // => {
  a: number      // =>   a?: number
  b: string      // =>   b?: string
  c () : void    // =>   c? () : void
  d: {           // =>   d?: {
    e: boolean   // =>     e?: boolean
  }              // =>   }
}>               // => }
 */
export type Optional<Type> = {
  [Property in keyof Type]?: Optional<Type[Property]>;
}

/**
 * 函数的返回类型，函数返回Promise则获取Promise的Resolve返回对象
 * @example
function test (b: string) : number {
 return 1
}
async function test2 (a: number) : Promise<number> {
 return 1
}

let t : ReturnType<typeof test> // number
let t2 : ReturnType<typeof test2> // Promise<number>
let t3 : ReturnPromiseType<typeof test> // number
let t4 : ReturnPromiseType<typeof test2> // number
 */
export type ReturnPromiseType<
  Type extends (...args: any[]) => any // eslint-disable-line
> = Type extends (...args: any[]) => Promise<infer Return> // eslint-disable-line
  ? Return
  : ReturnType<Type>;

export type IsomorphicDestructurable<
  T extends Record<string, unknown>,
  A extends readonly any[] // eslint-disable-line
> = T & A

/**
 * 非数组类型
 */
export type NonArray<T> = T extends Array<unknown> ? T[0] : T
