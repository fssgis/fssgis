<template>
  <div
    :id="id"
    style="height: 500px;"
  />
  <slot v-if="loaded" />
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { createBasemap, createFssgEsri, useFssgEsriLoaded, createMapCursor, createMapLayers } from '@fssgis/fssg-esri-hooks'
import { createGuid } from '@fssgis/utils'
import { addProxyRule } from '@arcgis/core/core/urlUtils'

export default defineComponent({
  setup () {
    const id = createGuid()

    addProxyRule({
      urlPrefix: 'http://172.16.0.101:6080',
      proxyUrl: 'http://172.16.0.101/DotNet/proxy.ashx',
    })
    const fssgEsri = createFssgEsri(id, {
      viewOptions: {
        zoom: 11,
        spatialReference: {
          wkt: 'PROJCS["CGCS2000_3_Degree_GK_CM_113E",GEOGCS["GCS_China_Geodetic_Coordinate_System_2000",DATUM["D_China_2000",SPHEROID["CGCS2000",6378137.0,298.257222101]],PRIMEM["Greenwich",0.0],UNIT["Degree",0.0174532925199433]],PROJECTION["Gauss_Kruger"],PARAMETER["False_Easting",700000.0],PARAMETER["False_Northing",0.0],PARAMETER["Central_Meridian",113.0],PARAMETER["Scale_Factor",1.0],PARAMETER["Latitude_Of_Origin",0.0],UNIT["Meter",1.0]]'
        },
        'constraints': {
          'minZoom': 11,
          'rotationEnabled': false,
          'lods': [
            {
              'level': 0,
              'resolution': 156543.34701231902,
              'scale': 5.916587109e8
            },
            {
              'level': 1,
              'resolution': 78271.67350615951,
              'scale': 2.9582935545e8
            },
            {
              'level': 2,
              'resolution': 39135.83675440268,
              'scale': 1.4791467773e8
            },
            {
              'level': 3,
              'resolution': 19567.91837587842,
              'scale': 7.395733886e7
            },
            {
              'level': 4,
              'resolution': 9783.95918793921,
              'scale': 3.697866943e7
            },
            {
              'level': 5,
              'resolution': 4891.979595292524,
              'scale': 1.848933472e7
            },
            {
              'level': 6,
              'resolution': 2445.989797646262,
              'scale': 9244667.36
            },
            {
              'level': 7,
              'resolution': 1222.994898823131,
              'scale': 4622333.68
            },
            {
              'level': 8,
              'resolution': 611.4974494115655,
              'scale': 2311166.84
            },
            {
              'level': 9,
              'resolution': 305.74872470578276,
              'scale': 1155583.42
            },
            {
              'level': 10,
              'resolution': 152.87436235289138,
              'scale': 577791.71
            },
            {
              'level': 11,
              'resolution': 76.43717985352637,
              'scale': 288895.85
            },
            {
              'level': 12,
              'resolution': 38.2185912496825,
              'scale': 144447.93
            },
            {
              'level': 13,
              'resolution': 19.10929430192194,
              'scale': 72223.96
            },
            {
              'level': 14,
              'resolution': 9.55464715096097,
              'scale': 36111.98
            },
            {
              'level': 15,
              'resolution': 4.777323575480485,
              'scale': 18055.99
            },
            {
              'level': 16,
              'resolution': 2.3886631106595546,
              'scale': 9028
            },
            {
              'level': 17,
              'resolution': 1.1943315553297773,
              'scale': 4514
            },
            {
              'level': 18,
              'resolution': 0.5971657776648887,
              'scale': 2257
            },
            {
              'level': 19,
              'resolution': 0.2985828888324443,
              'scale': 1128.5
            },
            {
              'level': 20,
              'resolution': 0.14929144441622216,
              'scale': 564.25
            }
          ] as any // eslint-disable-line
        }
      },
      debug: true,
    })

    createBasemap({
      items: [
        {
          key: '黑色电子地图',
          type: 'tilelayer',
          url: 'http://172.16.0.101:6080/arcgis/rest/services/DZDT/dzdt_black_ss/MapServer',
          props: {
            customParameters: {
              blankTile: true,
            }
          } as __esri.TileLayerProperties
        }
      ]
    }, fssgEsri)
    createMapCursor({}, fssgEsri)
    createMapLayers({}, fssgEsri)

    const loaded = useFssgEsriLoaded(fssgEsri)

    return {
      loaded,
      id,
    }
  },
})
</script>

