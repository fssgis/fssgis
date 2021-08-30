import { OnToolActivedParams, OnToolActivedReture } from '@fssgis/fssg-map'
import { warn } from '@fssgis/fssg-map'
import { IMap, IView } from '../../../../fssg-esri'
import FssgEsriBaseTool, { IFssgEsriBaseToolEvents, IFssgEsriBaseToolOptions } from '../../base-tool'

/**
 * 缩放至起始位置工具配置项
 */
export interface IZoomHomeToolOptions extends IFssgEsriBaseToolOptions { // eslint-disable-line

}

/**
 * 缩放至起始位置工具事件集
 */
export interface IZoomHomeToolEvents extends IFssgEsriBaseToolEvents { // eslint-disable-line

}

/**
 * 缩放至起始位置工具
 */
export class ZoomHomeTool<
  T_OPTIONS extends IZoomHomeToolOptions = IZoomHomeToolOptions,
  T_EVENTS extends IZoomHomeToolEvents = IZoomHomeToolEvents,
> extends FssgEsriBaseTool<T_OPTIONS & IZoomHomeToolOptions, T_EVENTS & IZoomHomeToolEvents> {

  /**
   * 起始位置
   */
  public home : __esri.Geometry |
    { center: __esri.Point, zoom: number }

    /**
     * 构造缩放至起始位置工具
     * @param map 地图
     * @param view 视图
     * @param options 配置项
     * @param defaultOptions 默认配置项
     */
  constructor (map: IMap, view: IView, options?: T_OPTIONS, defaultOptions?: T_OPTIONS) {
    super(map, view, options, defaultOptions)

    view.when().then(() => this.home = view.extent)
  }

  /**
   * 工具激活时触发
   */
  protected override onToolActived_ (e: OnToolActivedParams<this>) : OnToolActivedReture {
    if (!super.onToolActived_(e)) {
      return false
    }
    if (!this.home) {
      warn(this, '无定位范围')
      return true
    }
    this.$.goto(this.home)
    return true
  }

}

export default ZoomHomeTool
