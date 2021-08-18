import BaseClass, { IBaseClassEvents, IBaseClassOptions } from '../base-class'
import FssgMap from '../fssg-map/fssg-map'

/**
 * 地图应用插件事件集接口
 */
export interface IFssgMapPluginEvents extends IBaseClassEvents { // eslint-disable-line

}

/**
 * 地图应用插件配置项接口
 */
export interface IFssgMapPluginOptions extends IBaseClassOptions { // eslint-disable-line

}

/**
 * 地图应用插件类（抽象类）
 */
export abstract class FssgMapPlugin<
  T_OPTIONS extends IFssgMapPluginOptions = IFssgMapPluginOptions,
  T_EVENTS extends IFssgMapPluginEvents = IFssgMapPluginEvents,
> extends BaseClass<
  T_OPTIONS & IFssgMapPluginOptions,
  T_EVENTS & IFssgMapPluginEvents
> {

  /**
   * 从地图应用实例中获取地图应用插件实例
   * @param fssgMap 地图应用
   * @returns 地图应用插件
   */
  public static getFrom<T extends FssgMapPlugin> (fssgMap: FssgMap) : T {
    const name = this.name
    return fssgMap[name.replace(name[0], name[0].toLowerCase())]
  }

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
  constructor (options?: T_OPTIONS, defaultOptions?: T_OPTIONS) {
    super(options, defaultOptions)
    const name = this.constructor.name
    this.pluginName_ = name.replace(name[0], name[0].toLowerCase())
  }

  //#endregion

  //#region 公有方法

  /**
   * 安装插件
   * @param fssgMap 地图应用实例
   */
  public abstract installPlugin (fssgMap: FssgMap<any, any>) : this // eslint-disable-line

  //#endregion

}

export default FssgMapPlugin
