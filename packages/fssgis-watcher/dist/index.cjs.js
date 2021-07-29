'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function observe(cls) {
    return new Proxy(cls, {
        construct(target, args) {
            // eslint-disable-next-line
            // @ts-ignore
            const obj = new target(...args);
            return new Proxy(obj, {
                set: (target, key, value, receiver) => {
                    const oldValue = target[key];
                    // eslint-disable-next-line
                    // @ts-ignore
                    target._handles.forEach((handle) => {
                        if (handle.propName === key) {
                            handle.callback(value, oldValue, key, target);
                        }
                    });
                    return Reflect.set(target, key, value, receiver);
                },
            });
        },
    });
}
class Watcher {
    _handles = new Set();
    get(propName) {
        return this[propName];
    }
    set(arg0, propValue) {
        if (typeof arg0 !== 'string') {
            for (const key in arg0) {
                this.set(key, arg0[key]); // eslint-disable-line
            }
            return this;
        }
        this[arg0] = propValue;
        return this;
    }
    watch(arg0, callback) {
        const handles = [];
        const propNames = Array.isArray(arg0) ? [...arg0] : [arg0];
        propNames.forEach(propName => {
            const handle = { propName, callback };
            handles.push(handle);
            this._handles.add(handle);
        });
        const remove = () => {
            handles.forEach(h => {
                this._handles.delete(h);
            });
        };
        return { remove };
    }
}

exports.Watcher = Watcher;
exports.default = Watcher;
exports.observe = observe;
