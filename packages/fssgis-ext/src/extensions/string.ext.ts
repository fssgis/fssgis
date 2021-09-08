import extDate from './date.ext'

export interface IStringExtension {
  trimAll () : string
  toDate () : Date
  toDateFormat (fmt: string) : string
}

export class StringExtension implements IStringExtension {
  private static _instance : StringExtension

  private _target: string

  public get $ () : string {
    return this._target
  }

  constructor (target: string) {
    if (StringExtension._instance) {
      StringExtension._instance._target = target
      return StringExtension._instance
    }
    this._target = target
    StringExtension._instance = this
    return this
  }
  public trimAll () : string {
    return this.$.replace(new RegExp(' ', 'g'), '')
  }

  public toDate () : Date {
    return new Date(this._target)
  }

  public toDateFormat (fmt: string) : string {
    const date = this.toDate()
    return extDate(date).format(fmt)
  }
}

export function extString (str: string) : IStringExtension {
  return new StringExtension(str)
}

export default extString
