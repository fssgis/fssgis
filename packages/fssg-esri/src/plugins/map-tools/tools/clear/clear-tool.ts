import { OnToolActivedParams, OnToolActivedReture } from '@fssgis/fssg-map'
import { IMap, IView } from '../../../../fssg-esri'
import FssgEsriBaseTool from '../../base-tool'
import { Overlays } from '../../../overlays'
import { MapElement } from '../../../map-element'
import { MouseTips } from '../../../mouse-tips'

export class ClearTool extends FssgEsriBaseTool {

  //#region 构造函数

  /**
   * 构造比例放大工具对象
   * @param map 地图对象
   * @param view 视图对象
   */
  constructor (map: IMap, view: IView) {
    super(map, view, { isOnceTool: true })
  }

  //#endregion

  //#region 保护方法

  protected override onToolActived_ (e: OnToolActivedParams<this>) : OnToolActivedReture {
    if (!super.onToolActived_(e)) {
      return false
    }
    const mapElement = this.$.getPlugin(MapElement)
    const overlays = this.$.getPlugin(Overlays)
    const mouseTips = this.$.getPlugin(MouseTips)
    if (mapElement) {
      mapElement.clear(true)
    }
    if (overlays) {
      overlays.clear()
    }
    if (mouseTips) {
      mouseTips.cancelTips()
    }
    return true
  }

  //#endregion

}

export default ClearTool
