import { FssgMapPlugin, IFssgMapPluginEvents, IFssgMapPluginOptions } from '@fssgis/fssg-map'
import FssgEsri, { IMap, IView } from '../fssg-esri'

/**
 * 地图应用插件配置项
 */
export interface IFssgEsriPluginOptions extends IFssgMapPluginOptions { // eslint-disable-line

}

/**
 * 地图应用插件事件集
 */
export interface IFssgEsriPluginEvents extends IFssgMapPluginEvents { // eslint-disable-line

}

/**
 * 地图应用插件抽象类
 */
export abstract class FssgEsriPlugin<
  T_OPTIONS extends IFssgEsriPluginOptions = IFssgEsriPluginOptions,
  T_EVENTS extends IFssgEsriPluginEvents = IFssgEsriPluginEvents
> extends FssgMapPlugin<
  T_OPTIONS & IFssgEsriPluginOptions,
  T_EVENTS & IFssgEsriPluginEvents
> {

  //#region 保护属性

  /**
   * 地图对象
   */
   protected map_: IMap

   /**
    * 视图对象
    */
   protected view_: IView

   //#endregion

  /**
   * 绑定的地图应用实例
   */
  public get $ () : FssgEsri {
    return this.map_.$owner
  }

  /**
   * 安装插件
   * @param FssgEsri 地图应用实例
   */
  public installPlugin (fssgEsri: FssgEsri) : this {
    this.map_ = fssgEsri.map
    this.view_ = fssgEsri.view
    return this
  }

}

export default FssgEsriPlugin
