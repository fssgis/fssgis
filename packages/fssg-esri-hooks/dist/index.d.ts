import { WatchSource, WatchCallback, WatchOptions, Ref, App, ToRefs, Component } from 'vue';
import { IHandle } from '@fssgis/observable';
import { FssgEsri, IFssgEsriOptions, IBasemapOptions, Basemap, GeometryFacory, ILayerFactory, MapCursor, IMapCursorOptions, IMapLayersOptions, MapLayers, IMapElementOptions, MapElement, MapTools, IMapToolsOptions, IHawkeyeOptions, Hawkeye, ILayerTreeOptions, LayerTree, ITreeNode, MapModules, IMapModulesOptions, IMouseTipsOptions, MouseTips, IOverlayAddOptions, Overlays, IOverlaysOptions, IViewCliperOptions, ViewCliper, MapPopups, IMapPopupsOptions } from '@fssgis/fssg-esri';

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
declare function useFssgEsriLoaded(fssgEsri?: FssgEsri): {
    loaded: Ref<boolean>;
} & readonly [Ref<boolean>];
declare function injectFssgEsri(): FssgEsri;
declare type UseFssgEsri = {
    fssgEsri: FssgEsri;
    loaded: Ref<boolean>;
} & readonly [FssgEsri, Ref<boolean>];
declare function useFssgEsri(): UseFssgEsri;

declare function createBasemap(options: IBasemapOptions): Basemap;
declare function createBasemap(options: IBasemapOptions, fssgEsri: FssgEsri, app?: App): Basemap;
declare function injectBasemap(): Basemap;
declare type UseBasemapSelectedKey = {
    selectedKey: Ref<string>;
} & readonly [Ref<string>];
declare function useBasemapSelectedKey(): UseBasemapSelectedKey;
declare function useBasemapSelectedKey(fssgMap: FssgEsri): UseBasemapSelectedKey;
declare function useBasemapSelectedKey(basemap: Basemap): UseBasemapSelectedKey;
declare function useBasemapSelectedKey(arg0?: FssgEsri | Basemap): UseBasemapSelectedKey;
declare type UseBasemapVisible = {
    visible: Ref<boolean>;
} & readonly [Ref<boolean>];
declare function useBasemapVisible(): UseBasemapVisible;
declare function useBasemapVisible(fssgMap: FssgEsri): UseBasemapVisible;
declare function useBasemapVisible(basemap: Basemap): UseBasemapVisible;
declare function useBasemapVisible(arg0?: FssgEsri | Basemap): UseBasemapVisible;
declare type UseBasemap = {
    basemap: Basemap;
    selectedKey: Ref<string>;
    visible: Ref<boolean>;
} & readonly [Basemap, Ref<string>, Ref<boolean>];
declare function useBasemap(): UseBasemap;
declare function useBasemap(fssgEsri: FssgEsri): UseBasemap;
declare function useBasemap(fssgEsri?: FssgEsri): UseBasemap;

declare function createGeoFactory(fssgEsri?: FssgEsri, app?: App): GeometryFacory;
declare function useGeoFactory(): {
    geoFactory: GeometryFacory;
} & readonly [GeometryFacory];
declare function createLyrFactory(app?: App): ILayerFactory;
declare function useLyrFactory(): {
    lyrFactory: ILayerFactory;
} & readonly [ILayerFactory];

declare type UseMapCursorType = {
    cursorType: Ref<string>;
} & readonly [Ref<string>];
declare function useMapCursorType(): UseMapCursorType;
declare function useMapCursorType(fssgMap: FssgEsri): UseMapCursorType;
declare function useMapCursorType(mapCursor: MapCursor): UseMapCursorType;
declare function useMapCursorType(arg0?: FssgEsri | MapCursor): UseMapCursorType;
declare function createMapCursor(options: IMapCursorOptions): MapCursor;
declare function createMapCursor(options: IMapCursorOptions, fssgEsri: FssgEsri, app?: App): MapCursor;
declare function injectMapCursor(): MapCursor;
declare type UseMapCursor = {
    mapCursor: MapCursor;
    cursorType: Ref<string>;
} & readonly [MapCursor, Ref<string>];
declare function useMapCursor(): UseMapCursor;
declare function useMapCursor(fssgEsri: FssgEsri): UseMapCursor;
declare function useMapCursor(fssgEsri?: FssgEsri): UseMapCursor;

