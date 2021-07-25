/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-types */

import axios, { AxiosInstance, AxiosRequestConfig } from 'axios'

export {
  axios
}

let _axiosInstance = axios.create()

export interface IAxiosController {
  setUrl (url: string) : IAxiosController
  setBody (key: string, value: string) : IAxiosController
  setBody (body: Object) : IAxiosController
  setParams (key: string, value: string) : IAxiosController
  setParams (body: Object) : IAxiosController
  setHeaders (key: string, value: string) : IAxiosController
  setHeaders (body: Object) : IAxiosController
  setConfig (config: AxiosRequestConfig) : IAxiosController
  mountGet <T> (axiosInit?: AxiosInstance) : Promise<T>
  mountPost <T> (axiosInit?: AxiosInstance) : Promise<T>
}

export function createAxios () : IAxiosController {
  let config : AxiosRequestConfig = {}
  const axiosController : IAxiosController = {
    setUrl (url: string) : IAxiosController {
      config.url = url
      return axiosController
    },
    mountGet <T> (axiosInit: AxiosInstance = _axiosInstance) : Promise<T> {
      return axiosInit({
        ...config,
        method: 'get'
      }).then(res => res.data)
    },
    mountPost <T> (axiosInit: AxiosInstance = _axiosInstance) : Promise<T> {
      return axiosInit({
        ...config,
        method: 'post'
      }).then(res => res.data)
    },
    setBody (...args: any[]) : IAxiosController {
      if (!config.data) {
        config.data = {}
      }
      if (args.length === 1) {
        const body = args[0]
        Object.assign(config.data, body)
      } else if (args.length === 2) {
        const [key, value] = args
        config.data[key] = value
      }
      return axiosController
    },
    setHeaders (...args: any[]) : IAxiosController {
      if (!config.headers) {
        config.headers = {}
      }
      if (args.length === 1) {
        const headers = args[0]
        Object.assign(config.headers, headers)
      } else if (args.length === 2) {
        const [key, value] = args
        config.headers[key] = value
      }
      return axiosController
    },
    setParams (...args: any[]) : IAxiosController {
      if (!config.params) {
        config.params = {}
      }
      if (args.length === 1) {
        const params = args[0]
        Object.assign(config.params, params)
      } else if (args.length === 2) {
        const [key, value] = args
        config.params[key] = value
      }
      return axiosController
    },
    setConfig (_config: AxiosRequestConfig) : IAxiosController {
      config = _config
      return axiosController
    }
  }
  return axiosController
}

export function setGlobelAxiosInstance (axiosInstance: AxiosInstance) : void {
  _axiosInstance = axiosInstance
}

export default createAxios
