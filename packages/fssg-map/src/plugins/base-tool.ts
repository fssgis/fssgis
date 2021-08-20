import { ICallbackParams } from '@fssgis/observable'
import BaseClass, { IBaseClassEvents } from '../base-class'

export interface IBaseToolOptions {
  isOnceTool?: boolean
}

export interface IBaseToolEvents extends IBaseClassEvents {
  'tool-actived': void
  'tool-deactived': void
}

export type OnToolActivedParams<THIS> = ICallbackParams<'tool-actived', THIS>
export type OnToolDeactivedParams<THIS> = ICallbackParams<'tool-deactived', THIS>
export type OnToolActivedReture = boolean
export type OnToolDeactivedReture = boolean

export abstract class BaseTool<
  T_OPTIONS extends IBaseToolOptions = IBaseToolOptions,
  T_EVENTS extends IBaseToolEvents = IBaseToolEvents,
> extends BaseClass<T_OPTIONS & IBaseToolOptions, T_EVENTS & IBaseToolEvents> {

  private _isOnceTool: boolean

  private _actived: boolean

  public get isOnceTool () : boolean {
    return this._isOnceTool
  }

  public get actived () : boolean {
    return this._actived
  }

  constructor (options?: T_OPTIONS, defaultOptions?: T_OPTIONS) {
    super(options, { isOnceTool: true, ...defaultOptions } as T_OPTIONS)
    this._isOnceTool = !!this.options_.isOnceTool

    this.on('tool-actived', e => this.onToolActived_(e))
    this.on('tool-deactived', e => this.onToolDeactived_(e))
  }

  //#region 保护方法

  /**
   * 工具激化处理事件
   */
   protected onToolActived_ (e: OnToolActivedParams<this>) : OnToolActivedReture { // eslint-disable-line
    if (!this._actived) {
      return false
    }
    return true
  }

  /**
   * 工具失活处理事件
   */
  protected onToolDeactived_ (e: OnToolDeactivedParams<this>) : OnToolDeactivedReture { // eslint-disable-line
    if (!this._actived) {
      return false
    }
    this._actived = false
    return true
  }

  //#endregion

  //#region 公有方法

  /** 激活工具 */
  public active () : this {
    if (this._actived) {
      return this
    }
    this._actived = true
    this.fire('tool-actived')
    if (this._isOnceTool) {
      this.deactive()
    }
    return this
  }

  /** 接触工具激活状态 */
  public deactive () : this {
    if (!this._actived) {
      return this
    }
    this.fire('tool-deactived')
    return this
  }

  //#endregion
}

export default BaseTool
