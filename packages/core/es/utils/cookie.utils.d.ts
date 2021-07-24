export interface ICookieExpiredOptions {
    days?: number;
    hours?: number;
    minutes?: number;
}
export interface ICookieUtils {
    set<T>(key: string, value: T, options?: ICookieExpiredOptions): ICookieUtils;
    del(key: string): ICookieUtils;
    get(key: string): string | undefined;
    getUseJSON<T>(key: string): T | undefined;
}
/** Cookie工具集 */
export declare const cookieUtils: ICookieUtils;
export default cookieUtils;
