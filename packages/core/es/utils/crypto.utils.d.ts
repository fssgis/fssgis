export interface ICryptoOptions {
    key?: string;
    iv?: string;
}
export interface ICryptoUtils {
    setGlobelKey(key: string): ICryptoUtils;
    setGlobelIV(iv: string): ICryptoUtils;
    encrypto(str: string, options?: ICryptoOptions): string;
    decrypto(str: string, options?: ICryptoOptions): string;
}
export declare const cryptoUtils: ICryptoUtils;
export default cryptoUtils;
