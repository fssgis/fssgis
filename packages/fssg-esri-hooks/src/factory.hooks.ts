import { FssgEsri, IGeometryFactory, createGeometryFactory } from '@fssgis/fssg-esri'
import { inject, InjectionKey, provide } from 'vue'
import { useFssgEsri } from './fssg-esri.hooks'

const SYMBOL_GEO_FACTORY : InjectionKey<IGeometryFactory> = Symbol('FssgEsri.GeoFactory')

export function createGeoFactory (fssgEsri?: FssgEsri) : IGeometryFactory {
  fssgEsri = fssgEsri || useFssgEsri()
  const factory = createGeometryFactory(fssgEsri)
  provide(SYMBOL_GEO_FACTORY, factory)
  return factory
}

export function useGeoFactory () : IGeometryFactory {
  return inject(SYMBOL_GEO_FACTORY) as IGeometryFactory
}
