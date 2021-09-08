export interface IDateExtension {
  format (fmt: string) : string
  getNextDate (nDays: number) : Date
  getNextDate (nDays: string) : Date
  getMonth () : number
}

export class DateExtension implements IDateExtension {
  private static _instance : DateExtension

  private _target: Date

  public get $ () : Date {
    return this._target
  }

  constructor (target: Date) {
    if (DateExtension._instance) {
      DateExtension._instance._target = target
      return DateExtension._instance
    }
    this._target = target
    DateExtension._instance = this
    return this
  }

  public format (fmt: string) : string {
    const o = {
      'M+': this._target.getMonth() + 1, //月份
      'd+': this._target.getDate(), //日
      'h+': this._target.getHours(), //小时
      'm+': this._target.getMinutes(), //分
      's+': this._target.getSeconds(), //秒
      'q+': Math.floor((this._target.getMonth() + 3) / 3), //季度
      'S': this._target.getMilliseconds() //毫秒
    }
    if (/(y+)/.test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (this.$.getFullYear() + '').substr(4 - RegExp.$1.length))
    }
    for (const k in o) {
      if (new RegExp('(' + k + ')').test(fmt)){
        fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1)
          ? (o[k])
          : (('00' + o[k]).substr(('' + o[k]).length)))
      }
    }
    return fmt
  }

  public getNextDate (nDays: number | string) : Date {
    return new Date(this._target.getTime() + 24 * 60 * 60 * 1000 * Number(nDays))
  }

  public getMonth () : number {
    return this._target.getMonth() + 1
  }

}

export function extDate (date: Date) : IDateExtension {
  return new DateExtension(date)
}

export default extDate
