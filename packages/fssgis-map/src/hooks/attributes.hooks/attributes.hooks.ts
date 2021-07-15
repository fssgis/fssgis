import { App, inject, InjectionKey } from 'vue'

interface IAttribute {
  layerName: string
  fields: {
    name: string
    alias: string
    type?: string
  }[]
  exclude: string[]
}

type IAttributes = IAttribute[]

const SYMBOL_KEY: InjectionKey<IAttributes> = Symbol()

export function createAttributes (attributes: IAttributes) : { install (app: App) : void } {

  return {
    install (app) {
      app.provide(SYMBOL_KEY, attributes)
    }
  }
}

export function useAttributes () : IAttributes {
  return inject(SYMBOL_KEY) as IAttributes
}
