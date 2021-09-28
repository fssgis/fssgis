import { FssgMapPlugin, IFssgMapPluginEvents, IFssgMapPluginOptions } from '@fssgis/fssg-map'
import FssgLeaflet, { IMap } from '../fssg-leaflet/fssg-leaflet'

/**
 * 地图应用插件配置项
 */
export interface IFssgLeafletPluginOptions extends IFssgMapPluginOptions { // eslint-disable-line

}

/**
 * 地图应用插件事件集
 */
export interface IFssgLeafletPluginEvents extends IFssgMapPluginEvents { // eslint-disable-line

}

export class FssgLeafletPlugin<
  T_OPTIONS extends IFssgLeafletPluginOptions = IFssgLeafletPluginOptions,
  T_EVENTS extends IFssgLeafletPluginEvents = IFssgLeafletPluginEvents
> extends FssgMapPlugin<
  T_OPTIONS & IFssgLeafletPluginOptions,
  T_EVENTS & IFssgLeafletPluginEvents
> {

  /**
   * leaflet地图实例
   */
  protected map_: IMap

  /**
   * 绑定的地图应用实例
   */
  public get $ () : FssgLeaflet {
    return this.map_.$owner
  }

  /**
   * 安装插件
   * @param fssgLeaflet 地图应用实例
   * @returns this
   */
  public installPlugin (fssgLeaflet: FssgLeaflet) : this | Promise<this> {
    this.map_ = fssgLeaflet.map
    return this
  }

}

export default FssgLeafletPlugin
