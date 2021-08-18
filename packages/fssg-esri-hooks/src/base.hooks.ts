/* eslint-disable @typescript-eslint/ban-types */

import { getCurrentInstance, onBeforeUnmount, onUnmounted, watch, WatchCallback, WatchOptions, WatchSource, WatchStopHandle } from 'vue'
import { IHandle } from '@fssgis/observable'

export type MapSources<T> = {
  [K in keyof T]: T[K] extends WatchSource<infer V> ? V : never;
}
export type MapOldSources<T, Immediate> = {
  [K in keyof T]: T[K] extends WatchSource<infer V> ? Immediate extends true ? V | undefined : V : never;
}

export function tryOnUnmounted (callback: () => void) : void {
  if (getCurrentInstance()) {
    onUnmounted(() => callback())
  }
}

export function tryOnBeforeUnmounted (callback: () => void) : void {
  if (getCurrentInstance()) {
    onBeforeUnmount(() => callback())
  }
}

export function controllableWatch (sources: (object | WatchSource<unknown>)[], cb: WatchCallback<(object | WatchSource<unknown>)[], (object | WatchSource<unknown>)[]>, options?: WatchOptions<false> | undefined): {start () : void, stop: () => void }
export function controllableWatch <T extends readonly (object | WatchSource<unknown>)[], Immediate extends Readonly<boolean> = false>(source: T, cb: WatchCallback<MapOldSources<T, false>, MapOldSources<T, Immediate>>, options?: WatchOptions<Immediate> | undefined): {start () : void, stop: () => void }
export function controllableWatch <T, Immediate extends Readonly<boolean> = false>(source: WatchSource<T>, cb: WatchCallback<T, Immediate extends true ? T | undefined : T>, options?: WatchOptions<Immediate> | undefined): {start () : void, stop: () => void }
export function controllableWatch <T extends object, Immediate extends Readonly<boolean> = false>(source: T, cb: WatchCallback<T, Immediate extends true ? T | undefined : T>, options?: WatchOptions<Immediate> | undefined): {start () : void, stop: () => void }
export function controllableWatch (...args: any[]) : { // eslint-disable-line
  start () : void
  stop: () => void
} {
  const createWatch = () => watch(...(args as Parameters<typeof watch>))
  let stopHandle : WatchStopHandle | undefined
  function start () {
    stopHandle?.()
    stopHandle = createWatch()
  }
  function stop () {
    stopHandle?.()
  }
  start()
  tryOnBeforeUnmounted(() => stop())
  return {
    start,
    stop,
  }
}

export function useObservableOn (handle: IHandle) : void {
  tryOnBeforeUnmounted(() => handle.remove())
}
