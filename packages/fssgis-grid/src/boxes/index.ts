/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

import { CSSProperties, PropType } from 'vue'
import { isNullOrUndefined } from '@fssgis/utils'

import FssgBoxV1 from './fssg-box-v1'
import FssgBoxV2 from './fssg-box-v2'
import FssgBoxV3 from './fssg-box-v3'
import FssgBoxV4 from './fssg-box-v4'

export {
  FssgBoxV1,
  FssgBoxV2,
  FssgBoxV3,
  FssgBoxV4,
}

export interface IStatistics {
  title: string
  value?: string | number
  unit: string
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
