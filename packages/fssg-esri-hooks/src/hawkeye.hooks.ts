import { Hawkeye, FssgEsri, IHawkeyeOptions } from '@fssgis/fssg-esri'
import { warn } from '@fssgis/fssg-map'
import { App, inject, InjectionKey, provide } from 'vue'
import { useFssgEsri } from './fssg-esri.hooks'

function _getHawkeye () : Hawkeye
function _getHawkeye (fssgMap: FssgEsri) : Hawkeye
function _getHawkeye (hawkeye: Hawkeye) : Hawkeye
function _getHawkeye (arg0?: FssgEsri | Hawkeye) : Hawkeye
function _getHawkeye (arg0?: FssgEsri | Hawkeye) : Hawkeye {
  let hawkeye: Hawkeye
  if (!arg0) {
    const fssgEsri = useFssgEsri()
    hawkeye = fssgEsri.hawkeye
    if (!hawkeye) {
      warn(this, 'Hawkeye实例未挂载到FssgMap实例')
    }
  } else {
    if (arg0 instanceof FssgEsri) {
      hawkeye = arg0.hawkeye
    } else {
      hawkeye = arg0
    }
  }
  return hawkeye
}

const SYMBOL_HAWKEYE : InjectionKey<Hawkeye> = Symbol('FssgEsri.Hawkeye')
export function createHawkeye (options: IHawkeyeOptions) : Hawkeye
export function createHawkeye (options: IHawkeyeOptions, fssgEsri: FssgEsri, app?: App) : Hawkeye
export function createHawkeye (options: IHawkeyeOptions, fssgEsri?: FssgEsri, app?: App) : Hawkeye {
  const hawkeye = new Hawkeye(options)
  fssgEsri = fssgEsri ?? useFssgEsri()
  fssgEsri.use(hawkeye)
  if (app) {
    app.provide(SYMBOL_HAWKEYE, hawkeye)
  } else {
    provide(SYMBOL_HAWKEYE, hawkeye)
  }
  return hawkeye
}

export function useHawkeye () : Hawkeye
export function useHawkeye (fssgEsri: FssgEsri) : Hawkeye
export function useHawkeye (fssgEsri?: FssgEsri) : Hawkeye
export function useHawkeye (fssgEsri?: FssgEsri) : Hawkeye {
  return fssgEsri?.hawkeye ?? inject(SYMBOL_HAWKEYE) as Hawkeye
}
