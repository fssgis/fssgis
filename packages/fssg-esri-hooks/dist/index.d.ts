import { WatchSource, WatchCallback, WatchOptions, Ref, App, Component } from 'vue';
import { IHandle } from '@fssgis/observable';
import { FssgEsri, IFssgEsriOptions, Basemap, IBasemapOptions, GeometryFacory, ILayerFactory, MapCursor, IMapCursorOptions, IMapLayersOptions, MapLayers, IMapElementOptions, MapElement, MapTools, IMapToolsOptions, IHawkeyeOptions, Hawkeye, ILayerTreeOptions, LayerTree, ITreeNode, MapModules, IMapModulesOptions, IMouseTipsOptions, MouseTips, IOverlayAddOptions, Overlays, IOverlaysOptions } from '@fssgis/fssg-esri';

declare type MapSources<T> = {
    [K in keyof T]: T[K] extends WatchSource<infer V> ? V : never;
};
declare type MapOldSources<T, Immediate> = {
    [K in keyof T]: T[K] extends WatchSource<infer V> ? Immediate extends true ? V | undefined : V : never;
};
declare function tryOnUnmounted(callback: () => void): void;
declare function tryOnBeforeUnmounted(callback: () => void): void;
declare function controllableWatch(sources: (object | WatchSource<unknown>)[], cb: WatchCallback<(object | WatchSource<unknown>)[], (object | WatchSource<unknown>)[]>, options?: WatchOptions<false> | undefined): {
    start(): void;
    stop: () => void;
};
declare function controllableWatch<T extends readonly (object | WatchSource<unknown>)[], Immediate extends Readonly<boolean> = false>(source: T, cb: WatchCallback<MapOldSources<T, false>, MapOldSources<T, Immediate>>, options?: WatchOptions<Immediate> | undefined): {
    start(): void;
    stop: () => void;
};
declare function controllableWatch<T, Immediate extends Readonly<boolean> = false>(source: WatchSource<T>, cb: WatchCallback<T, Immediate extends true ? T | undefined : T>, options?: WatchOptions<Immediate> | undefined): {
    start(): void;
    stop: () => void;
};
declare function controllableWatch<T extends object, Immediate extends Readonly<boolean> = false>(source: T, cb: WatchCallback<T, Immediate extends true ? T | undefined : T>, options?: WatchOptions<Immediate> | undefined): {
    start(): void;
    stop: () => void;
};
declare function useObservableOn(handle: IHandle): void;

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
declare function createFssgEsri(container: string, options?: IFssgEsriOptions, app?: App): FssgEsri;
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
declare function createBasemap(options: IBasemapOptions, fssgMap: FssgEsri, app?: App): Basemap;
declare function useBasemap(): Basemap;
declare function useBasemap(fssgEsri: FssgEsri): Basemap;
declare function useBasemap(fssgEsri?: FssgEsri): Basemap;

declare function createGeoFactory(fssgEsri?: FssgEsri, app?: App): GeometryFacory;
declare function useGeoFactory(): GeometryFacory;
declare function createLyrFactory(app?: App): ILayerFactory;
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
declare function createMapCursor(options: IMapCursorOptions, fssgEsri: FssgEsri, app?: App): MapCursor;
declare function useMapCursor(): MapCursor;
declare function useMapCursor(fssgEsri: FssgEsri): MapCursor;
declare function useMapCursor(fssgEsri?: FssgEsri): MapCursor;

declare function createMapLayers(options: IMapLayersOptions): MapLayers;
declare function createMapLayers(options: IMapLayersOptions, fssgEsri: FssgEsri, app?: App): MapLayers;
declare function useMapLayers(): MapLayers;
declare function useMapLayers(fssgEsri: FssgEsri): MapLayers;
declare function useMapLayers(fssgEsri?: FssgEsri): MapLayers;

declare function createMapElement(options: IMapElementOptions): MapElement;
declare function createMapElement(options: IMapElementOptions, fssgEsri: FssgEsri, app?: App): MapElement;
declare function useMapElement(): MapElement;
declare function useMapElement(fssgEsri: FssgEsri): MapElement;
declare function useMapElement(fssgEsri?: FssgEsri): MapElement;

