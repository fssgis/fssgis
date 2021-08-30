import { getCurrentInstance, onUnmounted, onBeforeUnmount, watch, ref, watchEffect, shallowRef, shallowReactive, inject, provide, reactive } from 'vue';
import { FssgEsri, Basemap, createGeometryFactory, createLayerFactory, MapCursor, MapLayers, MapElement, MapTools, Hawkeye, LayerTree, MapModules, MouseTips, Overlays } from '@fssgis/fssg-esri';
import { whenRightReturn } from '@fssgis/utils';
import '@fssgis/observable';

/* eslint-disable @typescript-eslint/ban-types */
function tryOnUnmounted(callback) {
  if (getCurrentInstance()) {
    onUnmounted(() => callback());
  }
}
function tryOnBeforeUnmounted(callback) {
  if (getCurrentInstance()) {
    onBeforeUnmount(() => callback());
  }
}
function controllableWatch(...args) {
  const createWatch = () => watch(...args);

  let stopHandle;

  function start() {
    var _stopHandle;

    (_stopHandle = stopHandle) === null || _stopHandle === void 0 ? void 0 : _stopHandle();
    stopHandle = createWatch();
  }

  function stop() {
    var _stopHandle2;

    (_stopHandle2 = stopHandle) === null || _stopHandle2 === void 0 ? void 0 : _stopHandle2();
  }

  start();
  tryOnBeforeUnmounted(() => stop());
  return {
    start,
    stop
  };
}
function useObservableOn(handle) {
  tryOnBeforeUnmounted(() => handle.remove());
}

