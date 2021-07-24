"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.storageUtils = void 0;
exports.storageUtils = {
    local: {
        set(key, value) {
            localStorage.setItem(key, typeof value === 'string' ? value : JSON.stringify(value));
            return exports.storageUtils.local;
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
            return exports.storageUtils.local;
        },
        clear() {
            localStorage.clear();
            return exports.storageUtils.local;
        }
    },
    session: {
        set(key, value) {
            sessionStorage.setItem(key, typeof value === 'string' ? value : JSON.stringify(value));
            return exports.storageUtils.session;
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
            return exports.storageUtils.session;
        },
        clear() {
            sessionStorage.clear();
            return exports.storageUtils.session;
        }
    },
};
exports.default = exports.storageUtils;