interface IMapToolsHook {
    activedKey: Ref<string>;
    mapTools: MapTools;
}
declare function useMapToolsActivedKey(): Ref<string>;
declare function useMapToolsActivedKey(fssgMap: FssgEsri): Ref<string>;
declare function useMapToolsActivedKey(mapTools: MapTools): Ref<string>;
declare function useMapToolsActivedKey(arg0?: FssgEsri | MapTools): Ref<string>;
declare function useMapToolsState(): IMapToolsHook;
declare function useMapToolsState(fssgMap: FssgEsri): IMapToolsHook;
declare function useMapToolsState(mapTools: MapTools): IMapToolsHook;
declare function useMapToolsState(arg0?: FssgEsri | MapTools): IMapToolsHook;
declare function createMapTools(options: IMapToolsOptions): MapTools;
declare function createMapTools(options: IMapToolsOptions, fssgEsri: FssgEsri, app?: App): MapTools;
declare function useMapTools(): MapTools;
declare function useMapTools(fssgEsri: FssgEsri): MapTools;
declare function useMapTools(fssgEsri?: FssgEsri): MapTools;

declare function createHawkeye(options: IHawkeyeOptions): Hawkeye;
declare function createHawkeye(options: IHawkeyeOptions, fssgEsri: FssgEsri, app?: App): Hawkeye;
declare function useHawkeye(): Hawkeye;
declare function useHawkeye(fssgEsri: FssgEsri): Hawkeye;
declare function useHawkeye(fssgEsri?: FssgEsri): Hawkeye;

interface ILayerTreeState {
    checkedIds: string[];
    treeNodes: ITreeNode[];
}
declare function createLayerTree(options: ILayerTreeOptions): LayerTree;
declare function createLayerTree(options: ILayerTreeOptions, fssgEsri: FssgEsri, app?: App): LayerTree;
declare function useLayerTree(): LayerTree;
declare function useLayerTree(fssgEsri: FssgEsri): LayerTree;
declare function useLayerTree(fssgEsri?: FssgEsri): LayerTree;
declare function useLayerTreeState(): ILayerTreeState;

declare function useMapModulesSelectedTitle(): Ref<string>;
declare function useMapModulesSelectedTitle(fssgMap: FssgEsri): Ref<string>;
declare function useMapModulesSelectedTitle(mapModules: MapModules): Ref<string>;
declare function useMapModulesSelectedTitle(arg0?: FssgEsri | MapModules): Ref<string>;
interface IMapModulesState {
    selectedId: string;
}
declare function createMapModules(options: IMapModulesOptions): MapModules;
declare function createMapModules(options: IMapModulesOptions, fssgEsri: FssgEsri, app?: App): MapModules;
declare function useMapModules(): MapModules;
declare function useMapModules(fssgEsri: FssgEsri): MapModules;
declare function useMapModules(fssgEsri?: FssgEsri): MapModules;
declare function useMapModulesState(): IMapModulesState;

declare function createMouseTips(options: IMouseTipsOptions): MouseTips;
declare function createMouseTips(options: IMouseTipsOptions, fssgEsri: FssgEsri, app?: App): MouseTips;
declare function useMouseTips(): MouseTips;
declare function useMouseTips(fssgEsri: FssgEsri): MouseTips;
declare function useMouseTips(fssgEsri?: FssgEsri): MouseTips;

interface IOverlayState {
    setOverlay<T>(options: Omit<IOverlayAddOptions, 'content'> & {
        component?: Component<T>;
        props?: Partial<T>;
    }): void;
}
declare function useSetOverlays(): IOverlayState;
declare function useSetOverlays(fssgMap: FssgEsri): IOverlayState;
declare function useSetOverlays(overlays: Overlays): IOverlayState;
declare function useSetOverlays(arg0?: FssgEsri | Overlays): IOverlayState;
declare function createOverlays(options: IOverlaysOptions): Overlays;
declare function createOverlays(options: IOverlaysOptions, fssgEsri: FssgEsri, app?: App): Overlays;
declare function useOverlays(): Overlays;
declare function useOverlays(fssgEsri: FssgEsri): Overlays;
declare function useOverlays(fssgEsri?: FssgEsri): Overlays;

export { EsriWatchCallback, IOverlayState, MapOldSources, MapSources, controllableWatch, createBasemap, createFssgEsri, createGeoFactory, createHawkeye, createLayerTree, createLyrFactory, createMapCursor, createMapElement, createMapLayers, createMapModules, createMapTools, createMouseTips, createOverlays, tryOnBeforeUnmounted, tryOnUnmounted, useBasemap, useBasemapSelectedKey, useBasemapState, useBasemapVisible, useCenter, useCenterZoom, useEsriWatch, useExtent, useFssgEsri, useFssgEsriLoaded, useGeoFactory, useHawkeye, useLayerTree, useLayerTreeState, useLyrFactory, useMapCursor, useMapCursorState, useMapCursorType, useMapElement, useMapLayers, useMapModules, useMapModulesSelectedTitle, useMapModulesState, useMapTools, useMapToolsActivedKey, useMapToolsState, useMouseTips, useObservableOn, useOverlays, useSetOverlays, useWatchRef, useWatchShallowReactive, useWatchShallowRef, useZoom };