function useEsriWatch(accessor, p, callback, options) {
  let handle;
  const watchStatus = ref(!!(options !== null && options !== void 0 && options.defaultStop));

  const stopWatch = () => watchStatus.value = false;

  const startWatch = () => watchStatus.value = true;

  tryOnBeforeUnmounted(() => stopWatch());
  watchEffect(() => {
    if (watchStatus.value) {
      var _handle;

      (_handle = handle) === null || _handle === void 0 ? void 0 : _handle.remove();
      handle = accessor.watch(p, callback, options === null || options === void 0 ? void 0 : options.sync); // eslint-disable-line
    } else {
      var _handle2;

      (_handle2 = handle) === null || _handle2 === void 0 ? void 0 : _handle2.remove();
      handle = undefined;
    }
  });
  return {
    watchStatus,
    stopWatch,
    startWatch
  };
}
function useWatchRef(accessor, property) {
  const watchRef = ref(accessor[property]);
  const {
    watchStatus,
    ...others
  } = useEsriWatch(accessor, property, val => {
    if (watchRef.value !== val) {
      watchRef.value = val;
    }
  }, {
    defaultStop: true
  });
  const {
    start,
    stop
  } = controllableWatch(watchRef, val => {
    if (val !== accessor[property]) {
      accessor[property] = val;
    }
  });
  watch(watchStatus, status => {
    if (status) {
      watchRef.value = accessor[property];
      start();
    } else {
      stop();
    }
  }, {
    immediate: true
  });
  return {
    watchRef,
    watchStatus,
    ...others
  };
}
function useWatchShallowRef(accessor, property) {
  const watchRef = shallowRef(accessor[property]);
  const {
    watchStatus,
    ...others
  } = useEsriWatch(accessor, property, val => {
    if (watchRef.value !== val) {
      watchRef.value = val;
    }
  }, {
    defaultStop: true
  });
  const {
    start,
    stop
  } = controllableWatch(watchRef, val => {
    if (val !== accessor[property]) {
      accessor[property] = val;
    }
  });
  watchEffect(() => {
    if (watchStatus.value) {
      watchRef.value = accessor[property];
      start();
    } else {
      stop();
    }
  });
  return {
    watchRef,
    watchStatus,
    ...others
  };
}
function useWatchShallowReactive(accessor, properties) {
  const watchReactive = shallowReactive({});
  const {
    watchStatus,
    ...others
  } = useEsriWatch(accessor, properties, (val, _, prop) => {
    if (watchReactive[prop] !== val) {
      watchReactive[prop] = val;
    }
  }, {
    defaultStop: true
  });
  properties.forEach(prop => {
    watchReactive[prop] = accessor[prop];
  });
  watchEffect(() => {
    if (watchStatus.value) {
      properties.forEach(prop => {
        watchReactive[prop] = accessor[prop];
      }); // TODO
    }
  });
  return {
    watchReactive,
    watchStatus,
    ...others
  };
}
function useZoom(fssgEsri) {
  if (!fssgEsri) {
    fssgEsri = useFssgEsri();
  }

  const {
    watchRef: zoom,
    ...others
  } = useWatchRef(fssgEsri.view, 'zoom');
  return {
    zoom,
    ...others
  };
}
function useCenter(fssgEsri) {
  if (!fssgEsri) {
    fssgEsri = useFssgEsri();
  }

  const {
    watchRef: center,
    ...others
  } = useWatchShallowRef(fssgEsri.view, 'center');
  return {
    center,
    ...others
  };
}
function useExtent(fssgEsri) {
  if (!fssgEsri) {
    fssgEsri = useFssgEsri();
  }

  const {
    watchRef: extent,
    ...others
  } = useWatchShallowRef(fssgEsri.view, 'extent');
  return {
    extent,
    ...others
  };
}
function useCenterZoom(fssgEsri) {
  if (!fssgEsri) {
    fssgEsri = useFssgEsri();
  }

  const {
    watchReactive: state,
    ...others
  } = useWatchShallowReactive(fssgEsri.view, ['center', 'zoom']);
  return {
    state,
    ...others
  };
}
const SYMBOL_FSSG_ESRI = Symbol('fssgEsri');
function createFssgEsri(container, options, app) {
  const fssgEsri = new FssgEsri(container, options);

  if (app) {
    app.provide(SYMBOL_FSSG_ESRI, fssgEsri);
  } else {
    provide(SYMBOL_FSSG_ESRI, fssgEsri);
  }

  whenRightReturn(500, () => document.getElementById(container)).then(() => {
    fssgEsri.mount();
  });
  return fssgEsri;
}
function useFssgEsri() {
  return inject(SYMBOL_FSSG_ESRI);
}
function useFssgEsriLoaded(fssgEsri) {
  if (!fssgEsri) {
    fssgEsri = useFssgEsri();
  }

  const loaded = ref(false);
  fssgEsri.when().then(() => loaded.value = true);
  return loaded;
}

function warn(target, msg, ...others) {
  console.warn(`[FssgMap]: ${msg}`, ...others, target);
}

function _getBasemap(arg0) {
  let basemap;

  if (!arg0) {
    const fssgEsri = useFssgEsri();
    basemap = fssgEsri.basemap;

    if (!basemap) {
      warn(this, 'Basemap实例未挂载到FssgMap实例');
    }
  } else {
    if (arg0 instanceof FssgEsri) {
      basemap = arg0.basemap;
    } else {
      basemap = arg0;
    }
  }

  return basemap;
}

