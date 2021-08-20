<template>
  <div>
    <button @click="clearAll">
      清理所有图元
    </button>
    <button @click="clear">
      清理非高亮的图元
    </button>
    <button @click="clearHighlight">
      清理高亮图元
    </button><br>
    <button @click="addPoints(), addHighlightPoints()">
      添加点图元
    </button>
    <button @click="addPoints()">
      添加非高亮点图元
    </button>
    <button @click="addHighlightPoints()">
      添加高亮点图元
    </button><br>
    <button @click="setPoints()">
      设置非高亮点图元
    </button>
    <button @click="setHighlightPoints()">
      设置高亮点图元
    </button><br>
    <button @click="addPolyline()">
      添加线
    </button>
    <button @click="addPolygon()">
      添加面
    </button>
  </div>
</template>

<script lang="ts">
import { useFssgEsri, useGeoFactory } from '@fssgis/fssg-esri-hooks'
import { MapElement } from '@fssgis/fssg-esri'
import { defineComponent } from 'vue'
import Point from '@arcgis/core/geometry/Point'
import { createIntRandom } from '@fssgis/utils'

export default defineComponent({
  setup () {

    const fssgMap = useFssgEsri()
    const geoFactory = useGeoFactory()

    const mapElement = new MapElement()
    fssgMap.use(mapElement)

    mapElement.when().then(() => {
      clearAll()
      addPoints()
      addHighlightPoints()
      addPolyline()
      addPolygon()
    })

    function createLongitude () : number {
      return createIntRandom(80, 130)
    }

    function createLatitude () : number {
      return createIntRandom(8, 50)
    }

    function addPoints () {
      mapElement.add(
        geoFactory.createPoint({ longitude: createLongitude(), latitude: createLatitude() }),
        { color: '#ffff00' }
      )
      mapElement.add(
        geoFactory.createPointFromLonLat({ longitude: createLongitude(), latitude: createLatitude() }),
      )
      mapElement.add(
        geoFactory.createPointFromLonLat({ lon: createLongitude(), lat: createLatitude() }),
        { type: 'picture-marker', url: 'https://leafletjs.com/docs/images/github-round.png', width: 24, height: 24 } as __esri.PictureMarkerSymbol
      )
    }

    function setPoints () {
      mapElement.set(
        [
          geoFactory.createPointFromLonLat({ lng: createLongitude(), lat: createLatitude() }),
          geoFactory.createPointFromLonLat(createLongitude(), createLatitude()),
          geoFactory.createPointFromLonLat(createLongitude(), createLatitude()),
        ],
        { type: 'picture-marker', url: 'https://leafletjs.com/docs/images/github-round.png', width: 24, height: 24 } as __esri.PictureMarkerSymbol
      )
    }

    function addHighlightPoints () {
      mapElement.addHighlight(
        new Point({ longitude: createLongitude(), latitude: createLatitude() }),
        { size: 24 } as __esri.SimpleMarkerSymbolProperties
      )
      mapElement.addHighlight(
        new Point({ longitude: createLongitude(), latitude: createLatitude() }),
      )
    }

    function setHighlightPoints () {
      mapElement.setHighlight(
        [
          new Point({ longitude: createLongitude(), latitude: createLatitude() }),
          new Point({ longitude: createLongitude(), latitude: createLatitude() }),
        ],
        { size: 24 } as __esri.SimpleMarkerSymbolProperties
      )
    }

    function clear () {
      mapElement.clear()
    }

    function clearAll () {
      mapElement.clear(true)
    }

    function clearHighlight () {
      mapElement.clearHighlight()
    }

    function addPolyline () {
      mapElement.add(geoFactory.createPolylineFromPoints([
        geoFactory.createPointFromLonLat({ lng: createLongitude(), lat: createLatitude() }),
        geoFactory.createPointFromLonLat(createLongitude(), createLatitude()),
        geoFactory.createPointFromLonLat(createLongitude(), createLatitude()),
      ]))
    }

    function addPolygon () {
      mapElement.add(geoFactory.createPolygonFromPoints([
        geoFactory.createPointFromLonLat({ lng: createLongitude(), lat: createLatitude() }),
        geoFactory.createPointFromLonLat(createLongitude(), createLatitude()),
        geoFactory.createPointFromLonLat(createLongitude(), createLatitude()),
      ]))
    }

    return {
      addPoints,
      addHighlightPoints,
      clear,
      clearAll,
      clearHighlight,
      setHighlightPoints,
      setPoints,
      addPolyline,
      addPolygon,
    }
  },
})
</script>

<style lang="scss" scoped>

</style>
