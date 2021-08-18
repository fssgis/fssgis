import { FssgEsri, IFssgEsriOptions } from '@fssgis/fssg-esri';
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
    watchReactive: Pick<{
        [K in keyof T]: T[K];
    }, K>;
} & IWatchRef;
declare function useZoom(fssgEsri?: FssgEsri): {
    zoom: Ref<number>;
} & IWatchRef;
declare function useCenter(fssgEsri?: FssgEsri): {
    center: Ref<__esri.Point>;
} & IWatchRef;
declare function useExtent(fssgEsri?: FssgEsri): {
    extent: Ref<__esri.Extent>;
} & IWatchRef;
declare function useCenterZoom(fssgEsri?: FssgEsri): {
    state: {
        center: __esri.Point;
        zoom: number;
    };
} & IWatchRef;
declare function createFssgEsri(container: string, options?: IFssgEsriOptions): FssgEsri;
declare function useFssgEsri(): FssgEsri;
declare function useFssgEsriLoaded(fssgEsri?: FssgEsri): Ref<boolean>;

export { createFssgEsri, useCenter, useCenterZoom, useExtent, useFssgEsri, useFssgEsriLoaded, useWatchRef, useWatchShallowReactive, useWatchShallowRef, useZoom };
