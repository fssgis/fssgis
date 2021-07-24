export declare type Concrete<Type> = {
    [Property in keyof Type]-?: Type[Property];
};
export declare type Concrete2<Type> = {
    [Property in keyof Type]?: Type[Property];
};
export declare type BaseObject = Record<string, any>;