function useBasemapSelectedKey(arg0) {
  const basemap = _getBasemap(arg0);

  const selectedKey = ref(basemap.selectedKey);
  controllableWatch(selectedKey, key => {
    if (basemap.selectedKey !== key) {
      basemap.selectedKey = key;
    }
  });
  useObservableOn(basemap.on('changed:selected-key', e => {
    if (e.selectedKey !== selectedKey.value) {
      selectedKey.value = e.selectedKey;
    }
  }));
  return selectedKey;
}
function useBasemapVisible(arg0) {
  const basemap = _getBasemap(arg0);

  const visible = ref(basemap.visible);
  controllableWatch(visible, v => {
    if (basemap.visible !== v) {
      basemap.visible = v;
    }
  });
  useObservableOn(basemap.on('changed:visible', e => {
    if (e.visible !== visible.value) {
      visible.value = e.visible;
    }
  }));
  return visible;
}
function useBasemapState(arg0) {
  const basemap = _getBasemap(arg0);

  const selectedKey = useBasemapSelectedKey(basemap);
  const visible = useBasemapVisible(basemap);
  return {
    basemap,
    selectedKey,
    visible
  };
}
const SYMBOL_BASEMAP = Symbol('FssgEsri.Basemap');
function createBasemap(options, fssgMap, app) {
  const basemap = new Basemap(options);
  fssgMap = fssgMap ?? useFssgEsri();
  fssgMap.use(basemap);

  if (app) {
    app.provide(SYMBOL_BASEMAP, basemap);
  } else {
    provide(SYMBOL_BASEMAP, basemap);
  }

  return basemap;
}
function useBasemap(fssgEsri) {
  return (fssgEsri === null || fssgEsri === void 0 ? void 0 : fssgEsri.basemap) ?? inject(SYMBOL_BASEMAP);
}

const SYMBOL_GEO_FACTORY = Symbol('FssgEsri.GeoFactory');
const SYMBOL_LYR_FACTORY = Symbol('FssgEsri.LyrFactory');
function createGeoFactory(fssgEsri, app) {
  fssgEsri = fssgEsri || useFssgEsri();
  const factory = createGeometryFactory(fssgEsri);

  if (app) {
    app.provide(SYMBOL_GEO_FACTORY, factory);
  } else {
    provide(SYMBOL_GEO_FACTORY, factory);
  }

  return factory;
}
function useGeoFactory() {
  return inject(SYMBOL_GEO_FACTORY);
}
function createLyrFactory(app) {
  const factory = createLayerFactory();

  if (app) {
    app.provide(SYMBOL_LYR_FACTORY, factory);
  } else {
    provide(SYMBOL_LYR_FACTORY, factory);
  }

  return factory;
}
function useLyrFactory() {
  return inject(SYMBOL_LYR_FACTORY);
}

function _getMapCursor(arg0) {
  let mapCursor;

  if (!arg0) {
    const fssgEsri = useFssgEsri();
    mapCursor = fssgEsri.mapCursor;

    if (!mapCursor) {
      warn(this, 'MapCursor实例未挂载到FssgMap实例');
    }
  } else {
    if (arg0 instanceof FssgEsri) {
      mapCursor = arg0.mapCursor;
    } else {
      mapCursor = arg0;
    }
  }

  return mapCursor;
}

function useMapCursorType(arg0) {
  const mapCursor = _getMapCursor(arg0);

  const cursorType = ref(mapCursor.cursorType);
  controllableWatch(cursorType, v => {
    if (mapCursor.cursorType !== v) {
      mapCursor.cursorType = v;
    }
  });
  useObservableOn(mapCursor.on('change', e => {
    if (e.cursorType !== cursorType.value) {
      cursorType.value = e.cursorType;
    }
  }));
  return cursorType;
}
function useMapCursorState(arg0) {
  const mapCursor = _getMapCursor(arg0);

  const cursorType = useMapCursorType(arg0);
  return {
    mapCursor,
    cursorType
  };
}
const SYMBOL_MAPCURSOR = Symbol('FssgEsri.MapCursor');
function createMapCursor(options, fssgEsri, app) {
  const mapCursor = new MapCursor(options);
  fssgEsri = fssgEsri ?? useFssgEsri();
  fssgEsri.use(mapCursor);

  if (app) {
    app.provide(SYMBOL_MAPCURSOR, mapCursor);
  } else {
    provide(SYMBOL_MAPCURSOR, mapCursor);
  }

  return mapCursor;
}
function useMapCursor(fssgEsri) {
  return (fssgEsri === null || fssgEsri === void 0 ? void 0 : fssgEsri.mapCursor) ?? inject(SYMBOL_MAPCURSOR);
}

