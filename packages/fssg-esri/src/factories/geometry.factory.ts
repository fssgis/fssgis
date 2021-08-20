import FssgEsri from '../fssg-esri'
import Point from '@arcgis/core/geometry/Point'
import Polyline from '@arcgis/core/geometry/Polyline'
import Polygon from '@arcgis/core/geometry/Polygon'
import Extent from '@arcgis/core/geometry/Extent'

/**
 * 坐标XY
 */
export type XY = { x: number, y: number } | [number, number] | number[]

/**
 * 经纬度
 */
export type LonLat = [number, number] | number[] | {
  lon: number, lat: number
} | {
  lng: number, lat: number
} | {
  longitude: number, latitude: number
}

/**
 * 几何工厂接口
 * TODO: createPointsFromPolygon createPolylineFromPolygon createPolylinesFromPolygon
 */
export interface IGeometryFactory {
  createPoint (options: __esri.PointProperties) : __esri.Point
  createPointFromXY (x: number, y: number) : __esri.Point
  createPointFromXY (xy: XY) : __esri.Point
  createPointFromLonLat (lon: number, lat: number) : __esri.Point
  createPointFromLonLat (lonlat: LonLat) : __esri.Point
  createPointsFromPolyline (polyline: __esri.Polyline, pathIndex?: number) : __esri.Point[]

  createPolyline (options: __esri.PolylineProperties) : __esri.Polyline
  createPolylineFromPoints (points: __esri.Point[]) : __esri.Polyline
  createPolylineFromXYs (XYs: XY[]) : __esri.Polyline
  createPolylineFromLonLats (lonLats: LonLat[]) : __esri.Polyline

  createPolygon (options: __esri.PolygonProperties) : __esri.Polygon
  createPolygonFromPoints (points: __esri.Point[]) : __esri.Polygon
  createPolygonFromPolyline (polyline: __esri.Polyline) : __esri.Polygon
  createPolygonFromXYs (xys: XY[]) : __esri.Polygon
  createPolygonFromLonLats (lonLats: LonLat[]) : __esri.Polygon

  createExtent (options: __esri.ExtentProperties) : __esri.Extent
}

/**
 * 几何工厂类（条件单例模式）
 * @private
 */
export class GeometryFacory implements IGeometryFactory {

  /**
   * 实例容器
   */
  private static _instanceMap = new Map<FssgEsri, GeometryFacory>()

  /**
   * 地图应用
   */
  private _fssgEsri: FssgEsri

  /**
   * 实例容器绑定的地图应用空间坐标系
   */
  private get _spatialReference () {
    return this._fssgEsri.sr
  }

  /**
   * 构造几何工厂实例
   * @param fssgEsri 地图应用
   */
  constructor (fssgEsri: FssgEsri) {
    const instance = GeometryFacory._instanceMap.get(fssgEsri)
    if (instance) {
      return instance
    }
    this._fssgEsri = fssgEsri
    GeometryFacory._instanceMap.set(fssgEsri, this)
    return this
  }

  /**
   * 创建Esri点
   * @param options 配置项
   * @link https://developers.arcgis.com/javascript/latest/api-reference/esri-geometry-Point.html
   * @example
   * ```ts
   * createGeometryFactory().createPoint({ \/* xxx *\/ })
   * ```
   */
  public createPoint (options: __esri.PointProperties) : __esri.Point {
    return new Point({
      spatialReference: this._spatialReference,
      ...options
    })
  }

  /**
   * 创建Esri线
   * @param options 配置项
   * @link https://developers.arcgis.com/javascript/latest/api-reference/esri-geometry-Polyline.html
   * @example
   * ```ts
   * createGeometryFactory().createPolyline({ \/* xxx *\/ })
   * ```
   */
  public createPolyline (options: __esri.PolylineProperties) : __esri.Polyline {
    return new Polyline({
      spatialReference: this._spatialReference,
      ...options
    })
  }

  /**
   * 创建Esri面
   * @param options 配置项
   * @link https://developers.arcgis.com/javascript/latest/api-reference/esri-geometry-Polygon.html
   * @example
   * ```ts
   * createGeometryFactory().createPolygon({ \/* xxx *\/ })
   * ```
   */
  public createPolygon (options: __esri.PolygonProperties) : __esri.Polygon {
    return new Polygon({
      spatialReference: this._spatialReference,
      ...options
    })
  }

  /**
   * 创建Esri范围
   * @param options 配置项
   * @link https://developers.arcgis.com/javascript/latest/api-reference/esri-geometry-Extent.html
   * @example
   * ```ts
   * createGeometryFactory().createExtent({ \/* xxx *\/ })
   * ```
   */
  public createExtent (options: __esri.ExtentProperties) : __esri.Extent {
    return new Extent({
      spatialReference: this._spatialReference,
      ...options
    })
  }

  /**
   * 根据XY坐标创建Esri点
   * @param args XY坐标
   * @link https://developers.arcgis.com/javascript/latest/api-reference/esri-geometry-Point.html
   * @example
   * ```ts
   * createGeometryFactory().createPointFromXY({ x: 0, y: 0 })
   * createGeometryFactory().createPointFromXY(0, 0)
   * ```
   */
  public createPointFromXY (...args: [XY] | [number, number]) : __esri.Point {
    if (args.length === 2) {
      const [x, y] = args
      return this.createPoint({ x, y })
    } else {
      const xy = args[0]
      const x = Array.isArray(xy) ? xy[0] : xy.x
      const y = Array.isArray(xy) ? xy[1] : xy.y
      return this.createPoint({ x, y })
    }
  }

