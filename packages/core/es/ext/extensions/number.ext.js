import extDate from './date.ext';
export function extNumber(num) {
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
                    default:
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
export default extNumber;
