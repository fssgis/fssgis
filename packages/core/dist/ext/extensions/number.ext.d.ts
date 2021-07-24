export interface INumberExtension {
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
export declare function extNumber(num: number): INumberExtension;
export default extNumber;
