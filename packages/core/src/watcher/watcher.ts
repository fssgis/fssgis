import { IHandle, IWatchHandle } from './watcher.interface'

/**
 * 观测者类，用以观测对象实例的成员值变化
 */
export class Watcher {

  public static observe<T> (cls: T) : T {
    return new Proxy(cls as any, { // eslint-disable-line @typescript-eslint/no-explicit-any
      construct (target, args) {
        const obj = new target(...args)
        return new Proxy(obj, {
          set: (target, key, value, receiver) => {
            const oldValue = target[key]
            target._handles.forEach((handle) => {
              if (handle.propName === key) {
                handle.callback(value, oldValue, key, target)
              }
            })
            return Reflect.set(target, key, value, receiver)
          },
        })
      },
    }) as T
  }

  /** 观测处理器集合 */
  private _handles: Set<IHandle<unknown>> = new Set()

  public get <T extends keyof this> (propName: T) : this[T] {
    return this[propName]
  }

  public set <T extends keyof this> (propName: T, propValue: this[T]) : this
  public set (prop: { [P in keyof this]?: this[P]}) : this
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  public set (arg0: any, propValue?: any) : this { // eslint-disable-line @typescript-eslint/no-explicit-any
    if (typeof arg0 !== 'string') {
      for (const key in arg0) {
        this.set(key as any, arg0[key]) // eslint-disable-line @typescript-eslint/no-explicit-any
      }
      return this
    }
    this[arg0] = propValue
    return this
  }

  public watch <T extends keyof this> (propName: T, callback: (
    value: this[T],
    oldValue: this[T],
    propertyName: T,
    target: this
  ) => void) : IWatchHandle
  public watch <T extends keyof this> (propNames: T[], callback: (
    value: this[T],
    oldValue: this[T],
    propertyName: T,
    target: this
  ) => void) : IWatchHandle
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  public watch (arg0: string | string[], callback: any) : IWatchHandle { // eslint-disable-line @typescript-eslint/no-explicit-any
    const handles: IHandle<unknown>[] = []
    const propNames = Array.isArray(arg0) ? [...arg0] : [arg0]
    propNames.forEach(propName => {
      const handle: IHandle<unknown> = { propName, callback }
      handles.push(handle)
      this._handles.add(handle)
    })
    const remove = () => {
      handles.forEach(h => {
        this._handles.delete(h)
      })
    }
    return { remove }
  }

}

export default Watcher.observe(Watcher)
