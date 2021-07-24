export type Concrete<Type> = {
  [Property in keyof Type]-?: Type[Property];
}

export type Concrete2<Type> = {
  [Property in keyof Type]?: Type[Property];
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type BaseObject = Record<string, any>
