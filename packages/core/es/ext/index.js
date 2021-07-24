import extArray from './extensions/array.ext';
import extDate from './extensions/date.ext';
import extNumber from './extensions/number.ext';
import extString from './extensions/string.ext';
export { extArray, extDate, extNumber, extString, };
export function ext(_this) {
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
export default ext;
