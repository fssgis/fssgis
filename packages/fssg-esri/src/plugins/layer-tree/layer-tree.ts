import { listToTree } from '@fssgis/utils'
import FssgEsri from '../../fssg-esri'
import FssgEsriPlugin, { IFssgEsriPluginEvents, IFssgEsriPluginOptions } from '../../fssg-esri-plugin'

/**
 * 树节点
 */
export interface ITreeNode {
  id: string
  parentId: string
  name: string
  layerId: string
  defaultChecked: boolean
  associatedLayerIds?: string[]
  children?: ITreeNode[]
}


/**
 * 图层树插件配置项
 */
 export interface ILayerTreeOptions extends IFssgEsriPluginOptions {
  items?: Omit<ITreeNode, 'children'>[]
}

/**
 * 图层树插件事件集
 */
 export interface ILayerTreeEvents extends IFssgEsriPluginEvents {
  'change:checked': {
    node: ITreeNode
    checked: boolean
  }
}

export class LayerTree extends FssgEsriPlugin<ILayerTreeOptions, ILayerTreeEvents> {

  //#region 私有属性

  /**
 * 图层树列表
 */
  private _list : ITreeNode[]

  /**
  * 图层树
  */
  private _tree: ITreeNode[]

  /**
  * 选中的树节点Id
  */
  private _checkedIds: string[]

  //#endregion

  //#region getter setter

  /**
  * 图层树列表
  */
  public get list () : ITreeNode[] {
    return this._list
  }

  /**
  * 图层树
  */
  public get tree () : ITreeNode[] {
    return this._tree
  }

  /**
  * 选中的树节点Id
  */
  public get checkedIds () : string[] {
    return this._checkedIds
  }

  //#endregion

  /**
   * 构造图层树插件实例
   * @param options 配置项
   */
   constructor (options: ILayerTreeOptions = {}) {
    super(options, { items: [] })
    this._list = options.items ?? []
    this._tree = listToTree(this._list)
    this._checkedIds = []
  }

  //#region 私有方法

  /**
   * 设置树节点选中状态
   * @param node 树节点
   * @param checked 选中状态
   * @returns this
   */
   private _setNodeChecked (node: ITreeNode, checked: boolean) : this {
    if (!node.layerId) {
      return this
    }
    const layer = this.$.mapLayers.findLayer(node.layerId)
    layer && (layer.visible = checked)
    node.associatedLayerIds?.forEach(id => {
      const layer = this.$.mapLayers.findLayer(id)
      layer && (layer.visible = checked)
    })
    return this.fire('change:checked', { node, checked })
  }

  /**
   * 初始化
   */
  private _init () : this {
    this.$.mapLayers.when().then(() => {
      this._list.forEach(item => {
        this._setNodeChecked(item, item.defaultChecked)
        item.defaultChecked && this._checkedIds.push(item.id)
      })
    })
    // this.on('change:checked', e => {

    // })
    return this
  }

  //#endregion

  //#region 公有方法

  /**
   * 安装插件
   * @param fssgEsri 地图应用
   * @returns this
   */
  public override installPlugin (fssgEsri: FssgEsri) : this {
    return super.installPlugin(fssgEsri)
      ._init()
      .fire('loaded')
  }

  /**
   * 通过树节点Id查找图层
   * @param nodeId 树节点Id
   * @returns 图层
   */
  public findLayerFromNodeId (nodeId: string) : __esri.Layer | undefined {
    const layerId = this._list.find(item => item.id === nodeId)?.layerId
    if (layerId) {
      return this.$.mapLayers.findLayer(layerId)
    }
  }

  /**
   * 通过树节点Id查找树节点
   * @param nodeId 树节点Id
   * @returns 树节点
   */
  public findNodeFromNodeId (nodeId: string) : ITreeNode | undefined {
    return this._list.find(item => item.id === nodeId)
  }

  /**
   * 通过树节点名称查找树节点
   * @param nodeName 树节点名称
   * @returns 树节点
   */
  public findNodeFromNodeName (nodeName: string) : ITreeNode | undefined {
    return this._list.find(item => item.name === nodeName)
  }

  /**
   * 通过图层Id查找树节点
   * @param layerId 图层Id
   * @returns 树节点
   */
  public findNodeFromLayerId (layerId: string) : ITreeNode | undefined {
    for (let i = 0; i < this._list.length; i++) {
      const item = this._list[i]
      if (item.layerId === layerId) {
        return item
      }
    }
  }

  /**
   * 设置树节点选中状态
   * @param nodeId 树节点Id
   * @param checked 选中状态
   * @returns this
   */
  public setNodeCheckById (nodeId: string, checked: boolean) : this {
    const node = this.findNodeFromNodeId(nodeId)
    node && this._setNodeChecked(node, checked)
    return this
  }

  /**
   * 设置树节点选中状态
   * @param nodeName 树节点名称
   * @param checked 选中状态
   * @returns this
   */
  public setNodeCheckByName (nodeName: string, check: boolean) : this {
    const node = this.findNodeFromNodeName(nodeName)
    node && this._setNodeChecked(node, check)
    return this
  }

  //#endregion

}

export default LayerTree
