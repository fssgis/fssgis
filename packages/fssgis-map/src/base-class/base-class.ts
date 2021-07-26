import { $extend, deepCopy } from '@fssgis/utils'
import { Observable } from '@fssgis/observable'

/**
 * 基类事件集接口
 */
export interface IBaseClassEvents {
  'loaded': void
}

/**
 * 基类（抽象类）
 */
export abstract class BaseClass<T_OPTIONS, T_EVENTS extends IBaseClassEvents = IBaseClassEvents> extends Observable<T_EVENTS> {

  //#region 私有属性

  /**
   * 实例初始化完成状态
   */
  private _loaded: boolean

  //#endregion

  //#region 保护属性

  /**
   * 实例配置项
   */
  protected options_ : T_OPTIONS

  //#endregion

  //#region 构造函数

  /**
   * 构造基类
   * @param options 配置项
   * @param defaultOptions 默认配置项
   */
  constructor (options: T_OPTIONS = {} as T_OPTIONS, defaultOptions: T_OPTIONS = {} as T_OPTIONS) {
    super()
    this.options_ = deepCopy(defaultOptions)
    $extend(true, this.options_, options)
    this._loaded = false
    this.once('loaded', () => this._loaded = true)
  }

  //#endregion

  //#region 公有方法

  /**
   * 监听实例初始化完成
   * @param callback 实例初始化完成回调函数
   */
  public when (callback?: () => void) : Promise<void> {
    return new Promise(resolve => {
      if (this._loaded) {
        callback?.()
        resolve()
      } else {
        this.once('loaded', () => {
          callback?.()
          resolve()
        })
      }
    })
  }

  //#endregion

}

export default BaseClass
