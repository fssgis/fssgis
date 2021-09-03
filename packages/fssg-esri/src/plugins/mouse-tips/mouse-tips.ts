import { throttle } from '@fssgis/utils'
import FssgEsri from '../../fssg-esri'
import FssgEsriPlugin, { IFssgEsriPluginEvents, IFssgEsriPluginOptions } from '../../fssg-esri-plugin'

export interface IMouseTipsOptions extends IFssgEsriPluginOptions { // eslint-disable-line

}

export interface IMouseTipsEvents extends IFssgEsriPluginEvents { // eslint-disable-line

}

export class MouseTips extends FssgEsriPlugin<IMouseTipsOptions, IMouseTipsEvents> {

  private _handlers: Set<IHandle>

  private _tipsDom : HTMLDivElement

  constructor (options?: IMouseTipsOptions) {
    super(options, {})
  }


  private _init () : this {
    this._handlers = new Set()
    return this
  }

  public override installPlugin (fssgEsri: FssgEsri) : this | Promise<this> {
    super.installPlugin(fssgEsri)
    return this._init()
  }


  public showTips (tips: string) : this {
    if (!this._tipsDom) {
      this._tipsDom = document.createElement('div')
      this._tipsDom.classList.add('fssg-mouse-tips')
      this._tipsDom.style.position = 'absolute'
      this._tipsDom.style.padding = '4px 8px'
      this._tipsDom.style.backgroundColor = '#00000085'
      this._tipsDom.style.color = '#fff'
      this._tipsDom.style.boxShadow = '0 1px 4px rgb(0 0 0 / 80%)'
      this.view_.container.append(this._tipsDom)
    }
    this._handlers.forEach(item => item.remove())
    this._handlers.clear()
    this._tipsDom.innerHTML = tips
    const pointerMouveHandler = this.view_.on('pointer-move', throttle(e => {
      this._tipsDom.style.top = `${e.y + 16}px`
      this._tipsDom.style.left = `${e.x + 16}px`
    }, 100) as __esri.ViewPointerMoveEventHandler)
    this._handlers.add(pointerMouveHandler)

    const pointerLeaveHandler = this.view_.on('pointer-leave', () => {
      this._tipsDom.style.display = 'none'
    })
    this._handlers.add(pointerLeaveHandler)

    const pointerEnter = this.view_.on('pointer-enter', () => {
      this._tipsDom.style.display = 'block'
    })
    this._handlers.add(pointerEnter)

    return this
  }

  public cancelTips () : this {
    this._tipsDom?.remove?.()
    // eslint-disable-next-line
    // @ts-ignore
    this._tipsDom = null
    this._handlers.forEach(item => item.remove())
    this._handlers.clear()
    return this
  }

}

export default MouseTips