const SYMBOL_MAPLAYERS = Symbol('FssgEsri.MapLayers');
function createMapLayers(options, fssgEsri, app) {
  const mapLayers = new MapLayers(options);
  fssgEsri = fssgEsri ?? useFssgEsri();
  fssgEsri.use(mapLayers);

  if (app) {
    app.provide(SYMBOL_MAPLAYERS, mapLayers);
  } else {
    provide(SYMBOL_MAPLAYERS, mapLayers);
  }

  return mapLayers;
}
function useMapLayers(fssgEsri) {
  return (fssgEsri === null || fssgEsri === void 0 ? void 0 : fssgEsri.mapLayers) ?? inject(SYMBOL_MAPLAYERS);
}

const SYMBOL_MAPELEMENT = Symbol('FssgEsri.MapElement');
function createMapElement(options, fssgEsri, app) {
  const mapElement = new MapElement(options);
  fssgEsri = fssgEsri ?? useFssgEsri();
  fssgEsri.use(mapElement);

  if (app) {
    app.provide(SYMBOL_MAPELEMENT, mapElement);
  } else {
    provide(SYMBOL_MAPELEMENT, mapElement);
  }

  return mapElement;
}
function useMapElement(fssgEsri) {
  return (fssgEsri === null || fssgEsri === void 0 ? void 0 : fssgEsri.mapElement) ?? inject(SYMBOL_MAPELEMENT);
}

function _getMapTools(arg0) {
  let mapTools;

  if (!arg0) {
    const fssgEsri = useFssgEsri();
    mapTools = fssgEsri.mapTools;

    if (!mapTools) {
      warn(this, 'MapTools实例未挂载到FssgMap实例');
    }
  } else {
    if (arg0 instanceof FssgEsri) {
      mapTools = arg0.mapTools;
    } else {
      mapTools = arg0;
    }
  }

  return mapTools;
}

function useMapToolsActivedKey(arg0) {
  const mapTools = _getMapTools(arg0);

  const activedKey = ref(mapTools.activedKey);
  controllableWatch(activedKey, v => {
    if (mapTools.activedKey !== v) {
      mapTools.activedKey = v;
    }
  });
  useObservableOn(mapTools.on('change', e => {
    if (e.currentKey !== activedKey.value) {
      activedKey.value = e.currentKey;
    }
  }));
  return activedKey;
}
function useMapToolsState(arg0) {
  const mapTools = _getMapTools(arg0);

  const activedKey = useMapToolsActivedKey(arg0);
  return {
    mapTools,
    activedKey
  };
}
const SYMBOL_MAPTOOLS = Symbol('FssgEsri.MapTools');
function createMapTools(options, fssgEsri, app) {
  const mapTools = new MapTools(options);
  fssgEsri = fssgEsri ?? useFssgEsri();
  fssgEsri.use(mapTools);

  if (app) {
    app.provide(SYMBOL_MAPTOOLS, mapTools);
  } else {
    provide(SYMBOL_MAPTOOLS, mapTools);
  }

  return mapTools;
}
function useMapTools(fssgEsri) {
  return (fssgEsri === null || fssgEsri === void 0 ? void 0 : fssgEsri.mapTools) ?? inject(SYMBOL_MAPTOOLS);
}

const SYMBOL_HAWKEYE = Symbol('FssgEsri.Hawkeye');
function createHawkeye(options, fssgEsri, app) {
  const hawkeye = new Hawkeye(options);
  fssgEsri = fssgEsri ?? useFssgEsri();
  fssgEsri.use(hawkeye);

  if (app) {
    app.provide(SYMBOL_HAWKEYE, hawkeye);
  } else {
    provide(SYMBOL_HAWKEYE, hawkeye);
  }

  return hawkeye;
}
function useHawkeye(fssgEsri) {
  return (fssgEsri === null || fssgEsri === void 0 ? void 0 : fssgEsri.hawkeye) ?? inject(SYMBOL_HAWKEYE);
}

