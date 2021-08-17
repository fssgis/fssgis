import { FssgEsri } from '@fssgis/fssg-esri'
import { getCurrentInstance, onUnmounted, ref, Ref, shallowReactive, shallowRef, watchEffect } from 'vue'

interface IWatchRef {
  watchStatus: Ref<boolean>
  stopWatch () : void
  startWatch () : void
}

export function useWatchRef<T extends __esri.Accessor, K extends keyof T> (accessor: T, property: K) : {
  watchRef: Ref<T[K]>
} & IWatchRef {
  let handle : __esri.WatchHandle | undefined

  const watchRef = ref(accessor[property]) as Ref<T[K]>
  const watchStatus = ref(true)
  const stopWatch = () => watchStatus.value = false
  const startWatch = () => watchStatus.value = true

  watchEffect(() => {
    if (watchStatus.value) {
      handle?.remove()
      watchRef.value = accessor[property]
      handle = accessor.watch(property as string, val => watchRef.value = val)
    } else {
      handle?.remove()
      handle = undefined
    }
  })

  if (getCurrentInstance()) {
    onUnmounted(() => stopWatch())
  }

  return { watchRef, startWatch, stopWatch, watchStatus }
}

export function useWatchShallowRef<T extends __esri.Accessor, K extends keyof T> (accessor: T, property: K) : {
  watchRef: Ref<T[K]>
} & IWatchRef {
  let handle : __esri.WatchHandle | undefined

  const watchRef = shallowRef(accessor[property]) as Ref<T[K]>
  const watchStatus = ref(true)
  const stopWatch = () => watchStatus.value = false
  const startWatch = () => watchStatus.value = true

  watchEffect(() => {
    if (watchStatus.value) {
      handle?.remove()
      watchRef.value = accessor[property]
      handle = accessor.watch(property as string, val => watchRef.value = val)
    } else {
      handle?.remove()
      handle = undefined
    }
  })

  if (getCurrentInstance()) {
    onUnmounted(() => stopWatch())
  }

  return { watchRef, startWatch, stopWatch, watchStatus }
}

export function useWatchShallowReactive<T extends __esri.Accessor, K extends keyof T> (accessor: T, properties: K[]) : {
  watchReactive: Record<K, T[K]>
} & IWatchRef {
  const watchReactive = shallowReactive({} as Record<K, T[K]>)
  const watchStatus = ref(true)
  const stopWatch = () => watchStatus.value = false
  const startWatch = () => watchStatus.value = true

  properties.forEach(prop => {
    watchReactive[prop] = accessor[prop]
  })

  if (getCurrentInstance()) {
    onUnmounted(() => stopWatch())
  }
  return { watchReactive, startWatch, stopWatch, watchStatus }
}


export function useZoom (fssgEsri: FssgEsri) : { zoom: Ref<number> } & IWatchRef {
  const { watchRef: zoom, ...others } = useWatchRef(fssgEsri.view, 'zoom')
  return { zoom, ...others }
}

export function useCenter (fssgEsri: FssgEsri) : { center: Ref<__esri.Point> } & IWatchRef {
  const { watchRef: center, ...others } = useWatchShallowRef(fssgEsri.view, 'center')
  return { center, ...others }
}

// export function useCenterZoom (fssgEsri: FssgEsri) : { state: { center: __esri.Point, zoom: number } } & IWatchRef {
//   const { watchReactive: state, ...others } = useWatchShallowReactive(fssgEsri.view, ['center', 'zoom'])
//   return { state, others }
// }

