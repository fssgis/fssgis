const M_SECONDS_A_DAY = 86400000;
const M_SECONDS_A_HOUR = 3600000;
const M_SECONDS_A_MINUTE = 60000;
/** Cookie工具集 */
const cookieUtils = {
    /**
     * 设置Cookie
     * @param key Cookie Key值
     * @param value Cookie Value值（对象类型会使用JSON解析成字符串）
     * @param options 配置项
     */
    set(key, value, options) {
        const { days, hours, minutes } = options;
        const exp = new Date();
        exp.setTime(exp.getTime() + (days ?? 0 * M_SECONDS_A_DAY) + (hours ?? 0) * M_SECONDS_A_HOUR + (minutes ?? 0) * M_SECONDS_A_MINUTE);
        const _value = typeof value === 'string'
            ? value
            : JSON.stringify(value);
        /* eslint-disable */
        // @ts-ignore: exp.toGMTString()
        const cookie = `${key}=${escape(_value)};expires=${exp.toGMTString()}`;
        /* eslint-enable */
        document.cookie = cookie;
        return this;
    },
    /**
     * 删除Cookie
     * @param key Cookie Key值
     */
    del(key) {
        const exp = new Date();
        /* eslint-disable */
        // @ts-ignore: exp.toGMTString()
        document.cookie = `${key}=;expires=${exp.toGMTString()}`;
        /* eslint-enable */
        return this;
    },
    /**
     * 获取Cookie
     * @param key Cookie Key值
     */
    get(key) {
        const cookie = document.cookie.match(new RegExp(`(^| )${key}=([^;]*)(;|$)`));
        if (cookie) {
            return unescape(cookie[2]);
        }
        else {
            return undefined;
        }
    },
    /**
     * 获取Cookie（结果为经过JSON解析的对象）
     * @param key Cookie Key值
     */
    getUseJSON(key) {
        const cookie = document.cookie.match(new RegExp(`(^| )${key}=([^;]*)(;|$)`));
        if (cookie) {
            return JSON.parse(unescape(cookie[2]));
        }
        else {
            return undefined;
        }
    },
};

const storageUtils = {
    local: {
        set(key, value) {
            localStorage.setItem(key, typeof value === 'string' ? value : JSON.stringify(value));
            return storageUtils.local;
        },
        get(key) {
            const value = localStorage.getItem(key);
            if (value) {
                return value;
            }
            else {
                return null;
            }
        },
        getUseJSON(key) {
            const value = localStorage.getItem(key);
            if (value) {
                return JSON.parse(value);
            }
            else {
                return null;
            }
        },
        remove(key) {
            localStorage.removeItem(key);
            return storageUtils.local;
        },
        clear() {
            localStorage.clear();
            return storageUtils.local;
        }
    },
    session: {
        set(key, value) {
            sessionStorage.setItem(key, typeof value === 'string' ? value : JSON.stringify(value));
            return storageUtils.session;
        },
        get(key) {
            const value = sessionStorage.getItem(key);
            if (value) {
                return value;
            }
            else {
                return null;
            }
        },
        getUseJSON(key) {
            const value = sessionStorage.getItem(key);
            if (value) {
                return JSON.parse(value);
            }
            else {
                return null;
            }
        },
        remove(key) {
            sessionStorage.removeItem(key);
            return storageUtils.session;
        },
        clear() {
            sessionStorage.clear();
            return storageUtils.session;
        }
    },
};

export { cookieUtils, storageUtils };
