interface ICookieExpiredOptions {
    days?: number;
    hours?: number;
    minutes?: number;
}
interface ICookieUtils {
    set<T>(key: string, value: T, options?: ICookieExpiredOptions): ICookieUtils;
    del(key: string): ICookieUtils;
    get(key: string): string | undefined;
    getUseJSON<T>(key: string): T | undefined;
}
/** Cookie工具集 */
declare const cookieUtils: ICookieUtils;

interface IStorageOptions {
    set<T>(key: string, value: T): IStorageOptions;
    get(key: string): string | null;
    getUseJSON<T>(key: string): T | null;
    remove(key: string): IStorageOptions;
    clear(): IStorageOptions;
}
interface IStorageUtils {
    local: IStorageOptions;
    session: IStorageOptions;
}
declare const storageUtils: IStorageUtils;

export { ICookieExpiredOptions, ICookieUtils, IStorageOptions, IStorageUtils, cookieUtils, storageUtils };