const SYMBOL_LAYERTREE = Symbol('FssgEsri.LayerTree');
const SYMBOL_LAYERTREE_STATE = Symbol('FssgEsri.LayerTreeSTATE');
function createLayerTree(options, fssgEsri, app) {
  const layerTree = new LayerTree(options);
  fssgEsri = fssgEsri ?? useFssgEsri();
  fssgEsri.use(layerTree);

  if (app) {
    app.provide(SYMBOL_LAYERTREE, layerTree);
  } else {
    provide(SYMBOL_LAYERTREE, layerTree);
  }

  const state = reactive({
    checkedIds: layerTree.checkedIds,
    treeNodes: layerTree.tree
  });
  layerTree.when(() => {
    watch(() => state.checkedIds, (newValue, oldValue) => {
      if (!oldValue) {
        layerTree.list.forEach(item => {
          if (!item.layerId) {
            return;
          }

          const layer = fssgEsri.mapLayers.findLayer(item.layerId);

          if (!layer) {
            return;
          }

          layer.visible = state.checkedIds.includes(item.id);
        });
        return;
      }

      const insertion = newValue.filter(v => !(oldValue.indexOf(v) > -1));
      const deletion = oldValue.filter(v => !(newValue.indexOf(v) > -1));
      insertion.forEach(nodeId => {
        layerTree.setNodeCheckById(nodeId, true);
      });
      deletion.forEach(nodeId => {
        layerTree.setNodeCheckById(nodeId, false);
      });
    }, {
      immediate: true,
      deep: true
    });
    fssgEsri.mapLayers.on('change:visible', e => {
      const node = layerTree.findNodeFromLayerId(e.options.id);

      if (!node) {
        return;
      }

      if (e.visible && !state.checkedIds.includes(node.id)) {
        state.checkedIds = [...state.checkedIds, node.id];
        return;
      }

      const index = state.checkedIds.indexOf(node.id);

      if (!e.visible && index !== -1) {
        const newArr = [...state.checkedIds];
        newArr.splice(index, 1);
        state.checkedIds = [...newArr];
        return;
      }
    });
  });

  if (app) {
    app.provide(SYMBOL_LAYERTREE_STATE, state);
  } else {
    provide(SYMBOL_LAYERTREE_STATE, state);
  }

  return layerTree;
}
function useLayerTree(fssgEsri) {
  return (fssgEsri === null || fssgEsri === void 0 ? void 0 : fssgEsri.layerTree) ?? inject(SYMBOL_LAYERTREE);
}
function useLayerTreeState() {
  return inject(SYMBOL_LAYERTREE_STATE);
}

function _getMapModules(arg0) {
  let mapModules;

  if (!arg0) {
    const fssgEsri = useFssgEsri();
    mapModules = fssgEsri.mapModules;

    if (!mapModules) {
      warn(this, 'MapModules实例未挂载到FssgMap实例');
    }
  } else {
    if (arg0 instanceof FssgEsri) {
      mapModules = arg0.mapModules;
    } else {
      mapModules = arg0;
    }
  }

  return mapModules;
}