declare function createMapLayers(options: IMapLayersOptions): MapLayers;
declare function createMapLayers(options: IMapLayersOptions, fssgEsri: FssgEsri, app?: App): MapLayers;
declare function injectMapLayers(): MapLayers;
declare type UseMapLayers = {
    mapLayers: MapLayers;
} & readonly [MapLayers];
declare function useMapLayers(): UseMapLayers;
declare function useMapLayers(fssgEsri: FssgEsri): UseMapLayers;
declare function useMapLayers(fssgEsri?: FssgEsri): UseMapLayers;

declare function createMapElement(options: IMapElementOptions): MapElement;
declare function createMapElement(options: IMapElementOptions, fssgEsri: FssgEsri, app?: App): MapElement;
declare function injectMapElement(): MapElement;
declare type UseMapElement = {
    mapElement: MapElement;
} & readonly [MapElement];
declare function useMapElement(): UseMapElement;
declare function useMapElement(fssgEsri: FssgEsri): UseMapElement;
declare function useMapElement(fssgEsri?: FssgEsri): UseMapElement;

declare type UseMapToolsActivedKey = {
    activedKey: Ref<string>;
} & readonly [Ref<string>];
declare function useMapToolsActivedKey(): UseMapToolsActivedKey;
declare function useMapToolsActivedKey(fssgMap: FssgEsri): UseMapToolsActivedKey;
declare function useMapToolsActivedKey(mapTools: MapTools): UseMapToolsActivedKey;
declare function useMapToolsActivedKey(arg0?: FssgEsri | MapTools): UseMapToolsActivedKey;
declare function createMapTools(options: IMapToolsOptions): MapTools;
declare function createMapTools(options: IMapToolsOptions, fssgEsri: FssgEsri, app?: App): MapTools;
declare function injectMapTools(): MapTools;
declare type UseMapTools = {
    mapTools: MapTools;
    activedKey: Ref<string>;
} & readonly [MapTools, Ref<string>];
declare function useMapTools(): UseMapTools;
declare function useMapTools(fssgEsri: FssgEsri): UseMapTools;
declare function useMapTools(fssgEsri?: FssgEsri): UseMapTools;

declare function createHawkeye(options: IHawkeyeOptions): Hawkeye;
declare function createHawkeye(options: IHawkeyeOptions, fssgEsri: FssgEsri, app?: App): Hawkeye;
declare type UseHawkeye = {
    hawkeye: Hawkeye;
} & readonly [Hawkeye];
declare function injectHawkeye(): Hawkeye;
declare function useHawkeye(): UseHawkeye;
declare function useHawkeye(fssgEsri: FssgEsri): UseHawkeye;
declare function useHawkeye(fssgEsri?: FssgEsri): UseHawkeye;

interface ILayerTreeState {
    checkedIds: string[];
    treeNodes: ITreeNode[];
}
declare function createLayerTree(options: ILayerTreeOptions): LayerTree;
declare function createLayerTree(options: ILayerTreeOptions, fssgEsri: FssgEsri, app?: App): LayerTree;
declare function injectLayerTree(): LayerTree;
interface IUseLayerTree extends ToRefs<ILayerTreeState> {
    layerTree: LayerTree;
}
declare function useLayerTree(): IUseLayerTree;
declare function useLayerTree(fssgEsri: FssgEsri): IUseLayerTree;
declare function useLayerTree(fssgEsri?: FssgEsri): IUseLayerTree;

interface IUseMapModulesSelectedTitle {
    selectedTitle: Ref<string>;
}
declare function useMapModulesSelectedTitle(): IUseMapModulesSelectedTitle;
declare function useMapModulesSelectedTitle(fssgMap: FssgEsri): IUseMapModulesSelectedTitle;
declare function useMapModulesSelectedTitle(mapModules: MapModules): IUseMapModulesSelectedTitle;
declare function useMapModulesSelectedTitle(arg0?: FssgEsri | MapModules): IUseMapModulesSelectedTitle;
declare function createMapModules(options: IMapModulesOptions): MapModules;
declare function createMapModules(options: IMapModulesOptions, fssgEsri: FssgEsri, app?: App): MapModules;
interface IUseMapModules {
    mapModules: MapModules;
    selectedId: Ref<string>;
    selectedTitle: Ref<string>;
}
declare function useMapModules(): IUseMapModules;
declare function useMapModules(fssgEsri: FssgEsri): IUseMapModules;
declare function useMapModules(fssgEsri?: FssgEsri): IUseMapModules;

