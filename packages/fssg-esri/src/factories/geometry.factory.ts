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
}

export function createGeometryFactory (fssgEsri: FssgEsri) : IGeometryFactory {
  const spatialReference = fssgEsri.sr

  const factory : IGeometryFactory = {
    createPoint (options) {
      return new Point({
        spatialReference,
        ...options
      })
    },
    createPolyline (options) {
      return new Polyline({
        spatialReference,
        ...options
      })
    },
    createPolygon (options) {
      return new Polygon({
        spatialReference,
        ...options
      })
    },
    createExtent (options) {
      return new Extent({
        spatialReference,
        ...options
      })
    },
    createPointFromXY (...args: [XY] | [number, number]) {
      if (args.length === 2) {
        const [x, y] = args
        return factory.createPoint({ x, y })
      } else {
        const xy = args[0]
        const x = Array.isArray(xy) ? xy[0] : xy.x
        const y = Array.isArray(xy) ? xy[1] : xy.y
        return factory.createPoint({ x, y })
      }
    },
    createPointFromLonLat (...args: [LonLat] | [number, number]) {
      if (args.length === 2) {
        const [longitude, latitude] = args
        return factory.createPoint({ longitude, latitude })
      } else {
        const lonlat = args[0]
        // eslint-disable-next-line
        // @ts-ignore
        const longitude = Array.isArray(lonlat) ? lonlat[0] : (lonlat.lon ?? lonlat.lng ?? lonlat.longitude)
        // eslint-disable-next-line
        // @ts-ignore
        const latitude = Array.isArray(lonlat) ? lonlat[1] : (lonlat.lat ?? lonlat.latitude)
        return factory.createPoint({ longitude, latitude })
      }
    },
    createPolylineFromPoints (points) {
      const polyline = factory.createPolyline({ paths: [] })
      polyline.addPath(points)
      return polyline
    },
    createPolylineFromXYs (xys) {
      const points = xys.map(xy => factory.createPointFromXY(xy))
      return factory.createPolylineFromPoints(points)
    },
    createPolylineFromLonLats (lonLats) {
      const points = lonLats.map(lonLat => factory.createPointFromLonLat(lonLat))
      return factory.createPolylineFromPoints(points)
    },
    createPolygonFromPoints (points) {
      const polygon = factory.createPolygon({ rings: [] })
      polygon.addRing(points)
      return polygon
    },
    createPointsFromPolyline (polyline, pathIndex = 0) {
      const count = polyline.paths[pathIndex]
      const points = Array(count).map((_, i) => polyline.getPoint(pathIndex, i))
      return points
    },
    createPolygonFromPolyline (polyline) {
      const polygon = factory.createPolygon({ rings: [] })
      polyline.paths.forEach((_, i) => {
        const points = factory.createPointsFromPolyline(polyline, i)
        polygon.addRing(points)
      })
      return polygon
    },
    createPolygonFromXYs (xys) {
      const points = xys.map(xy => factory.createPointFromXY(xy))
      const polygon = factory.createPolygonFromPoints(points)
      return polygon
    },
    createPolygonFromLonLats (lonLats) {
      const points = lonLats.map(lonLat => factory.createPointFromLonLat(lonLat))
      const polygon = factory.createPolygonFromPoints(points)
      return polygon
    },
  }
  return factory
}
