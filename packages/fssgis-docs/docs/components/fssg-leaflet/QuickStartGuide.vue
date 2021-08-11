<template>
  <div id="leaflet-container" />
</template>

<script lang="ts">
import { defineComponent, onMounted } from 'vue'
import { FssgLeaflet } from '@fssgis/fssg-leaflet'
import 'leaflet/dist/leaflet.css'
import leaflet, { bounds, point } from 'leaflet'
import 'proj4leaflet'

export default defineComponent({
  setup () {

    const crs = new leaflet.Proj.CRS('EPSG:9999',
      `+proj=tmerc +lat_0=0 +lon_0=113 +k=1 +x_0=700000 +y_0=0 +ellps=GRS80 +units=m +no_defs`, {
        resolutions: [
          156543.34701231902,
          78271.67350615951,
          39135.83675440268,
          19567.91837587842,
          9783.95918793921,
          4891.979595292524,
          2445.989797646262,
          1222.994898823131,
          611.4974494115655,
          305.74872470578276,
          152.87436235289138,
          76.43717985352637,
          38.2185912496825,
          19.10929430192194,
          9.55464715096097,
          4.777323575480485,
          2.3886631106595546,
          1.1943315553297773,
          0.5971657776648887,
          0.2985828888324443,
          0.14929144441622216,
        ],
        origin: [-4923200.0, 1.00021E7],
        bounds: bounds(point(685374.1991923138, 2536658.69889), point(705540.4047339347, 2608331.5927683935)),
      }
    )

    const fssgLeaflet = new FssgLeaflet('leaflet-container', {
      mapOptions: {
        crs,
        zoom: 11,
        center: [23.162156, 112.901596], // 112.901596,23.162156 x 687425.557, y 2575602.824,
        minZoom: 11,
        maxZoom: 18,
      },
      debug: true
    })

    const layer = leaflet.tileLayer('http://172.16.0.101:6080/arcgis/rest/services/DZDT/dzdt_ss/MapServer/tile/{z}/{y}/{x}?blankTile=true')

    onMounted(() => {
      fssgLeaflet.mount()
      fssgLeaflet.map.addLayer(layer)
    })

    return {

    }
  },
})
</script>

<style lang="scss" scoped>
#leaflet-container {
  height: 700px;
  width: 100%;
}
</style>
