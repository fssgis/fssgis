import { AxiosInstance, AxiosRequestConfig } from 'axios';
export interface IAxiosController {
    setUrl(url: string): IAxiosController;
    setBody(key: string, value: string): IAxiosController;
    setBody(body: Object): IAxiosController;
    setParams(key: string, value: string): IAxiosController;
    setParams(body: Object): IAxiosController;
    setHeaders(key: string, value: string): IAxiosController;
    setHeaders(body: Object): IAxiosController;
    setConfig(config: AxiosRequestConfig): IAxiosController;
    mountGet<T>(axiosInit?: AxiosInstance): Promise<T>;
    mountPost<T>(axiosInit?: AxiosInstance): Promise<T>;
}
declare function createAxios(): IAxiosController;
export declare function setGlobelAxiosInstance(axiosInstance: AxiosInstance): void;
export default createAxios;
