import { FssgEsri, Basemap, createGeometryFactory, createLayerFactory } from '@fssgis/fssg-esri';
import { getCurrentInstance, onBeforeUnmount, watch, ref, watchEffect, shallowRef, shallowReactive, inject, provide } from 'vue';
import { whenRightReturn } from '@fssgis/utils';

/* eslint-disable @typescript-eslint/ban-types */
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
function createFssgEsri(container, options) {
  const fssgEsri = new FssgEsri(container, options);
  provide(SYMBOL_FSSG_ESRI, fssgEsri);
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

function _getBasemap(arg0) {
  let basemap;

  if (!arg0) {
    const fssgEsri = useFssgEsri();
    basemap = fssgEsri.basemap;
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
function createBasemap(options, fssgMap) {
  const basemap = new Basemap(options);
  fssgMap = fssgMap ?? useFssgEsri();
  fssgMap.use(basemap);
  provide(SYMBOL_BASEMAP, basemap);
  return basemap;
}
function useBasemap(fssgEsri) {
  return (fssgEsri === null || fssgEsri === void 0 ? void 0 : fssgEsri.basemap) ?? inject(SYMBOL_BASEMAP);
}

const SYMBOL_GEO_FACTORY = Symbol('FssgEsri.GeoFactory');
const SYMBOL_LYR_FACTORY = Symbol('FssgEsri.LyrFactory');
function createGeoFactory(fssgEsri) {
  fssgEsri = fssgEsri || useFssgEsri();
  const factory = createGeometryFactory(fssgEsri);
  provide(SYMBOL_GEO_FACTORY, factory);
  return factory;
}
function useGeoFactory() {
  return inject(SYMBOL_GEO_FACTORY);
}
function createLyrFactory() {
  const factory = createLayerFactory();
  provide(SYMBOL_LYR_FACTORY, factory);
  return factory;
}
function useLyrFactory() {
  return inject(SYMBOL_LYR_FACTORY);
}

export { createBasemap, createFssgEsri, createGeoFactory, createLyrFactory, useBasemap, useBasemapSelectedKey, useBasemapState, useBasemapVisible, useCenter, useCenterZoom, useEsriWatch, useExtent, useFssgEsri, useFssgEsriLoaded, useGeoFactory, useLyrFactory, useWatchRef, useWatchShallowReactive, useWatchShallowRef, useZoom };
