import BaseClass, { IBaseClassEvents } from '../base-class'
import FssgMapPluginABS, { IFssgMapPluginABSEvents } from '../fssg-map-plugin'

/**
 * 地图应用事件集接口
 */
export type IFssgMapABSEvents = IBaseClassEvents

/**
 * 地图容器
 */
export type Container = string | HTMLDivElement

/**
 * 地图应用配置项接口
 */
export interface IFssgMapABSOptions {
  debug?: boolean,
  debugName?: string,
}

/**
 * 地图应用类（抽象类）
 */
export abstract class FssgMapABS<
  T_OPTIONS extends IFssgMapABSOptions = IFssgMapABSOptions,
  T_EVENTS extends IFssgMapABSEvents = IFssgMapABSEvents,
> extends BaseClass<T_OPTIONS, T_EVENTS> {

  //#region 私有属性

  /**
   * 地图容器
   */
  private _container : Container

  //#endregion

  //#region getter settter

  /**
   * 地图容器
   */
  public get container () : Container {
    return this._container
  }

  //#endregion

  //#region 构造函数

  /**
   * 构造地图应用实例
   * @param container 地图容器
   * @param options 配置项
   * @param defaultOptions 默认配置项
   */
  constructor (container: Container, options?: T_OPTIONS, defaultOptions?: T_OPTIONS) {
    super(options, defaultOptions)
    this._container = container
    this._initDebug()
  }

  //#endregion

  /**
   * 初始化调试
   * @returns this
   */
  private _initDebug () : this {
    const { debug, debugName } = this.options_
    if (debug && debugName) {
      debug && (window[debugName] = this)
    }
    return this
  }

  /**
   * 安装地图应用插件
   * @param plugin 地图应用插件
   * @returns this
   */
  public use <T, K extends IFssgMapPluginABSEvents> (plugin: FssgMapPluginABS<T, K>) : this {
    this.when().then(() => {
      this[plugin.pluginName] = plugin.installPlugin(this as any) // eslint-disable-line
      plugin.fire('loaded')
    })
    return this
  }

  /**
   * 安装
   */
  public abstract mount () : this

}

export default FssgMapABS
