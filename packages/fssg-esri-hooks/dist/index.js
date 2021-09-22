import { getCurrentInstance, onUnmounted, onBeforeUnmount, watch, ref, watchEffect, shallowRef, shallowReactive, inject, provide, reactive, toRefs, createVNode, render } from 'vue';
import { FssgEsri, Basemap, createGeometryFactory, createLayerFactory, MapCursor, MapLayers, MapElement, MapTools, Hawkeye, LayerTree, MapModules, MouseTips, Overlays, ViewCliper, MapPopups } from '@fssgis/fssg-esri';
import { whenRightReturn, createIsomorphicDestructurable, createGuid } from '@fssgis/utils';
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
    fssgEsri = injectFssgEsri();
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
    fssgEsri = injectFssgEsri();
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
    fssgEsri = injectFssgEsri();
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
    fssgEsri = injectFssgEsri();
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
function useFssgEsriLoaded(fssgEsri) {
  if (!fssgEsri) {
    fssgEsri = injectFssgEsri();
  }

  const loaded = ref(false);
  fssgEsri.when().then(() => loaded.value = true);
  return createIsomorphicDestructurable({
    loaded
  }, [loaded]);
}
function injectFssgEsri() {
  return inject(SYMBOL_FSSG_ESRI);
}
function useFssgEsri() {
  const fssgEsri = injectFssgEsri();
  const {
    loaded
  } = useFssgEsriLoaded(fssgEsri);
  return createIsomorphicDestructurable({
    fssgEsri,
    loaded
  }, [fssgEsri, loaded]);
}

function warn(target, msg, ...others) {
  console.warn(`[FssgMap]: ${msg}`, ...others, target);
}

