import BaseClass, { IBaseClassEvents } from '../base-class'
import FssgMapABS from '../fssg-map/fssg-map'

/**
 * 地图应用插件事件集接口
 */
export type IFssgMapPluginABSEvents = IBaseClassEvents

/**
 * 地图应用插件类（抽象类）
 */
export abstract class FssgMapPluginABS<
  T_OPTIONS,
  T_EVENTS extends IFssgMapPluginABSEvents = IFssgMapPluginABSEvents,
> extends BaseClass<T_OPTIONS, T_EVENTS> {

  //#region 保护属性

  /**
   * 插件名
   */
  protected pluginName_: string

  //#endregion

  //#region getter setter

  /**
   * 插件名
   */
  public get pluginName () : string {
    return this.pluginName_
  }

  //#endregion

  //#region 构造函数

  /**
   *构造地图应用插件实例
   * @param pluginName 插件名
   * @param options 配置项
   * @param defaultOptions 默认配置项
   */
  constructor (pluginName: string, options?: T_OPTIONS, defaultOptions?: T_OPTIONS) {
    super(options, defaultOptions)
    this.pluginName_ = pluginName
  }

  //#endregion

  //#region 公有方法

  /**
   * 安装插件
   * @param fssgMap 地图应用实例
   */
  public abstract installPlugin (fssgMap: FssgMapABS<any, any>) : this // eslint-disable-line

  //#endregion

}

export default FssgMapPluginABS
