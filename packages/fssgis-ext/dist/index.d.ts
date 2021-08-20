interface IArrayExtension<T> {
    get $(): T[];
    insert(index: number, value: T): this;
    removeIndex(index: number): this;
    removeIndex(index: number, returnRemoveItem?: true): T;
    clear(): this;
    reset(...item: T[]): this;
    removeValue(value: T, removeMany?: boolean): this;
    unique(): this;
    getUnique(): T[];
    equal<K>(arr: K[]): boolean;
    findItem(propName: keyof T, propValue: T[keyof T]): T | undefined;
    findItems(propName: keyof T, propValue: T[keyof T]): T[];
    propToArr(propName: keyof T): T[keyof T][];
    last(): T;
}
declare function extArray<T>(target: T[]): IArrayExtension<T>;

interface IDateExtension {
    format(fmt: string): string;
    getNextDate(nDays: number): Date;
    getNextDate(nDays: string): Date;
    getMonth(): number;
}
declare function extDate(date: Date): IDateExtension;

interface INumberExtension {
    divide(val: number): number;
    floor(): number;
    ceil(): number;
    abs(): number;
    round(count?: number): number;
    toDate(): Date;
    toDateFormat(fmt: string): string;
    toCashString(): string;
    toChineseString(): string;
}
declare function extNumber(num: number): INumberExtension;

interface IStringExtension {
    trimAll(): string;
    toDate(): Date;
    toDateFormat(fmt: string): string;
}
declare function extString(str: string): IStringExtension;

declare function ext(date: Date): IDateExtension;
declare function ext(str: string): IStringExtension;
declare function ext(num: number): INumberExtension;
declare function ext<T>(arr: T[]): IArrayExtension<T>;

export { ext, extArray, extDate, extNumber, extString };
