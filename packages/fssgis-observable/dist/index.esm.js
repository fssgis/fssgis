/**
 * 事件者类，用以观测监听对象实例产生的事件
 */
class Observable {
    /** 监听处理函数存储池 */
    _eventPool = new Map(); // eslint-disable-line @typescript-eslint/no-explicit-any
    /**
     * 绑定监听函数
     * @param name 监听类型名
     * @param callback 监听回调函数
     */
    on(name, callback) {
        const key = name.toLowerCase();
        let eventList = this._eventPool.get(key);
        if (!eventList) {
            this._eventPool.set(name, []);
            eventList = this._eventPool.get(key);
        }
        eventList.push(callback);
        return {
            remove: () => this.off(name, callback)
        };
    }
    /**
     * 移除监听函数
     * @param name 监听类型名
     * @param callback 监听回调函数（不指定者移除所有）
     */
    off(name, callback) {
        const key = name.toLowerCase();
        const eventList = this._eventPool.get(key);
        if (!eventList || eventList.length === 0) {
            return;
        }
        if (!callback) {
            eventList.splice(0, eventList.length);
            return;
        }
        for (let i = 0; i < eventList.length; i++) {
            if (callback === eventList[i]) {
                eventList.splice(i--, 1); // i-- 预防遍历丢失情况
            }
        }
    }
    /**
     * 触发监听函数
     * @param name 监听函数名
     * @param data 数据
     */
    fire(name, data) {
        const key = name.toLowerCase();
        if (!this._eventPool.has(key)) {
            return this;
        }
        const eventList = this._eventPool.get(key);
        if (!eventList) {
            return this;
        }
        let len = eventList.length;
        if (len === 0) {
            return this;
        }
        const params = Object.assign({
            name: key,
            origin: this
        }, data || {});
        for (let i = 0; i < len; i++) {
            const callback = eventList[i];
            callback(params);
            if (eventList.length < len) {
                i--;
                len = eventList.length;
            }
        }
        return this;
    }
    /**
     * 绑定监听函数（仅监听一次）
     * @param name 监听类型名
     * @param callback 监听回调函数
     */
    once(name, callback) {
        const key = name.toLowerCase();
        const nfn = (...args) => {
            this.off(key, nfn);
            callback.apply(this, args);
        };
        this.on(key, nfn);
    }
}

export { Observable };
