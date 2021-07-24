import { Watcher } from './watcher';
export declare type WatchCallback<T> = (newValue: T, oldValue: T, propertyName: string, target: Watcher) => void;
export interface IHandle<T> {
    propName: string;
    callback: WatchCallback<T>;
}
export interface IWatchHandle {
    remove(): void;
}
