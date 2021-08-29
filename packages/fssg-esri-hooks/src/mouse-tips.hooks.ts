import { MouseTips, FssgEsri, IMouseTipsOptions } from '@fssgis/fssg-esri'
import { warn } from '@fssgis/fssg-map'
import { App, inject, InjectionKey, provide } from 'vue'
import { useFssgEsri } from './fssg-esri.hooks'

function _getMouseTips () : MouseTips
function _getMouseTips (fssgMap: FssgEsri) : MouseTips
function _getMouseTips (mouseTips: MouseTips) : MouseTips
function _getMouseTips (arg0?: FssgEsri | MouseTips) : MouseTips
function _getMouseTips (arg0?: FssgEsri | MouseTips) : MouseTips {
  let mouseTips: MouseTips
  if (!arg0) {
    const fssgEsri = useFssgEsri()
    mouseTips = fssgEsri.mouseTips
    if (!mouseTips) {
      warn(this, 'MouseTips实例未挂载到FssgMap实例')
    }
  } else {
    if (arg0 instanceof FssgEsri) {
      mouseTips = arg0.mouseTips
    } else {
      mouseTips = arg0
    }
  }
  return mouseTips
}

const SYMBOL_MOUSETIPS : InjectionKey<MouseTips> = Symbol('FssgEsri.MouseTips')
export function createMouseTips (options: IMouseTipsOptions) : MouseTips
export function createMouseTips (options: IMouseTipsOptions, fssgEsri: FssgEsri, app?: App) : MouseTips
export function createMouseTips (options: IMouseTipsOptions, fssgEsri?: FssgEsri, app?: App) : MouseTips {
  const mouseTips = new MouseTips(options)
  fssgEsri = fssgEsri ?? useFssgEsri()
  fssgEsri.use(mouseTips)
  if (app) {
    app.provide(SYMBOL_MOUSETIPS, mouseTips)
  } else {
    provide(SYMBOL_MOUSETIPS, mouseTips)
  }
  return mouseTips
}

export function useMouseTips () : MouseTips
export function useMouseTips (fssgEsri: FssgEsri) : MouseTips
export function useMouseTips (fssgEsri?: FssgEsri) : MouseTips
export function useMouseTips (fssgEsri?: FssgEsri) : MouseTips {
  return fssgEsri?.mouseTips ?? inject(SYMBOL_MOUSETIPS) as MouseTips
}
