import { FssgEsri, IGeometryFactory, createGeometryFactory, ILayerFactory, createLayerFactory } from '@fssgis/fssg-esri'
import { inject, InjectionKey, provide } from 'vue'
import { useFssgEsri } from './fssg-esri.hooks'

const SYMBOL_GEO_FACTORY : InjectionKey<IGeometryFactory> = Symbol('FssgEsri.GeoFactory')
const SYMBOL_LYR_FACTORY : InjectionKey<ILayerFactory> = Symbol('FssgEsri.LyrFactory')

export function createGeoFactory (fssgEsri?: FssgEsri) : IGeometryFactory {
  fssgEsri = fssgEsri || useFssgEsri()
  const factory = createGeometryFactory(fssgEsri)
  provide(SYMBOL_GEO_FACTORY, factory)
  return factory
}

export function useGeoFactory () : IGeometryFactory {
  return inject(SYMBOL_GEO_FACTORY) as IGeometryFactory
}

export function createLyrFactory () : ILayerFactory {
  const factory = createLayerFactory()
  provide(SYMBOL_LYR_FACTORY, factory)
  return factory
}

export function useLyrFactory () : ILayerFactory {
  return inject(SYMBOL_LYR_FACTORY) as ILayerFactory
}
