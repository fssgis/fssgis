import FssgEsri from '../fssg-esri'
import Point from '@arcgis/core/geometry/Point'
import Polyline from '@arcgis/core/geometry/Polyline'
import Polygon from '@arcgis/core/geometry/Polygon'
import Extent from '@arcgis/core/geometry/Extent'

export type XY = { x: number, y: number } | [number, number] | number[]
export type LonLat = [number, number] | number[] | {
  lon: number, lat: number
} | {
  lng: number, lat: number
} | {
  longitude: number, latitude: number
}

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

  // TODO: createPointsFromPolygon
  // TODO: createPolylineFromPolygon
  // TODO: createPolylinesFromPolygon
}

class GeometryFacory implements IGeometryFactory {
  private static _instanceMap = new Map<FssgEsri, GeometryFacory>()

  private _fssgEsri: FssgEsri

  private get _spatialReference () {
    return this._fssgEsri.sr
  }

  constructor (fssgEsri: FssgEsri) {
    const instance = GeometryFacory._instanceMap.get(fssgEsri)
    if (instance) {
      return instance
    }
    this._fssgEsri = fssgEsri
    GeometryFacory._instanceMap.set(fssgEsri, this)
    return this
  }

  public createPoint (options: __esri.PointProperties) : __esri.Point {
    return new Point({
      spatialReference: this._spatialReference,
      ...options
    })
  }

  public createPolyline (options: __esri.PolylineProperties) : __esri.Polyline {
    return new Polyline({
      spatialReference: this._spatialReference,
      ...options
    })
  }

  public createPolygon (options: __esri.PolygonProperties) : __esri.Polygon {
    return new Polygon({
      spatialReference: this._spatialReference,
      ...options
    })
  }

  public createExtent (options: __esri.ExtentProperties) : __esri.Extent {
    return new Extent({
      spatialReference: this._spatialReference,
      ...options
    })
  }

  public createPointFromXY (...args: [XY] | [number, number]) {
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

  public createPointFromLonLat (...args: [LonLat] | [number, number]) {
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

  public createPolylineFromPoints (points: __esri.Point[]) : __esri.Polyline {
    const polyline = this.createPolyline({ paths: [] })
    polyline.addPath(points)
    return polyline
  }

  public createPolylineFromXYs (xys: XY[]) : __esri.Polyline {
    const points = xys.map(xy => this.createPointFromXY(xy))
    return this.createPolylineFromPoints(points)
  }

  public createPolylineFromLonLats (lonLats: LonLat[]) : __esri.Polyline {
    const points = lonLats.map(lonLat => this.createPointFromLonLat(lonLat))
    return this.createPolylineFromPoints(points)
  }

  public createPolygonFromPoints (points: __esri.Point[]) : __esri.Polygon {
    const polygon = this.createPolygon({ rings: [] })
    polygon.addRing(points)
    return polygon
  }

  public createPointsFromPolyline (polyline: __esri.Polyline, pathIndex = 0) : __esri.Point[] {
    const count = polyline.paths[pathIndex]
    const points = Array(count).map((_, i) => polyline.getPoint(pathIndex, i))
    return points
  }

  public createPolygonFromPolyline (polyline: __esri.Polyline) : __esri.Polygon {
    const polygon = this.createPolygon({ rings: [] })
    polyline.paths.forEach((_, i) => {
      const points = this.createPointsFromPolyline(polyline, i)
      polygon.addRing(points)
    })
    return polygon
  }

  public createPolygonFromXYs (xys: XY[]) : __esri.Polygon {
    const points = xys.map(xy => this.createPointFromXY(xy))
    const polygon = this.createPolygonFromPoints(points)
    return polygon
  }

  public createPolygonFromLonLats (lonLats: LonLat[]) : __esri.Polygon {
    const points = lonLats.map(lonLat => this.createPointFromLonLat(lonLat))
    const polygon = this.createPolygonFromPoints(points)
    return polygon
  }

}

export function createGeometryFactory (fssgEsri: FssgEsri) : IGeometryFactory {
  return new GeometryFacory(fssgEsri)
}
