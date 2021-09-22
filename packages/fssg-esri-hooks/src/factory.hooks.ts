import { FssgEsri, GeometryFacory, createGeometryFactory, ILayerFactory, createLayerFactory } from '@fssgis/fssg-esri'
import { App, inject, InjectionKey, provide } from 'vue'
import { useFssgEsri } from './fssg-esri.hooks'
import { createIsomorphicDestructurable } from '@fssgis/utils'

const SYMBOL_GEO_FACTORY : InjectionKey<GeometryFacory> = Symbol('FssgEsri.GeoFactory')
const SYMBOL_LYR_FACTORY : InjectionKey<ILayerFactory> = Symbol('FssgEsri.LyrFactory')

export function createGeoFactory (fssgEsri?: FssgEsri, app?: App) : GeometryFacory {
  fssgEsri = fssgEsri || useFssgEsri().fssgEsri
  const factory = createGeometryFactory(fssgEsri)
  if (app) {
    app.provide(SYMBOL_GEO_FACTORY, factory)
  } else {
    provide(SYMBOL_GEO_FACTORY, factory)
  }
  return factory
}

export function useGeoFactory () : {
  geoFactory: GeometryFacory
} & readonly [GeometryFacory] {
  const geoFactory = inject(SYMBOL_GEO_FACTORY) as GeometryFacory
  return createIsomorphicDestructurable(
    { geoFactory } as const,
    [geoFactory] as const,
  )
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

export function useLyrFactory () : {
  lyrFactory: ILayerFactory
} & readonly [ILayerFactory] {
  const lyrFactory = inject(SYMBOL_LYR_FACTORY) as ILayerFactory
  return createIsomorphicDestructurable(
    { lyrFactory } as const,
    [lyrFactory] as const,
  )
}
