declare type WatchCallback<T> = (newValue: T, oldValue: T, propertyName: string, target: Watcher) => void;
interface IHandle<T> {
    propName: string;
    callback: WatchCallback<T>;
}
declare function observe<T>(cls: T): T;
interface IWatchHandle {
    remove(): void;
}
declare class Watcher {
    private _handles;
    get<T extends keyof this>(propName: T): this[T];
    set<T extends keyof this>(propName: T, propValue: this[T]): this;
    set(prop: {
        [P in keyof this]?: this[P];
    }): this;
    watch<T extends keyof this>(propName: T, callback: (value: this[T], oldValue: this[T], propertyName: T, target: this) => void): IWatchHandle;
    watch<T extends keyof this>(propNames: T[], callback: (value: this[T], oldValue: this[T], propertyName: T, target: this) => void): IWatchHandle;
}

export default Watcher;
export { IHandle, IWatchHandle, WatchCallback, Watcher, observe };
