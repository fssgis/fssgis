"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.extDate = void 0;
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
exports.extDate = extDate;
exports.default = extDate;
