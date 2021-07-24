import extDate from './date.ext';
export function extString(str) {
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
export default extString;
