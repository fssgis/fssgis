function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

class ArrayExtension {
  get $() {
    return this._target;
  }

  constructor(target) {
    _defineProperty(this, "_target", void 0);

    if (ArrayExtension._instance) {
      ArrayExtension._instance._target = target;
      return ArrayExtension._instance;
    }

    this._target = target;
    ArrayExtension._instance = this;
    return this;
  }

  insert(index, value) {
    this._target.splice(index, 0, value);

    return this;
  }

  removeIndex(index, returnRemoveItem) {
    const value = this._target[index];

    this._target.splice(index, 1);

    if (returnRemoveItem) {
      return value;
    }

    return this;
  }

  clear() {
    this._target.splice(0, this._target.length);

    return this;
  }

  reset(...items) {
    this._target.splice(0, this._target.length, ...items);

    return this;
  }

  removeValue(value, removeMany = false) {
    if (removeMany) {
      for (let i = 0; i < this._target.length; i++) {
        if (this._target[i] === value) {
          this._target.splice(i--, 1);
        }
      }
    } else {
      for (let i = 0; i < this._target.length; i++) {
        if (this._target[i] === value) {
          this._target.splice(i--, 1);

          break;
        }
      }
    }

    return this;
  }

  unique() {
    this.reset(...new Set(this._target));
    return this;
  }

  getUnique() {
    return [...new Set(this._target)];
  }

  equal(anotherArr) {
    if (this._target.length !== anotherArr.length) {
      return false;
    }

    for (let i = 0; i < this._target.length; i++) {
      // eslint-disable-next-line
      // @ts-ignore
      if (this._target[i] !== anotherArr[i]) {
        return false;
      }
    }

    return true;
  }

  findItem(propName, propValue) {
    for (let i = 0; i < this._target.length; i++) {
      const item = this._target[i];

      if (item[propName] === propValue) {
        return item;
      }
    }

    return undefined;
  }

  findItems(propName, propValue) {
    const result = [];

    for (let i = 0; i < this._target.length; i++) {
      const item = this._target[i];

      if (item[propName] === propValue) {
        result.push(item);
      }
    }

    return result;
  }

  propToArr(prop) {
    return this._target.map(item => item[prop]);
  }

  last() {
    return this._target[this._target.length - 1];
  }

}

_defineProperty(ArrayExtension, "_instance", void 0);

function extArray(target) {
  return new ArrayExtension(target);
}

class DateExtension {
  get $() {
    return this._target;
  }

  constructor(target) {
    _defineProperty(this, "_target", void 0);

    if (DateExtension._instance) {
      DateExtension._instance._target = target;
      return DateExtension._instance;
    }

    this._target = target;
    DateExtension._instance = this;
    return this;
  }

  format(fmt) {
    const o = {
      'M+': this._target.getMonth() + 1,
      'd+': this._target.getDate(),
      'h+': this._target.getHours(),
      'm+': this._target.getMinutes(),
      's+': this._target.getSeconds(),
      'q+': Math.floor((this._target.getMonth() + 3) / 3),
      'S': this._target.getMilliseconds() //毫秒

    };

    if (/(y+)/.test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (this.$.getFullYear() + '').substr(4 - RegExp.$1.length));
    }

    for (const k in o) {
      if (new RegExp('(' + k + ')').test(fmt)) {
        fmt = fmt.replace(RegExp.$1, RegExp.$1.length === 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length));
      }
    }

    return fmt;
  }

  getNextDate(nDays) {
    return new Date(this._target.getTime() + 24 * 60 * 60 * 1000 * Number(nDays));
  }

  getMonth() {
    return this._target.getMonth() + 1;
  }

}

_defineProperty(DateExtension, "_instance", void 0);

function extDate(date) {
  return new DateExtension(date);
}

class NumberExtension {
  get $() {
    return this._target;
  }

  constructor(target) {
    _defineProperty(this, "_target", void 0);

    if (NumberExtension._instance) {
      NumberExtension._instance._target = target;
      return NumberExtension._instance;
    }

    this._target = target;
    NumberExtension._instance = this;
    return this;
  }

  divide(val) {
    return Math.floor(this._target / val);
  }

  floor() {
    return Math.floor(this._target);
  }

  ceil() {
    return Math.ceil(this._target);
  }

  abs() {
    return Math.abs(this._target);
  }

  round(count = 0) {
    let n = 1;

    if (count > 0) {
      n = count * 10;
    } else if (count < 0) {
      n = 0.1 ** Math.abs(count);
    }

    return Math.round(this._target * n) / n;
  }

  toDate() {
    return new Date(this.$);
  }

  toDateFormat(fmt) {
    return extDate(new Date(this._target)).format(fmt);
  }

  toCashString() {
    return String(this._target).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

  toChineseString() {
    const AA = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九'];
    const BB = ['', '十', '百', '千', '万', '亿', '点', ''];

    const a = ('' + this._target).replace(/(^0*)/g, '').split('.');

    let k = 0,
        re = '';

    for (let i = a[0].length - 1; i >= 0; i--) {
      switch (k) {
        case 0:
          re = BB[7] + re;
          break;

        case 4:
          if (!new RegExp('0{4}\\d{' + (a[0].length - i - 1) + '}$').test(a[0])) {
            re = BB[4] + re;
          }

          break;

        case 8:
          re = BB[5] + re;
          BB[7] = BB[5];
          k = 0;
          break;
      }

      if (k % 4 === 2 && a[0].charAt(i + 2) !== '0' && a[0].charAt(i + 1) === '0') {
        re = AA[0] + re;
      }

      if (a[0].charAt(i) !== '0') {
        re = AA[a[0].charAt(i)] + BB[k % 4] + re;
      }

      k++;
    }

    if (a.length > 1) {
      //加上小数部分(如果有小数部分)
      re += BB[6];

      for (let i = 0; i < a[1].length; i++) {
        re += AA[a[1].charAt(i)];
      }
    }

    return re;
  }

}

_defineProperty(NumberExtension, "_instance", void 0);

function extNumber(num) {
  return new NumberExtension(num);
}

class StringExtension {
  get $() {
    return this._target;
  }

  constructor(target) {
    _defineProperty(this, "_target", void 0);

    if (StringExtension._instance) {
      StringExtension._instance._target = target;
      return StringExtension._instance;
    }

    this._target = target;
    StringExtension._instance = this;
    return this;
  }

  trimAll() {
    return this.$.replace(new RegExp(' ', 'g'), '');
  }

  toDate() {
    return new Date(this._target);
  }

  toDateFormat(fmt) {
    const date = this.toDate();
    return extDate(date).format(fmt);
  }

}

_defineProperty(StringExtension, "_instance", void 0);

function extString(str) {
  return new StringExtension(str);
}

function ext(_this) {
  if (_this instanceof Date) {
    return extDate(_this);
  }

  if (typeof _this === 'string') {
    return extString(_this);
  }

  if (typeof _this === 'number') {
    return extNumber(_this);
  }

  if (Array.isArray(_this)) {
    return extArray(_this);
  }
}

export { ext, extArray, extDate, extNumber, extString };
