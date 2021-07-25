/** 监听处理函数接口 */
interface IHandle {
    /** 移除监听处理函数 */
    remove(): void;
}
/** 监听回调函数参数接口 */
interface ICallbackParams<NAME, THIS> {
    /** 监听类型名 */
    name: NAME;
    /** 监听源对象 */
    origin: THIS;
}
/** 监听回调函数接口 */
interface ICallbackFunc<T, NAME, THIS, RET = void> {
    (e: T & ICallbackParams<NAME, THIS>): RET;
}

/**
 * 事件者类，用以观测监听对象实例产生的事件
 */
declare class Observable<T> {
    /** 监听处理函数存储池 */
    private _eventPool;
    /**
     * 绑定监听函数
     * @param name 监听类型名
     * @param callback 监听回调函数
     */
    on<K extends keyof T>(name: K, callback: ICallbackFunc<T[K], K, this>): IHandle;
    /**
     * 移除监听函数
     * @param name 监听类型名
     * @param callback 监听回调函数（不指定者移除所有）
     */
    off<K extends keyof T>(name: K, callback?: ICallbackFunc<T[K], K, this>): void;
    /**
     * 触发监听函数
     * @param name 监听函数名
     * @param data 数据
     */
    fire<K extends keyof T>(name: K, data?: T[K]): this;
    /**
     * 绑定监听函数（仅监听一次）
     * @param name 监听类型名
     * @param callback 监听回调函数
     */
    once<K extends keyof T>(name: K, callback: ICallbackFunc<T[K], K, this>): void;
}

export { ICallbackFunc, ICallbackParams, IHandle, Observable };
