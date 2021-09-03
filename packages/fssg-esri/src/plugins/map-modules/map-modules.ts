import FssgEsri from '../../fssg-esri'
import FssgEsriPlugin, { IFssgEsriPluginEvents, IFssgEsriPluginOptions } from '../../fssg-esri-plugin'

/**
 * 地图模块项
 */
 export interface IModuleItem {
  id: string
  title: string
  treeNodeIds: string[]
}

/**
 * 地图模块控制插件配置项
 */
export interface IMapModulesOptions extends IFssgEsriPluginOptions {
  items?: IModuleItem[]
  defaultSelectedTitle?: string
}

/**
 * 地图模块控制插件事件集
 */
export interface IMapModulesEvents extends IFssgEsriPluginEvents {
  'change:selected': {
    item?: IModuleItem
  }
}


/**
 * 地图模块控制插件
 */
export class MapModules extends FssgEsriPlugin<IMapModulesOptions, IMapModulesEvents> {

  //#region 私有属性

  /**
   * 地图模块集合
   */
  private _items : IModuleItem[]

  private _selectedTitle : string

  //#endregion

  //#region getter setter

  /**
  * 地图模块集合
  */
  public get items () : IModuleItem[] {
    return this._items
  }

  public get selectedTitle () : string {
    return this._selectedTitle
  }

  public set selectedTitle (title: string) {
    this.selectByTitle(title)
  }

  //#endregion

  //#region 构造函数

  /**
  * 构造地图模块插件实例
  * @param options 配置项
  */
  constructor (options: IMapModulesOptions = {}) {
    super(options, { items: [] })
    this._items = this.options_.items ?? []
    this._selectedTitle = this.options_.defaultSelectedTitle ?? ''
  }

  //#endregion

  //#region 公有方法

  /**
   * 安装插件
   * @param fssgEsri 地图应用
   * @returns this
   */
   public override installPlugin (fssgEsri: FssgEsri) : this | Promise<this> {
    super.installPlugin(fssgEsri)
    return this.$.layerTree.when().then(() => this)
  }

  /**
  * 选择地图模块
  * @param moduleId 模块Id
  * @returns this
  */
  public selectById (moduleId: string) : this {
    let item: IModuleItem | undefined
    this._selectedTitle = ''
    this._items.forEach(module => {
      if (moduleId === module.id) {
        this._selectedTitle = module.title
        item = module
        module.treeNodeIds.forEach(nodeId => {
          this.$.layerTree.setNodeCheckById(nodeId, true)
        })
      } else {
        module.treeNodeIds.forEach(nodeId => {
          this.$.layerTree.setNodeCheckById(nodeId, false)
        })
      }
    })
    this.fire('change:selected', { item })
    return this
  }

  /**
  * 选择地图模块
  * @param moduleTitle 模块名称
  * @returns this
  */
  public selectByTitle (moduleTitle: string) : this {
    let item: IModuleItem | undefined
    this._selectedTitle = ''
    this._items.forEach(module => {
      if (moduleTitle === module.title) {
        this._selectedTitle = module.title
        item = module
        module.treeNodeIds.forEach(nodeId => {
          this.$.layerTree.setNodeCheckById(nodeId, true)
        })
      } else {
        module.treeNodeIds.forEach(nodeId => {
          this.$.layerTree.setNodeCheckById(nodeId, false)
        })
      }
    })
    this.fire('change:selected', { item })
    return this
  }

  //#endregion
}

export default MapModules
