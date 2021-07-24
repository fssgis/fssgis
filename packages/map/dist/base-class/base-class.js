import Observable from '@fssgis/core/es/observable';
import { $extend, deepCopy } from '@fssgis/core/es/utils/base.utils';
/**
 * 基类（抽象类）
 */
export class BaseClass extends Observable {
    //#region 私有属性
    /**
     * 实例初始化完成状态
     */
    _loaded;
    //#endregion
    //#region 保护属性
    /**
     * 实例配置项
     */
    options_;
    //#endregion
    //#region 构造函数
    /**
     * 构造基类
     * @param options 配置项
     * @param defaultOptions 默认配置项
     */
    constructor(options = {}, defaultOptions = {}) {
        super();
        this.options_ = deepCopy(defaultOptions);
        $extend(true, this.options_, options);
        this._loaded = false;
        this.once('loaded', () => this._loaded = true);
    }
    //#endregion
    //#region 公有方法
    /**
     * 监听实例初始化完成
     * @param callback 实例初始化完成回调函数
     */
    when(callback) {
        return new Promise(resolve => {
            if (this._loaded) {
                callback?.();
                resolve();
            }
            else {
                this.once('loaded', () => resolve());
            }
        });
    }
}
export default BaseClass;
