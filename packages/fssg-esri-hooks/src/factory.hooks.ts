import { FssgEsri, GeometryFacory, createGeometryFactory, ILayerFactory, createLayerFactory } from '@fssgis/fssg-esri'
import { App, inject, InjectionKey, provide } from 'vue'
import { useFssgEsri } from './fssg-esri.hooks'

const SYMBOL_GEO_FACTORY : InjectionKey<GeometryFacory> = Symbol('FssgEsri.GeoFactory')
const SYMBOL_LYR_FACTORY : InjectionKey<ILayerFactory> = Symbol('FssgEsri.LyrFactory')

export function createGeoFactory (fssgEsri?: FssgEsri, app?: App) : GeometryFacory {
  fssgEsri = fssgEsri || useFssgEsri()
  const factory = createGeometryFactory(fssgEsri)
  if (app) {
    app.provide(SYMBOL_GEO_FACTORY, factory)
  } else {
    provide(SYMBOL_GEO_FACTORY, factory)
  }
  return factory
}

export function useGeoFactory () : GeometryFacory {
  return inject(SYMBOL_GEO_FACTORY) as GeometryFacory
}

export function createLyrFactory (app?: App) : ILayerFactory {
  const factory = createLayerFactory()
  if (app) {
    app.provide(SYMBOL_LYR_FACTORY, factory)
  } else {
    provide(SYMBOL_LYR_FACTORY, factory)
  }
  return factory
}

export function useLyrFactory () : ILayerFactory {
  return inject(SYMBOL_LYR_FACTORY) as ILayerFactory
}
