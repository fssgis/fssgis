import { BaseTool, IBaseToolEvents, IBaseToolOptions } from '@fssgis/fssg-map'
import FssgEsri, { IMap, IView } from '../../fssg-esri'

export type IFssgEsriBaseToolOptions = IBaseToolOptions
export type IFssgEsriBaseToolEvents = IBaseToolEvents

/**
 * 基础地图工具类
 */
export class FssgEsriBaseTool<
  T_OPTIONS extends IFssgEsriBaseToolOptions = IFssgEsriBaseToolOptions,
  T_EVENTS extends IFssgEsriBaseToolEvents = IFssgEsriBaseToolEvents,
> extends BaseTool<T_OPTIONS & IFssgEsriBaseToolOptions, T_EVENTS & IFssgEsriBaseToolEvents> { // eslint-disable-line

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

  protected get $ () : FssgEsri {
    return this.map_.$owner
  }

  //#region 构造函数

  /**
   * 实例化地图地图工具类
   * @param map 地图对象
   * @param view 视图对象
   */
  constructor (map: IMap, view: IView, options?: T_OPTIONS, defaultOptions?: T_OPTIONS) {
    super(options, defaultOptions)
    this.map_ = map
    this.view_ = view
  }

  //#endregion

}

export default BaseTool
