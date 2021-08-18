// import { Basemap, FssgEsri } from "@fssgis/fssg-esri";
// import { getCurrentInstance, onUnmounted, ref, Ref, watchEffect } from "vue";
// import { useFssgEsri } from "./fssg-esri.hooks";

// interface IBasemapHook {
//   selectedKey: Ref<string>
//   visible: Ref<boolean>
//   startWatch () : void
//   stopWatch () : void
// }

// export function useBasemap () : IBasemapHook
// export function useBasemap (fssgMap: FssgEsri) : IBasemapHook
// export function useBasemap (basemap: Basemap) : IBasemapHook
// export function useBasemap (arg0?: FssgEsri | Basemap) : IBasemapHook
// export function useBasemap (arg0?: FssgEsri | Basemap) : IBasemapHook {
//   let basemap: Basemap
//   if (!arg0) {
//     const fssgEsri = useFssgEsri()
//     basemap = fssgEsri.basemap
//   } else {
//     if (arg0 instanceof FssgEsri) {
//       basemap = arg0.basemap
//     } else {
//       basemap = arg0
//     }
//   }
//   const selectedKey = ref(basemap.selectedKey)
//   const visible = ref(basemap.visible)
//   const watchStatus = ref(true)
//   const stopWatch = () => watchStatus.value = false
//   const startWatch = () => watchStatus.value = true

//   let handleSelectedKeyChanged : __esri.WatchHandle | undefined,
//       handleVisibleChanged : __esri.WatchHandle | undefined
//   watchEffect(() => {
//     if (watchStatus.value) {

//     } else {
//       handleSelectedKeyChanged?.remove()
//       handleSelectedKeyChanged = undefined
//       handleVisibleChanged?.remove()
//       handleVisibleChanged = undefined
//     }
//   })

//   if (getCurrentInstance()) {
//     onUnmounted(() => stopWatch())
//   }

// }
