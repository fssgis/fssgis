import { MouseTips, FssgEsri, IMouseTipsOptions } from '@fssgis/fssg-esri'
import { warn } from '@fssgis/fssg-map'
import { App, inject, InjectionKey, provide } from 'vue'
import { injectFssgEsri } from './fssg-esri.hooks'
import { createIsomorphicDestructurable } from '@fssgis/utils'

function _getMouseTips () : MouseTips
function _getMouseTips (fssgMap: FssgEsri) : MouseTips
function _getMouseTips (mouseTips: MouseTips) : MouseTips
function _getMouseTips (arg0?: FssgEsri | MouseTips) : MouseTips
function _getMouseTips (arg0?: FssgEsri | MouseTips) : MouseTips {
  let mouseTips: MouseTips
  if (!arg0) {
    const fssgEsri = injectFssgEsri()
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
  fssgEsri = fssgEsri ?? injectFssgEsri()
  fssgEsri.use(mouseTips)
  if (app) {
    app.provide(SYMBOL_MOUSETIPS, mouseTips)
  } else {
    provide(SYMBOL_MOUSETIPS, mouseTips)
  }
  return mouseTips
}

export function injectMouseTips () : MouseTips {
  return inject(SYMBOL_MOUSETIPS) as MouseTips
}

type UseMouseTips = {
  mouseTips: MouseTips
} & readonly [MouseTips]

export function useMouseTips () : UseMouseTips
export function useMouseTips (fssgEsri: FssgEsri) : UseMouseTips
export function useMouseTips (fssgEsri?: FssgEsri) : UseMouseTips
export function useMouseTips (fssgEsri?: FssgEsri) : UseMouseTips {
  const mouseTips = fssgEsri?.mouseTips ?? injectMouseTips()
  return createIsomorphicDestructurable(
    { mouseTips } as const,
    [mouseTips] as const,
  )
}
