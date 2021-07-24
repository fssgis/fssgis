/** 监听处理函数接口 */
export interface IHandle {
    /** 移除监听处理函数 */
    remove(): void;
}
/** 监听回调函数参数接口 */
export interface ICallbackParams<NAME, THIS> {
    /** 监听类型名 */
    name: NAME;
    /** 监听源对象 */
    origin: THIS;
}
/** 监听回调函数接口 */
export interface ICallbackFunc<T, NAME, THIS, RET = void> {
    (e: T & ICallbackParams<NAME, THIS>): RET;
}
