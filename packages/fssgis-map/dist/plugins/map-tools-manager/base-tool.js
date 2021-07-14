import BaseClass from '../../base-class';
export class BaseToolABS extends BaseClass {
    _isOnceTool;
    _actived;
    get isOnceTool() {
        return this._isOnceTool;
    }
    get actived() {
        return this._actived;
    }
    constructor(options, defaultOptions) {
        super(options, { isOnceTool: true, ...defaultOptions });
        this._isOnceTool = !!this.options_.isOnceTool;
        this.on('tool-actived', e => this.onToolActived_(e));
        this.on('tool-deactived', e => this.onToolDeactived_(e));
    }
    //#region 保护方法
    /**
     * 工具激化处理事件
     */
    onToolActived_(e) {
        if (!this._actived) {
            return false;
        }
        return true;
    }
    /**
     * 工具失活处理事件
     */
    onToolDeactived_(e) {
        if (!this._actived) {
            return false;
        }
        this._actived = false;
        return true;
    }
    //#endregion
    //#region 公有方法
    /** 激活工具 */
    active() {
        if (this._actived) {
            return this;
        }
        this._actived = true;
        this.fire('tool-actived');
        if (this._isOnceTool) {
            this.deactive();
        }
        return this;
    }
    /** 接触工具激活状态 */
    deactive() {
        if (!this._actived) {
            return this;
        }
        this.fire('tool-deactived');
        return this;
    }
}
export default BaseToolABS;
