export interface IDateExtension {
    format(fmt: string): string;
    getNextDate(nDays: number): Date;
    getNextDate(nDays: string): Date;
    getMonth(): number;
}
export declare function extDate(date: Date): IDateExtension;
export default extDate;
