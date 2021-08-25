import { LayerTree, FssgEsri, ILayerTreeOptions, ITreeNode } from '@fssgis/fssg-esri'
import { warn } from '@fssgis/fssg-map'
import { App, inject, InjectionKey, provide, reactive, watch } from 'vue'
import { useFssgEsri } from './fssg-esri.hooks'

function _getLayerTree () : LayerTree
function _getLayerTree (fssgMap: FssgEsri) : LayerTree
function _getLayerTree (layerTree: LayerTree) : LayerTree
function _getLayerTree (arg0?: FssgEsri | LayerTree) : LayerTree
function _getLayerTree (arg0?: FssgEsri | LayerTree) : LayerTree {
  let layerTree: LayerTree
  if (!arg0) {
    const fssgEsri = useFssgEsri()
    layerTree = fssgEsri.layerTree
    if (!layerTree) {
      warn(this, 'LayerTree实例未挂载到FssgMap实例')
    }
  } else {
    if (arg0 instanceof FssgEsri) {
      layerTree = arg0.layerTree
    } else {
      layerTree = arg0
    }
  }
  return layerTree
}

interface ILayerTreeState {
  checkedIds: string[],
  treeNodes: ITreeNode[]
}

const SYMBOL_LAYERTREE : InjectionKey<LayerTree> = Symbol('FssgEsri.LayerTree')
const SYMBOL_LAYERTREE_STATE : InjectionKey<ILayerTreeState> = Symbol('FssgEsri.LayerTreeState')

export function createLayerTree (options: ILayerTreeOptions) : LayerTree
export function createLayerTree (options: ILayerTreeOptions, fssgEsri: FssgEsri, app?: App) : LayerTree
export function createLayerTree (options: ILayerTreeOptions, fssgEsri?: FssgEsri, app?: App) : LayerTree {
  const layerTree = new LayerTree(options)
  fssgEsri = fssgEsri ?? useFssgEsri()
  fssgEsri.use(layerTree)
  if (app) {
    app.provide(SYMBOL_LAYERTREE, layerTree)
  } else {
    provide(SYMBOL_LAYERTREE, layerTree)
  }

  const state : ILayerTreeState = reactive({
    checkedIds: layerTree.checkedIds,
    treeNodes: layerTree.tree,
  })
  watch(() => state.checkedIds, (newValue, oldValue) => {
    if (!oldValue) {
      layerTree.list.forEach(item => {
        const layer = (fssgEsri as FssgEsri).mapLayers.findLayer(item.layerId)
        if (!layer) {
          return
        }
        layer.visible = state.checkedIds.includes(item.id)
      })
      return
    }
    const insertion = newValue.filter(v => !(oldValue.indexOf(v) > -1))
    const deletion = oldValue.filter(v => !(newValue.indexOf(v) > -1))
    insertion.forEach(nodeId => {
      layerTree.setNodeCheckById(nodeId, true)
    })
    deletion.forEach(nodeId => {
      layerTree.setNodeCheckById(nodeId, false)
    })
  }, { immediate: true, deep: true })
  fssgEsri.mapLayers.on('change:visible', e => {
    const node = layerTree.findNodeFromLayerId(e.options.id)
    if (!node) {
      return
    }
    if (e.visible && !state.checkedIds.includes(node.id)) {
      state.checkedIds = [...state.checkedIds, node.id]
      return
    }
    const index = state.checkedIds.indexOf(node.id)
    if (!e.visible && index !== -1) {
      const newArr = [...state.checkedIds]
      newArr.splice(index, 1)
      state.checkedIds = [...newArr]
      return
    }
  })

  if (app) {
    app.provide(SYMBOL_LAYERTREE_STATE, state)
  } else {
    provide(SYMBOL_LAYERTREE_STATE, state)
  }

  return layerTree
}

export function useLayerTree () : LayerTree
export function useLayerTree (fssgEsri: FssgEsri) : LayerTree
export function useLayerTree (fssgEsri?: FssgEsri) : LayerTree
export function useLayerTree (fssgEsri?: FssgEsri) : LayerTree {
  return fssgEsri?.layerTree ?? inject(SYMBOL_LAYERTREE) as LayerTree
}

export function useLayerTreeState () : ILayerTreeState {
  return inject(SYMBOL_LAYERTREE_STATE) as ILayerTreeState
}