  /**
   * 根据经纬度创建Esri点
   * @param args 经纬度
   * @link https://developers.arcgis.com/javascript/latest/api-reference/esri-geometry-Point.html
   * @example
   * ```ts
   * createGeometryFactory().createPointFromLonLat({ lon: 113, lat: 23 })
   * createGeometryFactory().createPointFromLonLat({ lng: 113, lat: 23 })
   * createGeometryFactory().createPointFromLonLat({ longitude: 113, latitude: 23 })
   * createGeometryFactory().createPointFromLonLat(113, 23)
   * ```
   */
  public createPointFromLonLat (...args: [LonLat] | [number, number]) : __esri.Point {
    if (args.length === 2) {
      const [longitude, latitude] = args
      return this.createPoint({ longitude, latitude })
    } else {
      const lonlat = args[0]
      // eslint-disable-next-line
      // @ts-ignore
      const longitude = Array.isArray(lonlat) ? lonlat[0] : (lonlat.lon ?? lonlat.lng ?? lonlat.longitude)
      // eslint-disable-next-line
      // @ts-ignore
      const latitude = Array.isArray(lonlat) ? lonlat[1] : (lonlat.lat ?? lonlat.latitude)
      return this.createPoint({ longitude, latitude })
    }
  }

  /**
   * 根据Esri点集创建Esri线
   * @param points Esri点集
   * @link https://developers.arcgis.com/javascript/latest/api-reference/esri-geometry-Polyline.html
   */
  public createPolylineFromPoints (points: __esri.Point[]) : __esri.Polyline {
    const polyline = this.createPolyline({ paths: [] })
    polyline.addPath(points)
    return polyline
  }

  /**
   * 根据XY坐标集创建Esri线
   * @param xys XY坐标集
   * @link https://developers.arcgis.com/javascript/latest/api-reference/esri-geometry-Polyline.html
   */
  public createPolylineFromXYs (xys: XY[]) : __esri.Polyline {
    const points = xys.map(xy => this.createPointFromXY(xy))
    return this.createPolylineFromPoints(points)
  }

  /**
   * 根据经纬度集创建Esri线
   * @param lonLats 经纬度集
   * @link https://developers.arcgis.com/javascript/latest/api-reference/esri-geometry-Polyline.html
   */
  public createPolylineFromLonLats (lonLats: LonLat[]) : __esri.Polyline {
    const points = lonLats.map(lonLat => this.createPointFromLonLat(lonLat))
    return this.createPolylineFromPoints(points)
  }

  /**
   * 根据Esri点集创建Esri面
   * @param points Esri点集
   * @link https://developers.arcgis.com/javascript/latest/api-reference/esri-geometry-Polygon.html
   */
  public createPolygonFromPoints (points: __esri.Point[]) : __esri.Polygon {
    const polygon = this.createPolygon({ rings: [] })
    polygon.addRing(points)
    return polygon
  }

  /**
   * 根据Esri线创建Esri点集
   * @param polyline Esri线
   * @param pathIndex 线的路径索引，默认值为0
   * @link https://developers.arcgis.com/javascript/latest/api-reference/esri-geometry-Point.html
   */
  public createPointsFromPolyline (polyline: __esri.Polyline, pathIndex = 0) : __esri.Point[] {
    const count = polyline.paths[pathIndex]
    const points = Array(count).map((_, i) => polyline.getPoint(pathIndex, i))
    return points
  }

  /**
   * 根据Esri线创建Esri面
   * @param polyline Esri线
   * @link https://developers.arcgis.com/javascript/latest/api-reference/esri-geometry-Polygon.html
   */
  public createPolygonFromPolyline (polyline: __esri.Polyline) : __esri.Polygon {
    const polygon = this.createPolygon({ rings: [] })
    polyline.paths.forEach((_, i) => {
      const points = this.createPointsFromPolyline(polyline, i)
      polygon.addRing(points)
    })
    return polygon
  }

  /**
   * 根据XY坐标集创建Esri面
   * @param xys Esri线
   * @link https://developers.arcgis.com/javascript/latest/api-reference/esri-geometry-Polygon.html
   */
  public createPolygonFromXYs (xys: XY[]) : __esri.Polygon {
    const points = xys.map(xy => this.createPointFromXY(xy))
    const polygon = this.createPolygonFromPoints(points)
    return polygon
  }

  /**
   * 根据经纬度集创建Esri面
   * @param lonLats 经纬度集
   * @link https://developers.arcgis.com/javascript/latest/api-reference/esri-geometry-Polygon.html
   */
  public createPolygonFromLonLats (lonLats: LonLat[]) : __esri.Polygon {
    const points = lonLats.map(lonLat => this.createPointFromLonLat(lonLat))
    const polygon = this.createPolygonFromPoints(points)
    return polygon
  }

}

/**
 * 创建几何工厂
 * @param fssgEsri 地图应用
 */
export function createGeometryFactory (fssgEsri: FssgEsri) : GeometryFacory {
  return new GeometryFacory(fssgEsri)
}
