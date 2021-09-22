import { MapModules, FssgEsri, IMapModulesOptions } from '@fssgis/fssg-esri'
import { warn } from '@fssgis/fssg-map'
import { App, inject, InjectionKey, provide, reactive, ref, Ref, watch, toRefs } from 'vue'
import { controllableWatch, useObservableOn } from './base.hooks'
import { useFssgEsri } from './fssg-esri.hooks'

function _getMapModules () : MapModules
function _getMapModules (fssgMap: FssgEsri) : MapModules
function _getMapModules (mapModules: MapModules) : MapModules
function _getMapModules (arg0?: FssgEsri | MapModules) : MapModules
function _getMapModules (arg0?: FssgEsri | MapModules) : MapModules {
  let mapModules: MapModules
  if (!arg0) {
    const { fssgEsri } = useFssgEsri()
    mapModules = fssgEsri.mapModules
  } else {
    if (arg0 instanceof FssgEsri) {
      mapModules = arg0.mapModules
    } else {
      mapModules = arg0
    }
  }
  if (!mapModules) {
    warn(this, 'MapModules实例未挂载到FssgMap实例')
  }
  return mapModules
}

interface IUseMapModulesSelectedTitle {
  selectedTitle: Ref<string>
}

export function useMapModulesSelectedTitle () : IUseMapModulesSelectedTitle
export function useMapModulesSelectedTitle (fssgMap: FssgEsri) : IUseMapModulesSelectedTitle
export function useMapModulesSelectedTitle (mapModules: MapModules) : IUseMapModulesSelectedTitle
export function useMapModulesSelectedTitle (arg0?: FssgEsri | MapModules) : IUseMapModulesSelectedTitle
export function useMapModulesSelectedTitle (arg0?: FssgEsri | MapModules) : IUseMapModulesSelectedTitle {
  const mapModules = _getMapModules(arg0)
  const selectedTitle = ref(mapModules.selectedTitle)

  controllableWatch(selectedTitle, key => {
    if (mapModules.selectedTitle !== key) {
      mapModules.selectedTitle = key
    }
  })

  useObservableOn(mapModules.on('change:selected', e => {
    if (e.item?.title !== selectedTitle.value) {
      selectedTitle.value = e.item?.title ?? ''
    }
  }))

  return {
    selectedTitle
  }
}

interface IMapModulesState {
  selectedId: string
}

const SYMBOL_MAPMODULES : InjectionKey<MapModules> = Symbol('FssgEsri.MapModules')
const SYMBOL_MAPMODULES_STATE : InjectionKey<IMapModulesState> = Symbol('FssgEsri.MapModulesSTATE')

export function createMapModules (options: IMapModulesOptions) : MapModules
export function createMapModules (options: IMapModulesOptions, fssgEsri: FssgEsri, app?: App) : MapModules
export function createMapModules (options: IMapModulesOptions, fssgEsri?: FssgEsri, app?: App) : MapModules {
  const mapModules = new MapModules(options)
  fssgEsri = fssgEsri ?? useFssgEsri().fssgEsri
  fssgEsri.use(mapModules)
  if (app) {
    app.provide(SYMBOL_MAPMODULES, mapModules)
  } else {
    provide(SYMBOL_MAPMODULES, mapModules)
  }

  const state : IMapModulesState = reactive({
    selectedId: ''
  })
  mapModules.when(() => {
    watch(() => state.selectedId, id => {
      mapModules.selectById(id)
    })
    mapModules.on('change:selected', e => {
      if (e.item?.id !== state.selectedId) {
        state.selectedId = e.item?.id ?? ''
      }
    })
  })
  if (app) {
    app.provide(SYMBOL_MAPMODULES_STATE, state)
  } else {
    provide(SYMBOL_MAPMODULES_STATE, state)
  }

  return mapModules
}

interface IUseMapModules {
  mapModules: MapModules
  selectedId: Ref<string>
  selectedTitle: Ref<string>
}

export function useMapModules () : IUseMapModules
export function useMapModules (fssgEsri: FssgEsri) : IUseMapModules
export function useMapModules (fssgEsri?: FssgEsri) : IUseMapModules
export function useMapModules (fssgEsri?: FssgEsri) : IUseMapModules {
  const mapModules = fssgEsri?.mapModules ?? inject(SYMBOL_MAPMODULES) as MapModules
  const { selectedId } = toRefs(inject(SYMBOL_MAPMODULES_STATE) as IMapModulesState)
  return {
    mapModules,
    selectedId,
    ...useMapModulesSelectedTitle(mapModules)
  }
}
