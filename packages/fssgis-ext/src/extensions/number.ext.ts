import extDate from './date.ext'

export interface INumberExtension {
  divide (val: number) : number
  floor () : number
  ceil () : number
  abs () : number
  round (count?: number) : number
  toDate () : Date
  toDateFormat (fmt: string) : string
  toCashString () : string
  toChineseString () : string
}

export class NumberExtension implements INumberExtension {
  private static _instance : NumberExtension

  private _target: number

  public get $ () : number {
    return this._target
  }

  constructor (target: number) {
    if (NumberExtension._instance) {
      NumberExtension._instance._target = target
      return NumberExtension._instance
    }
    this._target = target
    NumberExtension._instance = this
    return this
  }

  public divide (val: number) : number {
    return Math.floor(this._target / val)
  }

  public floor () : number {
    return Math.floor(this._target)
  }

  public ceil () : number {
    return Math.ceil(this._target)
  }

  public abs () : number {
    return Math.abs(this._target)
  }

  public round (count = 0) : number {
    let n = 1
    if (count > 0) {
      n = count * 10
    } else if (count < 0) {
      n = 0.1 ** Math.abs(count)
    }
    return Math.round(this._target * n) / n
  }

  public toDate () : Date {
    return new Date(this.$)
  }

  public toDateFormat (fmt: string) : string {
    return extDate(new Date(this._target)).format(fmt)
  }

  public toCashString () : string {
    return String(this._target).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  }

  public toChineseString () : string {
    const AA = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九']
    const BB = ['', '十', '百', '千', '万', '亿', '点', '']
    const a = ('' + this._target).replace(/(^0*)/g, '').split('.')
    let k = 0,
      re = ''
    for (let i = a[0].length - 1; i >= 0; i--) {
      switch (k) {
        case 0:
          re = BB[7] + re
          break
        case 4:
          if (!new RegExp('0{4}\\d{' + (a[0].length - i - 1) + '}$').test(a[0])) {
            re = BB[4] + re
          }
          break
        case 8:
          re = BB[5] + re
          BB[7] = BB[5]
          k = 0
          break
        default:
          break
      }
      if (k % 4 === 2 && a[0].charAt(i + 2) !== '0' && a[0].charAt(i + 1) === '0') {
        re = AA[0] + re
      }
      if (a[0].charAt(i) !== '0') {
        re = AA[a[0].charAt(i)] + BB[k % 4] + re
      }
      k++
    }
    if (a.length > 1) { //加上小数部分(如果有小数部分)
      re += BB[6]
      for (let i = 0; i < a[1].length; i++) {
        re += AA[a[1].charAt(i)]
      }
    }
    return re
  }

}

export function extNumber (num: number) : INumberExtension {
  return new NumberExtension(num)
}

export default extNumber
