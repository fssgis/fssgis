import { FssgEsri } from '@fssgis/fssg-esri';
import { Ref } from 'vue';

interface IWatchRef {
    watchStatus: Ref<boolean>;
    stopWatch(): void;
    startWatch(): void;
}
declare function useWatchRef<T extends __esri.Accessor, K extends keyof T>(accessor: T, property: K): {
    watchRef: Ref<T[K]>;
} & IWatchRef;
declare function useWatchShallowRef<T extends __esri.Accessor, K extends keyof T>(accessor: T, property: K): {
    watchRef: Ref<T[K]>;
} & IWatchRef;
declare function useWatchShallowReactive<T extends __esri.Accessor, K extends keyof T>(accessor: T, properties: K[]): {
    watchReactive: Record<K, T[K]>;
} & IWatchRef;
declare function useZoom(fssgEsri: FssgEsri): {
    zoom: Ref<number>;
} & IWatchRef;
declare function useCenter(fssgEsri: FssgEsri): {
    center: Ref<__esri.Point>;
} & IWatchRef;

export { useCenter, useWatchRef, useWatchShallowReactive, useWatchShallowRef, useZoom };
