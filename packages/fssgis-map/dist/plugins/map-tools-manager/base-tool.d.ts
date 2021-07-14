import { ICallbackParams } from '@fssgis/core/es/observable';
import BaseClass, { IBaseClassEvents } from '../../base-class';
export interface IBaseToolABSOptions {
    isOnceTool?: boolean;
}
export interface IBaseToolABSEvents extends IBaseClassEvents {
    'tool-actived': void;
    'tool-deactived': void;
}
export declare type OnToolActivedParams<THIS> = ICallbackParams<'tool-actived', THIS>;
export declare type OnToolDeactivedParams<THIS> = ICallbackParams<'tool-deactived', THIS>;
export declare type OnToolActivedReture = boolean;
export declare type OnToolDeactivedReture = boolean;
export declare abstract class BaseToolABS<T_OPTIONS extends IBaseToolABSOptions = IBaseToolABSOptions, T_EVENTS extends IBaseToolABSEvents = IBaseToolABSEvents> extends BaseClass<T_OPTIONS, T_EVENTS> {
    private _isOnceTool;
    private _actived;
    get isOnceTool(): boolean;
    get actived(): boolean;
    constructor(options?: T_OPTIONS, defaultOptions?: T_OPTIONS);
    /**
     * 工具激化处理事件
     */
    protected onToolActived_(e: OnToolActivedParams<this>): OnToolActivedReture;
    /**
     * 工具失活处理事件
     */
    protected onToolDeactived_(e: OnToolDeactivedParams<this>): OnToolDeactivedReture;
    /** 激活工具 */
    active(): this;
    /** 接触工具激活状态 */
    deactive(): this;
}
export default BaseToolABS;
