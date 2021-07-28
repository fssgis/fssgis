/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

import { CSSProperties, PropType } from 'vue'
import { isNullOrUndefined } from '@fssgis/utils'

export * from './fssg-box-v4'
export * from './fssg-box-v3'
export * from './fssg-box-v2'
export * from './fssg-box-v1'

import './fssg-box.scss'

export interface IStatistics {
  title: string
  value?: string | number
  unit: string
  iconUrl?: string
  iconStyle?: CSSProperties
  titleStyle?: CSSProperties
  valueStyle?: CSSProperties
  unitStyle?: CSSProperties
}

export function statisticsProps () {
  return {
    title: {
      type: String,
      default: '',
    },
    value: {
      type: [String, Number],
      default: null,
    },
    unit: {
      type: String,
      default: '',
    },
  }
}

export function statisticsStyleProps () {
  return {
    iconUrl: {
      type: String,
      default: '',
    },
    iconStyle: {
      type: Object as PropType<CSSProperties>,
      default: () => ({})
    },
    titleStyle: {
      type: Object as PropType<CSSProperties>,
      default: () => ({})
    },
    valueStyle: {
      type: Object as PropType<CSSProperties>,
      default: () => ({})
    },
    unitStyle: {
      type: Object as PropType<CSSProperties>,
      default: () => ({})
    },
  }
}

export function toValue (value?: string | number | null, initValue = '---') : string | number {
  return isNullOrUndefined(value) || value === ''
    ? initValue
    : value as string
}
