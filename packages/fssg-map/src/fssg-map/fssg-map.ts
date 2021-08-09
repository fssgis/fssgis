import BaseClass, { IBaseClassEvents } from '../base-class'
import FssgMapPlugin, { IFssgMapPluginEvents } from '../fssg-map-plugin'

/**
 * 地图应用事件集接口
 */
export interface IFssgMapEvents extends IBaseClassEvents { // eslint-disable-line

}

/**
 * 地图容器接口
 */
export type IFssgMapContainer = string | HTMLDivElement

/**
 * 地图应用配置项接口
 */
export interface IFssgMapOptions {
  debug?: boolean,
  debugName?: string,
}

/**
 * 地图应用类（抽象类）
 */
export abstract class FssgMap<
  T_OPTIONS extends IFssgMapOptions = IFssgMapOptions,
  T_EVENTS extends IFssgMapEvents = IFssgMapEvents,
> extends BaseClass<T_OPTIONS, T_EVENTS> {

  //#region 私有属性

  /**
   * 地图容器
   */
  private _container : IFssgMapContainer

  //#endregion

  //#region getter settter

  /**
   * 地图容器
   */
  public get container () : IFssgMapContainer {
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
  constructor (container: IFssgMapContainer, options?: T_OPTIONS, defaultOptions?: T_OPTIONS) {
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
  public use <T, K extends IFssgMapPluginEvents> (plugin: FssgMapPlugin<T, K>) : this {
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

export default FssgMap