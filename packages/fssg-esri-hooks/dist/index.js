import { FssgEsri } from '@fssgis/fssg-esri';
import { getCurrentInstance, onUnmounted, onBeforeUnmount, watch, ref, watchEffect, shallowRef, shallowReactive, inject, provide } from 'vue';
import { whenRightReturn } from '@fssgis/utils';

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

function useEsriWatch(accessor, property, callback, options) {
  let handle;
  const watchStatus = ref(!!(options !== null && options !== void 0 && options.defaultStop));

  const stopWatch = () => watchStatus.value = false;

  const startWatch = () => watchStatus.value = true;

  tryOnBeforeUnmounted(() => stopWatch());
  watchEffect(() => {
    if (watchStatus.value) {
      var _handle;

      (_handle = handle) === null || _handle === void 0 ? void 0 : _handle.remove();
      handle = accessor.watch(property, callback, options === null || options === void 0 ? void 0 : options.sync); // eslint-disable-line
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
  let handle;
  const watchReactive = shallowReactive({});
  const watchStatus = ref(true);

  const stopWatch = () => watchStatus.value = false;

  const startWatch = () => watchStatus.value = true;

  properties.forEach(prop => {
    watchReactive[prop] = accessor[prop];
  });
  watchEffect(() => {
    if (watchStatus.value) {
      var _handle3;

      (_handle3 = handle) === null || _handle3 === void 0 ? void 0 : _handle3.remove();
      properties.forEach(prop => {
        watchReactive[prop] = accessor[prop];
      });
      handle = accessor.watch(properties, (val, _, prop) => {
        watchReactive[prop] = val;
      });
    } else {
      var _handle4;

      (_handle4 = handle) === null || _handle4 === void 0 ? void 0 : _handle4.remove();
      handle = undefined;
    }
  });
  tryOnUnmounted(() => stopWatch());
  return {
    watchReactive,
    startWatch,
    stopWatch,
    watchStatus
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

export { createFssgEsri, useCenter, useCenterZoom, useEsriWatch, useExtent, useFssgEsri, useFssgEsriLoaded, useWatchRef, useWatchShallowReactive, useWatchShallowRef, useZoom };