function useMapModulesSelectedTitle(arg0) {
  const mapModules = _getMapModules(arg0);

  const selectedTitle = ref(mapModules.selectedTitle);
  controllableWatch(selectedTitle, key => {
    if (mapModules.selectedTitle !== key) {
      mapModules.selectedTitle = key;
    }
  });
  useObservableOn(mapModules.on('change:selected', e => {
    var _e$item;

    if (((_e$item = e.item) === null || _e$item === void 0 ? void 0 : _e$item.title) !== selectedTitle.value) {
      var _e$item2;

      selectedTitle.value = ((_e$item2 = e.item) === null || _e$item2 === void 0 ? void 0 : _e$item2.title) ?? '';
    }
  }));
  return selectedTitle;
}
const SYMBOL_MAPMODULES = Symbol('FssgEsri.MapModules');
const SYMBOL_MAPMODULES_STATE = Symbol('FssgEsri.MapModulesSTATE');
function createMapModules(options, fssgEsri, app) {
  const mapModules = new MapModules(options);
  fssgEsri = fssgEsri ?? useFssgEsri();
  fssgEsri.use(mapModules);

  if (app) {
    app.provide(SYMBOL_MAPMODULES, mapModules);
  } else {
    provide(SYMBOL_MAPMODULES, mapModules);
  }

  const state = reactive({
    selectedId: ''
  });
  mapModules.when(() => {
    watch(() => state.selectedId, id => {
      mapModules.selectById(id);
    });
    mapModules.on('change:selected', e => {
      var _e$item3;

      if (((_e$item3 = e.item) === null || _e$item3 === void 0 ? void 0 : _e$item3.id) !== state.selectedId) {
        var _e$item4;

        state.selectedId = ((_e$item4 = e.item) === null || _e$item4 === void 0 ? void 0 : _e$item4.id) ?? '';
      }
    });
  });

  if (app) {
    app.provide(SYMBOL_MAPMODULES_STATE, state);
  } else {
    provide(SYMBOL_MAPMODULES_STATE, state);
  }

  return mapModules;
}
function useMapModules(fssgEsri) {
  return (fssgEsri === null || fssgEsri === void 0 ? void 0 : fssgEsri.mapModules) ?? inject(SYMBOL_MAPMODULES);
}
function useMapModulesState() {
  return inject(SYMBOL_MAPMODULES_STATE);
}

const SYMBOL_MOUSETIPS = Symbol('FssgEsri.MouseTips');
function createMouseTips(options, fssgEsri, app) {
  const mouseTips = new MouseTips(options);
  fssgEsri = fssgEsri ?? useFssgEsri();
  fssgEsri.use(mouseTips);

  if (app) {
    app.provide(SYMBOL_MOUSETIPS, mouseTips);
  } else {
    provide(SYMBOL_MOUSETIPS, mouseTips);
  }

  return mouseTips;
}
function useMouseTips(fssgEsri) {
  return (fssgEsri === null || fssgEsri === void 0 ? void 0 : fssgEsri.mouseTips) ?? inject(SYMBOL_MOUSETIPS);
}

const SYMBOL_OVERLAYS = Symbol('FssgEsri.Overlays');
function createOverlays(options, fssgEsri, app) {
  const overlays = new Overlays(options);
  fssgEsri = fssgEsri ?? useFssgEsri();
  fssgEsri.use(overlays);

  if (app) {
    app.provide(SYMBOL_OVERLAYS, overlays);
  } else {
    provide(SYMBOL_OVERLAYS, overlays);
  }

  return overlays;
}
function useOverlays(fssgEsri) {
  return (fssgEsri === null || fssgEsri === void 0 ? void 0 : fssgEsri.overlays) ?? inject(SYMBOL_OVERLAYS);
}

export { controllableWatch, createBasemap, createFssgEsri, createGeoFactory, createHawkeye, createLayerTree, createLyrFactory, createMapCursor, createMapElement, createMapLayers, createMapModules, createMapTools, createMouseTips, createOverlays, tryOnBeforeUnmounted, tryOnUnmounted, useBasemap, useBasemapSelectedKey, useBasemapState, useBasemapVisible, useCenter, useCenterZoom, useEsriWatch, useExtent, useFssgEsri, useFssgEsriLoaded, useGeoFactory, useHawkeye, useLayerTree, useLayerTreeState, useLyrFactory, useMapCursor, useMapCursorState, useMapCursorType, useMapElement, useMapLayers, useMapModules, useMapModulesSelectedTitle, useMapModulesState, useMapTools, useMapToolsActivedKey, useMapToolsState, useMouseTips, useObservableOn, useOverlays, useWatchRef, useWatchShallowReactive, useWatchShallowRef, useZoom };
