export interface IArrayExtension<T> {
    insert(index: number, value: T): IArrayExtension<T>;
    removeIndex(index: number): IArrayExtension<T>;
    removeIndex(index: number, returnRemoveValue: true): T;
    clear(): IArrayExtension<T>;
    reset(...item: T[]): IArrayExtension<T>;
    removeValue(value: T, removeMany?: boolean): IArrayExtension<T>;
    unique(): IArrayExtension<T>;
    getUnique(): T[];
    equal<K>(arr: K[]): boolean;
    findItem(propName: keyof T, propValue: T[keyof T]): T | undefined;
    findItems(propName: keyof T, propValue: T[keyof T]): T[];
    propToArr(propName: keyof T): T[keyof T][];
    last(): T;
}
export declare function extArray<T>(arr: T[]): IArrayExtension<T>;
export default extArray;
