export interface IArrayExtension<T> {
  insert (index: number, value: T) : IArrayExtension<T>
  removeIndex (index: number) : IArrayExtension<T>
  removeIndex (index: number, returnRemoveValue: true) : T
  clear () : IArrayExtension<T>
  reset (...item: T[]) : IArrayExtension<T>
  removeValue (value: T, removeMany?: boolean) : IArrayExtension<T>
  unique () : IArrayExtension<T>
  getUnique () : T[]
  equal<K> (arr: K[]) : boolean
  findItem (propName: keyof T, propValue: T[keyof T]) : T | undefined
  findItems (propName: keyof T, propValue: T[keyof T]) : T[]
  propToArr (propName: keyof T) : T[keyof T][]
  last () : T
}

export function extArray<T> (arr: T[]) : IArrayExtension<T> {
  const ret : IArrayExtension<T> = {
    insert (index, value) {
      arr.splice(index, 0, value)
      return ret
    },
    removeIndex (index: number, returnRemoveValue?: true) : any { // eslint-disable-line
      const value = arr[index]
      arr.splice(index, 1)
      if (returnRemoveValue) {
        return value
      }
      return ret
    },
    clear () {
      arr.splice(0, arr.length)
      return ret
    },
    reset (...items) {
      arr.splice(0, arr.length, ...items)
      return ret
    },
    removeValue (value, removeMany = false) {
      if (removeMany) {
        for (let i = 0; i < arr.length; i++) {
          if (arr[i] === value) {
            arr.splice(i--, 1)
          }
        }
      } else {
        for (let i = 0; i < arr.length; i++) {
          if (arr[i] === value) {
            arr.splice(i--, 1)
            break
          }
        }
      }
      return ret
    },
    unique () {
      extArray(arr as T[]).reset(...new Set(arr as T[]))
      return ret
    },
    getUnique () {
      return [...new Set(arr)]
    },
    equal (anotherArr) {
      if (arr.length !== anotherArr.length) {
        return false
      }
      for (let i = 0; i < arr.length; i++) {
        // eslint-disable-next-line
        // @ts-ignore
        if (arr[i] !== anotherArr[i]) {
          return false
        }
      }
      return true
    },
    findItem (propName, propValue) {
      for (let i = 0; i < arr.length; i++) {
        const item = arr[i]
        if (item[propName] === propValue) {
          return item
        }
      }
      return undefined
    },
    findItems (propName, propValue) {
      const result : T[] = []
      for (let i = 0; i < arr.length; i++) {
        const item = arr[i]
        if (item[propName] === propValue) {
          result.push(item)
        }
      }
      return result
    },
    propToArr: propName => arr.map(item => item[propName]),
    last: () => (arr)[arr.length - 1],
  }
  return ret
}

export default extArray
