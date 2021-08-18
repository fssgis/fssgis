import { FssgEsri } from '@fssgis/fssg-esri';
import { ref, watchEffect, getCurrentInstance, onUnmounted, shallowRef, shallowReactive, inject, provide } from 'vue';
import { whenRightReturn } from '@fssgis/utils';

function useWatchRef(accessor, property) {
  let handle;
  const watchRef = ref(accessor[property]);
  const watchStatus = ref(true);

  const stopWatch = () => watchStatus.value = false;

  const startWatch = () => watchStatus.value = true;

  watchEffect(() => {
    if (watchStatus.value) {
      var _handle;

      (_handle = handle) === null || _handle === void 0 ? void 0 : _handle.remove();
      watchRef.value = accessor[property];
      handle = accessor.watch(property, val => watchRef.value = val);
    } else {
      var _handle2;

      (_handle2 = handle) === null || _handle2 === void 0 ? void 0 : _handle2.remove();
      handle = undefined;
    }
  });

  if (getCurrentInstance()) {
    onUnmounted(() => stopWatch());
  }

  return {
    watchRef,
    startWatch,
    stopWatch,
    watchStatus
  };
}
function useWatchShallowRef(accessor, property) {
  let handle;
  const watchRef = shallowRef(accessor[property]);
  const watchStatus = ref(true);

  const stopWatch = () => watchStatus.value = false;

  const startWatch = () => watchStatus.value = true;

  watchEffect(() => {
    if (watchStatus.value) {
      var _handle3;

      (_handle3 = handle) === null || _handle3 === void 0 ? void 0 : _handle3.remove();
      watchRef.value = accessor[property];
      handle = accessor.watch(property, val => watchRef.value = val);
    } else {
      var _handle4;

      (_handle4 = handle) === null || _handle4 === void 0 ? void 0 : _handle4.remove();
      handle = undefined;
    }
  });

  if (getCurrentInstance()) {
    onUnmounted(() => stopWatch());
  }

  return {
    watchRef,
    startWatch,
    stopWatch,
    watchStatus
  };
}
function useWatchShallowReactive(accessor, properties) {
  const watchReactive = shallowReactive({});
  const watchStatus = ref(true);

  const stopWatch = () => watchStatus.value = false;

  const startWatch = () => watchStatus.value = true;

  properties.forEach(prop => {
    watchReactive[prop] = accessor[prop];
  });

  if (getCurrentInstance()) {
    onUnmounted(() => stopWatch());
  }

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
} // export function useCenterZoom (fssgEsri: FssgEsri) : { state: { center: __esri.Point, zoom: number } } & IWatchRef {
//   const { watchReactive: state, ...others } = useWatchShallowReactive(fssgEsri.view, ['center', 'zoom'])
//   return { state, others }
// }

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

export { createFssgEsri, useCenter, useFssgEsri, useFssgEsriLoaded, useWatchRef, useWatchShallowReactive, useWatchShallowRef, useZoom };