function _getBasemap(arg0) {
  let basemap;

  if (!arg0) {
    const fssgEsri = injectFssgEsri();
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

const SYMBOL_BASEMAP = Symbol('FssgEsri.Basemap');
function createBasemap(options, fssgEsri, app) {
  const basemap = new Basemap(options);
  fssgEsri = fssgEsri ?? injectFssgEsri();
  fssgEsri.use(basemap);

  if (app) {
    app.provide(SYMBOL_BASEMAP, basemap);
  } else {
    provide(SYMBOL_BASEMAP, basemap);
  }

  return basemap;
}
function injectBasemap() {
  return inject(SYMBOL_BASEMAP);
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
  return createIsomorphicDestructurable({
    selectedKey
  }, [selectedKey]);
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
  return createIsomorphicDestructurable({
    visible
  }, [visible]);
}
function useBasemap(fssgEsri) {
  const basemap = (fssgEsri === null || fssgEsri === void 0 ? void 0 : fssgEsri.basemap) ?? injectBasemap();
  const {
    selectedKey
  } = useBasemapSelectedKey(basemap);
  const {
    visible
  } = useBasemapVisible(basemap);
  return createIsomorphicDestructurable({
    basemap,
    selectedKey,
    visible
  }, [basemap, selectedKey, visible]);
}

const SYMBOL_GEO_FACTORY = Symbol('FssgEsri.GeoFactory');
const SYMBOL_LYR_FACTORY = Symbol('FssgEsri.LyrFactory');
function createGeoFactory(fssgEsri, app) {
  fssgEsri = fssgEsri || useFssgEsri().fssgEsri;
  const factory = createGeometryFactory(fssgEsri);

  if (app) {
    app.provide(SYMBOL_GEO_FACTORY, factory);
  } else {
    provide(SYMBOL_GEO_FACTORY, factory);
  }

  return factory;
}
function useGeoFactory() {
  const geoFactory = inject(SYMBOL_GEO_FACTORY);
  return createIsomorphicDestructurable({
    geoFactory
  }, [geoFactory]);
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
  const lyrFactory = inject(SYMBOL_LYR_FACTORY);
  return createIsomorphicDestructurable({
    lyrFactory
  }, [lyrFactory]);
}

function _getMapCursor(arg0) {
  let mapCursor;

  if (!arg0) {
    const fssgEsri = injectFssgEsri();
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
  return createIsomorphicDestructurable({
    cursorType
  }, [cursorType]);
}
const SYMBOL_MAPCURSOR = Symbol('FssgEsri.MapCursor');
function createMapCursor(options, fssgEsri, app) {
  const mapCursor = new MapCursor(options);
  fssgEsri = fssgEsri ?? injectFssgEsri();
  fssgEsri.use(mapCursor);

  if (app) {
    app.provide(SYMBOL_MAPCURSOR, mapCursor);
  } else {
    provide(SYMBOL_MAPCURSOR, mapCursor);
  }

  return mapCursor;
}
function injectMapCursor() {
  return inject(SYMBOL_MAPCURSOR);
}
function useMapCursor(fssgEsri) {
  const mapCursor = (fssgEsri === null || fssgEsri === void 0 ? void 0 : fssgEsri.mapCursor) ?? injectMapCursor();
  const {
    cursorType
  } = useMapCursorType();
  return createIsomorphicDestructurable({
    mapCursor,
    cursorType
  }, [mapCursor, cursorType]);
}

const SYMBOL_MAPLAYERS = Symbol('FssgEsri.MapLayers');
function createMapLayers(options, fssgEsri, app) {
  const mapLayers = new MapLayers(options);
  fssgEsri = fssgEsri ?? injectFssgEsri();
  fssgEsri.use(mapLayers);

  if (app) {
    app.provide(SYMBOL_MAPLAYERS, mapLayers);
  } else {
    provide(SYMBOL_MAPLAYERS, mapLayers);
  }

  return mapLayers;
}
function injectMapLayers() {
  return inject(SYMBOL_MAPLAYERS);
}
function useMapLayers(fssgEsri) {
  const mapLayers = (fssgEsri === null || fssgEsri === void 0 ? void 0 : fssgEsri.mapLayers) ?? injectMapLayers();
  return createIsomorphicDestructurable({
    mapLayers
  }, [mapLayers]);
}

const SYMBOL_MAPELEMENT = Symbol('FssgEsri.MapElement');
function createMapElement(options, fssgEsri, app) {
  const mapElement = new MapElement(options);
  fssgEsri = fssgEsri ?? injectFssgEsri();
  fssgEsri.use(mapElement);

  if (app) {
    app.provide(SYMBOL_MAPELEMENT, mapElement);
  } else {
    provide(SYMBOL_MAPELEMENT, mapElement);
  }

  return mapElement;
}
function injectMapElement() {
  return inject(SYMBOL_MAPELEMENT);
}
function useMapElement(fssgEsri) {
  const mapElement = (fssgEsri === null || fssgEsri === void 0 ? void 0 : fssgEsri.mapElement) ?? injectMapElement();
  return createIsomorphicDestructurable({
    mapElement
  }, [mapElement]);
}

function _getMapTools(arg0) {
  let mapTools;

  if (!arg0) {
    const fssgEsri = injectFssgEsri();
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
  return createIsomorphicDestructurable({
    activedKey
  }, [activedKey]);
}
const SYMBOL_MAPTOOLS = Symbol('FssgEsri.MapTools');
function createMapTools(options, fssgEsri, app) {
  const mapTools = new MapTools(options);
  fssgEsri = fssgEsri ?? injectFssgEsri();
  fssgEsri.use(mapTools);

  if (app) {
    app.provide(SYMBOL_MAPTOOLS, mapTools);
  } else {
    provide(SYMBOL_MAPTOOLS, mapTools);
  }

  return mapTools;
}
function injectMapTools() {
  return inject(SYMBOL_MAPTOOLS);
}
function useMapTools(fssgEsri) {
  const mapTools = (fssgEsri === null || fssgEsri === void 0 ? void 0 : fssgEsri.mapTools) ?? injectMapTools();
  const {
    activedKey
  } = useMapToolsActivedKey(fssgEsri);
  return createIsomorphicDestructurable({
    mapTools,
    activedKey
  }, [mapTools, activedKey]);
}

const SYMBOL_HAWKEYE = Symbol('FssgEsri.Hawkeye');
function createHawkeye(options, fssgEsri, app) {
  const hawkeye = new Hawkeye(options);
  fssgEsri = fssgEsri ?? injectFssgEsri();
  fssgEsri.use(hawkeye);

  if (app) {
    app.provide(SYMBOL_HAWKEYE, hawkeye);
  } else {
    provide(SYMBOL_HAWKEYE, hawkeye);
  }

  return hawkeye;
}
function injectHawkeye() {
  return inject(SYMBOL_HAWKEYE);
}
function useHawkeye(fssgEsri) {
  const hawkeye = (fssgEsri === null || fssgEsri === void 0 ? void 0 : fssgEsri.hawkeye) ?? injectHawkeye();
  return createIsomorphicDestructurable({
    hawkeye
  }, [hawkeye]);
}

const SYMBOL_LAYERTREE = Symbol('FssgEsri.LayerTree');
const SYMBOL_LAYERTREE_STATE = Symbol('FssgEsri.LayerTreeSTATE');
function createLayerTree(options, fssgEsri, app) {
  const layerTree = new LayerTree(options);
  fssgEsri = fssgEsri ?? injectFssgEsri();
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
function injectLayerTree() {
  return inject(SYMBOL_LAYERTREE);
}
function useLayerTree(fssgEsri) {
  const layerTree = (fssgEsri === null || fssgEsri === void 0 ? void 0 : fssgEsri.layerTree) ?? injectLayerTree();
  return {
    layerTree,
    ...toRefs(inject(SYMBOL_LAYERTREE_STATE))
  };
}

function _getMapModules(arg0) {
  let mapModules;

  if (!arg0) {
    const {
      fssgEsri
    } = useFssgEsri();
    mapModules = fssgEsri.mapModules;
  } else {
    if (arg0 instanceof FssgEsri) {
      mapModules = arg0.mapModules;
    } else {
      mapModules = arg0;
    }
  }

  if (!mapModules) {
    warn(this, 'MapModules实例未挂载到FssgMap实例');
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
  return {
    selectedTitle
  };
}
const SYMBOL_MAPMODULES = Symbol('FssgEsri.MapModules');
const SYMBOL_MAPMODULES_STATE = Symbol('FssgEsri.MapModulesSTATE');
function createMapModules(options, fssgEsri, app) {
  const mapModules = new MapModules(options);
  fssgEsri = fssgEsri ?? useFssgEsri().fssgEsri;
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
  const mapModules = (fssgEsri === null || fssgEsri === void 0 ? void 0 : fssgEsri.mapModules) ?? inject(SYMBOL_MAPMODULES);
  const {
    selectedId
  } = toRefs(inject(SYMBOL_MAPMODULES_STATE));
  return {
    mapModules,
    selectedId,
    ...useMapModulesSelectedTitle(mapModules)
  };
}

const SYMBOL_MOUSETIPS = Symbol('FssgEsri.MouseTips');
function createMouseTips(options, fssgEsri, app) {
  const mouseTips = new MouseTips(options);
  fssgEsri = fssgEsri ?? useFssgEsri().fssgEsri;
  fssgEsri.use(mouseTips);

  if (app) {
    app.provide(SYMBOL_MOUSETIPS, mouseTips);
  } else {
    provide(SYMBOL_MOUSETIPS, mouseTips);
  }

  return mouseTips;
}
function useMouseTips(fssgEsri) {
  const mouseTips = (fssgEsri === null || fssgEsri === void 0 ? void 0 : fssgEsri.mouseTips) ?? inject(SYMBOL_MOUSETIPS);
  return {
    mouseTips
  };
}

function _getOverlays(arg0) {
  let overlays;

  if (!arg0) {
    const {
      fssgEsri
    } = useFssgEsri();
    overlays = fssgEsri.overlays;

    if (!overlays) {
      warn(this, 'Overlays实例未挂载到FssgMap实例');
    }
  } else {
    if (arg0 instanceof FssgEsri) {
      overlays = arg0.overlays;
    } else {
      overlays = arg0;
    }
  }

  return overlays;
}

function useSetOverlays(arg0) {
  var _getCurrentInstance;

  const overlays = _getOverlays(arg0);

  const app = (_getCurrentInstance = getCurrentInstance()) === null || _getCurrentInstance === void 0 ? void 0 : _getCurrentInstance.appContext;
  return {
    setOverlay(options) {
      let content;
      const id = options.id ?? createGuid();

      if (options.component) {
        content = (() => {
          const dom = document.createElement('div');
          const vm = createVNode(options.component, options.props);
          vm.appContext = app;
          render(vm, dom);
          return dom.firstElementChild;
        })();
      }

      overlays.add({
        content: content ?? '',
        ...options,
        id
      });
      return id;
    }

  };
}
const SYMBOL_OVERLAYS = Symbol('FssgEsri.Overlays');
function createOverlays(options, fssgEsri, app) {
  const overlays = new Overlays(options);
  fssgEsri = fssgEsri ?? useFssgEsri().fssgEsri;
  fssgEsri.use(overlays);

  if (app) {
    app.provide(SYMBOL_OVERLAYS, overlays);
  } else {
    provide(SYMBOL_OVERLAYS, overlays);
  }

  return overlays;
}
function useOverlays(fssgEsri) {
  const overlays = (fssgEsri === null || fssgEsri === void 0 ? void 0 : fssgEsri.overlays) ?? inject(SYMBOL_OVERLAYS);
  return {
    overlays,
    ...useSetOverlays(overlays)
  };
}

const SYMBOL_VIEWCLIPER$1 = Symbol('FssgEsri.ViewCliper');
function createViewCliper(options, fssgEsri, app) {
  const viewCliper = new ViewCliper(options);
  fssgEsri = fssgEsri ?? useFssgEsri().fssgEsri;
  fssgEsri.use(viewCliper);

  if (app) {
    app.provide(SYMBOL_VIEWCLIPER$1, viewCliper);
  } else {
    provide(SYMBOL_VIEWCLIPER$1, viewCliper);
  }

  return viewCliper;
}
function useViewCliper(fssgEsri) {
  const viewCliper = (fssgEsri === null || fssgEsri === void 0 ? void 0 : fssgEsri.viewCliper) ?? inject(SYMBOL_VIEWCLIPER$1);
  return {
    viewCliper
  };
}

function usePopup(arg0) {
  var _getCurrentInstance;

  const mapPopups = _getMapPopups(arg0);

  const app = (_getCurrentInstance = getCurrentInstance()) === null || _getCurrentInstance === void 0 ? void 0 : _getCurrentInstance.appContext;
  const visible = ref(mapPopups.visible);
  mapPopups.$.view.watch('popup.visible', v => {
    if (v !== visible.value) {
      visible.value = v;
    }
  });
  return {
    visible,

    showPopup([x, y], title, component, props, options) {
      const content = (() => {
        const dom = document.createElement('div');
        const vm = createVNode(component, props);
        vm.appContext = app;
        render(vm, dom);
        return dom;
      })();

      mapPopups.openByXY({
        x,
        y
      }, {
        title,
        content,
        ...(options ?? {})
      });
    },

    cancel() {
      mapPopups.cancel();
    }

  };
}

function _getMapPopups(arg0) {
  let mapPopups;

  if (!arg0) {
    const {
      fssgEsri
    } = useFssgEsri();
    mapPopups = fssgEsri.mapPopups;

    if (!mapPopups) {
      warn(this, 'MapPopups实例未挂载到FssgMap实例');
    }
  } else {
    if (arg0 instanceof FssgEsri) {
      mapPopups = arg0.mapPopups;
    } else {
      mapPopups = arg0;
    }
  }

  return mapPopups;
}

const SYMBOL_VIEWCLIPER = Symbol('FssgEsri.MapPopups');
function createMapPopups(options, fssgEsri, app) {
  const mapPopups = new MapPopups(options);
  fssgEsri = fssgEsri ?? useFssgEsri().fssgEsri;
  fssgEsri.use(mapPopups);

  if (app) {
    app.provide(SYMBOL_VIEWCLIPER, mapPopups);
  } else {
    provide(SYMBOL_VIEWCLIPER, mapPopups);
  }

  return mapPopups;
}
function useMapPopups(fssgEsri) {
  const mapPopups = (fssgEsri === null || fssgEsri === void 0 ? void 0 : fssgEsri.mapPopups) ?? inject(SYMBOL_VIEWCLIPER);
  return {
    mapPopups
  };
}

export { controllableWatch, createBasemap, createFssgEsri, createGeoFactory, createHawkeye, createLayerTree, createLyrFactory, createMapCursor, createMapElement, createMapLayers, createMapModules, createMapPopups, createMapTools, createMouseTips, createOverlays, createViewCliper, injectBasemap, injectFssgEsri, injectHawkeye, injectLayerTree, injectMapCursor, injectMapElement, injectMapLayers, injectMapTools, tryOnBeforeUnmounted, tryOnUnmounted, useBasemap, useBasemapSelectedKey, useBasemapVisible, useCenter, useCenterZoom, useEsriWatch, useExtent, useFssgEsri, useFssgEsriLoaded, useGeoFactory, useHawkeye, useLayerTree, useLyrFactory, useMapCursor, useMapCursorType, useMapElement, useMapLayers, useMapModules, useMapModulesSelectedTitle, useMapPopups, useMapTools, useMapToolsActivedKey, useMouseTips, useObservableOn, useOverlays, usePopup, useSetOverlays, useViewCliper, useWatchRef, useWatchShallowReactive, useWatchShallowRef, useZoom };
