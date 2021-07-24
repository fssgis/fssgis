export interface IStringExtension {
    trimAll(): string;
    toDate(): Date;
    toDateFormat(fmt: string): string;
}
export declare function extString(str: string): IStringExtension;
export default extString;
