import { FssgEsri, IFssgEsriOptions, Basemap, IBasemapOptions, GeometryFacory, ILayerFactory, MapCursor, IMapCursorOptions } from '@fssgis/fssg-esri';
import { Ref } from 'vue';

declare type EsriWatchCallback<T extends __esri.Accessor, K extends keyof T> = (newValue: T[K], oldValue: T[K], propertyName: K, target: T) => void;
declare function useEsriWatch<T extends __esri.Accessor, K extends keyof T>(accessor: T, p: K | K[], callback: EsriWatchCallback<T, K>, options?: {
    defaultStop?: boolean;
    sync?: boolean;
}): {
    startWatch(): void;
    stopWatch(): void;
    watchStatus: Ref<boolean>;
};
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
    center: Ref<__esri.Point | number[]>;
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

declare function useBasemapSelectedKey(): Ref<string>;
declare function useBasemapSelectedKey(fssgMap: FssgEsri): Ref<string>;
declare function useBasemapSelectedKey(basemap: Basemap): Ref<string>;
declare function useBasemapSelectedKey(arg0?: FssgEsri | Basemap): Ref<string>;
declare function useBasemapVisible(): Ref<boolean>;
declare function useBasemapVisible(fssgMap: FssgEsri): Ref<boolean>;
declare function useBasemapVisible(basemap: Basemap): Ref<boolean>;
declare function useBasemapVisible(arg0?: FssgEsri | Basemap): Ref<boolean>;
interface IBasemapHook {
    selectedKey: Ref<string>;
    visible: Ref<boolean>;
    basemap: Basemap;
}
declare function useBasemapState(): IBasemapHook;
declare function useBasemapState(fssgMap: FssgEsri): IBasemapHook;
declare function useBasemapState(basemap: Basemap): IBasemapHook;
declare function useBasemapState(arg0?: FssgEsri | Basemap): IBasemapHook;
declare function createBasemap(options: IBasemapOptions): Basemap;
declare function createBasemap(options: IBasemapOptions, fssgMap: FssgEsri): Basemap;
declare function useBasemap(): Basemap;
declare function useBasemap(fssgEsri: FssgEsri): Basemap;
declare function useBasemap(fssgEsri?: FssgEsri): Basemap;

declare function createGeoFactory(fssgEsri?: FssgEsri): GeometryFacory;
declare function useGeoFactory(): GeometryFacory;
declare function createLyrFactory(): ILayerFactory;
declare function useLyrFactory(): ILayerFactory;

interface IMapCursorHook {
    cursorType: Ref<string>;
    mapCursor: MapCursor;
}
declare function useMapCursorType(): Ref<string>;
declare function useMapCursorType(fssgMap: FssgEsri): Ref<string>;
declare function useMapCursorType(mapCursor: MapCursor): Ref<string>;
declare function useMapCursorType(arg0?: FssgEsri | MapCursor): Ref<string>;
declare function useMapCursorState(): IMapCursorHook;
declare function useMapCursorState(fssgMap: FssgEsri): IMapCursorHook;
declare function useMapCursorState(mapCursor: MapCursor): IMapCursorHook;
declare function useMapCursorState(arg0?: FssgEsri | MapCursor): IMapCursorHook;
declare function createMapCursor(options: IMapCursorOptions): MapCursor;
declare function createMapCursor(options: IMapCursorOptions, fssgEsri: FssgEsri): MapCursor;
declare function useMapCursor(): MapCursor;
declare function useMapCursor(fssgEsri: FssgEsri): MapCursor;
declare function useMapCursor(fssgEsri?: FssgEsri): MapCursor;

export { EsriWatchCallback, createBasemap, createFssgEsri, createGeoFactory, createLyrFactory, createMapCursor, useBasemap, useBasemapSelectedKey, useBasemapState, useBasemapVisible, useCenter, useCenterZoom, useEsriWatch, useExtent, useFssgEsri, useFssgEsriLoaded, useGeoFactory, useLyrFactory, useMapCursor, useMapCursorState, useMapCursorType, useWatchRef, useWatchShallowReactive, useWatchShallowRef, useZoom };
