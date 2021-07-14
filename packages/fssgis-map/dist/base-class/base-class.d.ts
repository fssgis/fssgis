import Observable from '@fssgis/core/es/observable';
/**
 * 基类事件集接口
 */
export interface IBaseClassEvents {
    'loaded': void;
}
/**
 * 基类（抽象类）
 */
export declare abstract class BaseClass<T_OPTIONS, T_EVENTS extends IBaseClassEvents = IBaseClassEvents> extends Observable<T_EVENTS> {
    /**
     * 实例初始化完成状态
     */
    private _loaded;
    /**
     * 实例配置项
     */
    protected options_: T_OPTIONS;
    /**
     * 构造基类
     * @param options 配置项
     * @param defaultOptions 默认配置项
     */
    constructor(options?: T_OPTIONS, defaultOptions?: T_OPTIONS);
    /**
     * 监听实例初始化完成
     * @param callback 实例初始化完成回调函数
     */
    when(callback?: () => void): Promise<void>;
}
export default BaseClass;
