<template>
  <div>
    <div id="leaflet-container" />
    <button @click="set">
      set
    </button>
    <button @click="clear">
      clear
    </button><br>
    ----<br>
    <ul>
      <li
        v-for="(item, index) in data"
        :key="index"
      >
        {{ item.name }}
        <button @click="locate(item)">
          定位
        </button>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive } from 'vue'
import { Basemap, FssgLeaflet, MapElement } from '@fssgis/fssg-leaflet'
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
        bounds: bounds(point(635374.1991923138, 2536658.69889), point(746762.8750076861, 2611299.7513099997)),
      }
    )

    const fssgLeaflet = new FssgLeaflet('leaflet-container', {
      mapOptions: {
        crs,
        zoom: 11,
        center: [23.286122, 112.901157], // 112.901596,23.162156 x 687425.557, y 2575602.824,
        minZoom: 11,
        maxZoom: 18,
      },
      debug: true
    })
      .use(new MapElement())
      .use(new Basemap({
        items: [{
          key: '白色电子地图', type: 'tile',
          url: 'http://172.16.0.101:6080/arcgis/rest/services/DZDT/dzdt_ss/MapServer/tile/{z}/{y}/{x}?blankTile=true'
        }]
      }))

    onMounted(() => {
      fssgLeaflet.mount()
    })

    const data = reactive([
        { name: '测试1', x: 687425.557, y: 2575602.824, iconUrl: 'https://leafletjs.com/docs/images/github-round.png' },
        { name: '测试2', x: 687125.557, y: 2575202.824, iconUrl: 'https://leafletjs.com/docs/images/github-round.png' },
        { type: 'green', name: '测试3', x: 687825.557, y: 2565102.824, iconUrl: 'https://leafletjs.com/docs/images/forum-round.png' },
        { type: 'green', name: '测试4', x: 697825.557, y: 2575102.824, iconUrl: 'https://leafletjs.com/docs/images/forum-round.png' },
    ])

    function set () {
      fssgLeaflet.mapElement.setMarkersByList(data, {
        xField: 'x',
        yField: 'y',
        labelField: 'name',
        iconUrlField: 'iconUrl',
        iconOptions: {
          iconSize: [36, 36],
        },
        labelOptions: {
          className: 'leaflet-label',
        },
        classNameField: 'type',
      })
    }

    function clear () {
      fssgLeaflet.mapElement.clearAll()
    }

    function locate (item: typeof data[0]) {
      fssgLeaflet.locateTo({
        x: item.x,
        y: item.y,
        zoom: fssgLeaflet.map.getZoom() + .5
      })
    }

    return {
      set,
      clear,
      data,
      locate,
    }
  },
})
</script>

<style lang="scss" scoped>
#leaflet-container {
  height: 700px;
  width: 100%;
}
:deep(.leaflet-label) {
  font-size: 16px;
  white-space: nowrap;
  width: 60px !important;
  text-align: center;
  height: fit-content !important;
  font-weight: bold;
  cursor: default;
}
:deep(.green) {
  color: green;
}
</style>
