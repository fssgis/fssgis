import extDate from './date.ext'

export interface IStringExtension {
  trimAll () : string
  toDate () : Date
  toDateFormat (fmt: string) : string
}

export function extString (str: string) : IStringExtension {
  return {
    trimAll () {
      return str.replace(new RegExp(' ', 'g'), '')
    },
    toDate () {
      return new Date(str)
    },
    toDateFormat (fmt) {
      const date = extString(str).toDate()
      return extDate(date).format(fmt)
    }
  }
}

export default extString
