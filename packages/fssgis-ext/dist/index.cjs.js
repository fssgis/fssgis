'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function extArray(arr) {
    const ret = {
        insert(index, value) {
            arr.splice(index, 0, value);
            return ret;
        },
        removeIndex(index, returnRemoveValue) {
            const value = arr[index];
            arr.splice(index, 1);
            if (returnRemoveValue) {
                return value;
            }
            return ret;
        },
        clear() {
            arr.splice(0, arr.length);
            return ret;
        },
        reset(...items) {
            arr.splice(0, arr.length, ...items);
            return ret;
        },
        removeValue(value, removeMany = false) {
            if (removeMany) {
                for (let i = 0; i < arr.length; i++) {
                    if (arr[i] === value) {
                        arr.splice(i--, 1);
                    }
                }
            }
            else {
                for (let i = 0; i < arr.length; i++) {
                    if (arr[i] === value) {
                        arr.splice(i--, 1);
                        break;
                    }
                }
            }
            return ret;
        },
        unique() {
            extArray(arr).reset(...new Set(arr));
            return ret;
        },
        getUnique() {
            return [...new Set(arr)];
        },
        equal(anotherArr) {
            if (arr.length !== anotherArr.length) {
                return false;
            }
            for (let i = 0; i < arr.length; i++) {
                // eslint-disable-next-line
                // @ts-ignore
                if (arr[i] !== anotherArr[i]) {
                    return false;
                }
            }
            return true;
        },
        findItem(propName, propValue) {
            for (let i = 0; i < arr.length; i++) {
                const item = arr[i];
                if (item[propName] === propValue) {
                    return item;
                }
            }
            return undefined;
        },
        findItems(propName, propValue) {
            const result = [];
            for (let i = 0; i < arr.length; i++) {
                const item = arr[i];
                if (item[propName] === propValue) {
                    result.push(item);
                }
            }
            return result;
        },
        propToArr: propName => arr.map(item => item[propName]),
        last: () => (arr)[arr.length - 1],
    };
    return ret;
}

function extDate(date) {
    return {
        format(fmt) {
            const o = {
                'M+': date.getMonth() + 1,
                'd+': date.getDate(),
                'h+': date.getHours(),
                'm+': date.getMinutes(),
                's+': date.getSeconds(),
                'q+': Math.floor((date.getMonth() + 3) / 3),
                'S': date.getMilliseconds() //毫秒
            };
            if (/(y+)/.test(fmt)) {
                fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
            }
            for (const k in o) {
                if (new RegExp('(' + k + ')').test(fmt)) {
                    fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1)
                        ? (o[k])
                        : (('00' + o[k]).substr(('' + o[k]).length)));
                }
            }
            return fmt;
        },
        getNextDate(nDays) {
            return new Date(date.getTime() + 24 * 60 * 60 * 1000 * Number(nDays));
        },
        getMonth() {
            return date.getMonth() + 1;
        }
    };
}

function extNumber(num) {
    return {
        divide: val => Math.floor(num / val),
        floor: () => Math.floor(num),
        ceil: () => Math.ceil(num),
        abs: () => Math.abs(num),
        round(count = 0) {
            let n = 1;
            if (count > 0) {
                n = count * 10;
            }
            else if (count < 0) {
                n = 0.1 ** extNumber(count).abs();
            }
            return Math.round(num * n) / n;
        },
        toDate() {
            return new Date(num);
        },
        toDateFormat: fmt => extDate(new Date(num)).format(fmt),
        toCashString: () => String(num).replace(/\B(?=(\d{3})+(?!\d))/g, ','),
        toChineseString() {
            const AA = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九'];
            const BB = ['', '十', '百', '千', '万', '亿', '点', ''];
            const a = ('' + num).replace(/(^0*)/g, '').split('.');
            let k = 0, re = '';
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
            if (a.length > 1) { //加上小数部分(如果有小数部分)
                re += BB[6];
                for (let i = 0; i < a[1].length; i++) {
                    re += AA[a[1].charAt(i)];
                }
            }
            return re;
        }
    };
}

function extString(str) {
    return {
        trimAll() {
            return str.replace(new RegExp(' ', 'gm'), '');
        },
        toDate() {
            return new Date(str);
        },
        toDateFormat(fmt) {
            const date = extString(str).toDate();
            return extDate(date).format(fmt);
        }
    };
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

exports.ext = ext;
exports.extArray = extArray;
exports.extDate = extDate;
exports.extNumber = extNumber;
exports.extString = extString;