declare function createMouseTips(options: IMouseTipsOptions): MouseTips;
declare function createMouseTips(options: IMouseTipsOptions, fssgEsri: FssgEsri, app?: App): MouseTips;
interface IUseMouseTips {
    mouseTips: MouseTips;
}
declare function useMouseTips(): IUseMouseTips;
declare function useMouseTips(fssgEsri: FssgEsri): IUseMouseTips;
declare function useMouseTips(fssgEsri?: FssgEsri): IUseMouseTips;

interface IOverlayState {
    setOverlay<T>(options: Omit<IOverlayAddOptions, 'content'> & {
        component?: Component<T>;
        props?: Partial<T>;
    }): string;
}
declare function useSetOverlays(): IOverlayState;
declare function useSetOverlays(fssgMap: FssgEsri): IOverlayState;
declare function useSetOverlays(overlays: Overlays): IOverlayState;
declare function useSetOverlays(arg0?: FssgEsri | Overlays): IOverlayState;
declare function createOverlays(options: IOverlaysOptions): Overlays;
declare function createOverlays(options: IOverlaysOptions, fssgEsri: FssgEsri, app?: App): Overlays;
declare function injectOverlays(): Overlays;
interface IUseOverlays {
    overlays: Overlays;
    setOverlay<T>(options: Omit<IOverlayAddOptions, 'content'> & {
        component?: Component<T>;
        props?: Partial<T>;
    }): string;
}
declare function useOverlays(): IUseOverlays;
declare function useOverlays(fssgEsri: FssgEsri): IUseOverlays;
declare function useOverlays(fssgEsri?: FssgEsri): IUseOverlays;

declare function createViewCliper(options: IViewCliperOptions): ViewCliper;
declare function createViewCliper(options: IViewCliperOptions, fssgEsri: FssgEsri, app?: App): ViewCliper;
interface IViewCliper {
    viewCliper: ViewCliper;
}
declare function useViewCliper(): IViewCliper;
declare function useViewCliper(fssgEsri: FssgEsri): IViewCliper;
declare function useViewCliper(fssgEsri?: FssgEsri): IViewCliper;

interface IPopupState {
    visible: Ref<boolean>;
    showPopup<T>(xy: number[], // [number, number]
    title: string, component: Component<T>, props?: Partial<T>, options?: __esri.PopupOpenOptions): void;
    cancel(): void;
}
declare function usePopup(): IPopupState;
declare function usePopup(fssgEsri: FssgEsri): IPopupState;
declare function usePopup(mapPopups: MapPopups): IPopupState;
declare function usePopup(arg0?: FssgEsri | MapPopups): IPopupState;
declare function createMapPopups(options: IMapPopupsOptions): MapPopups;
declare function createMapPopups(options: IMapPopupsOptions, fssgEsri: FssgEsri, app?: App): MapPopups;
interface IUseMapPopups {
    mapPopups: MapPopups;
}
declare function useMapPopups(): IUseMapPopups;
declare function useMapPopups(fssgEsri: FssgEsri): IUseMapPopups;
declare function useMapPopups(fssgEsri?: FssgEsri): IUseMapPopups;

export { EsriWatchCallback, IOverlayState, IPopupState, MapOldSources, MapSources, controllableWatch, createBasemap, createFssgEsri, createGeoFactory, createHawkeye, createLayerTree, createLyrFactory, createMapCursor, createMapElement, createMapLayers, createMapModules, createMapPopups, createMapTools, createMouseTips, createOverlays, createViewCliper, injectBasemap, injectFssgEsri, injectHawkeye, injectLayerTree, injectMapCursor, injectMapElement, injectMapLayers, injectMapTools, injectOverlays, tryOnBeforeUnmounted, tryOnUnmounted, useBasemap, useBasemapSelectedKey, useBasemapVisible, useCenter, useCenterZoom, useEsriWatch, useExtent, useFssgEsri, useFssgEsriLoaded, useGeoFactory, useHawkeye, useLayerTree, useLyrFactory, useMapCursor, useMapCursorType, useMapElement, useMapLayers, useMapModules, useMapModulesSelectedTitle, useMapPopups, useMapTools, useMapToolsActivedKey, useMouseTips, useObservableOn, useOverlays, usePopup, useSetOverlays, useViewCliper, useWatchRef, useWatchShallowReactive, useWatchShallowRef, useZoom };
