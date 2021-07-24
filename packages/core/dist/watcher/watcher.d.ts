import { IWatchHandle } from './watcher.interface';
/**
 * 观测者类，用以观测对象实例的成员值变化
 */
export declare class Watcher {
    static observe<T>(cls: T): T;
    /** 观测处理器集合 */
    private _handles;
    get<T extends keyof this>(propName: T): this[T];
    set<T extends keyof this>(propName: T, propValue: this[T]): this;
    set(prop: {
        [P in keyof this]?: this[P];
    }): this;
    watch<T extends keyof this>(propName: T, callback: (value: this[T], oldValue: this[T], propertyName: T, target: this) => void): IWatchHandle;
    watch<T extends keyof this>(propNames: T[], callback: (value: this[T], oldValue: this[T], propertyName: T, target: this) => void): IWatchHandle;
}
declare const _default: typeof Watcher;
export default _default;
