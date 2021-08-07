import * as vue from 'vue';

declare const _default$1: vue.DefineComponent<{
    height: {
        type: (StringConstructor | NumberConstructor)[];
        default: string;
    };
    width: {
        type: (StringConstructor | NumberConstructor)[];
        default: string;
    };
    url: {
        type: StringConstructor;
        default: string;
    };
}, () => JSX.Element, unknown, {}, {}, vue.ComponentOptionsMixin, vue.ComponentOptionsMixin, Record<string, any>, string, vue.VNodeProps & vue.AllowedComponentProps & vue.ComponentCustomProps, Readonly<{
    height?: unknown;
    width?: unknown;
    url?: unknown;
} & {
    height: string | number;
    width: string | number;
    url: string;
} & {}>, {
    height: string | number;
    width: string | number;
    url: string;
}>;

declare const _default: vue.DefineComponent<{
    name: {
        type: StringConstructor;
        required: true;
    };
    size: {
        type: (StringConstructor | NumberConstructor)[];
        default: string;
    };
    color: {
        type: StringConstructor;
        default: string;
    };
}, () => JSX.Element, unknown, {}, {}, vue.ComponentOptionsMixin, vue.ComponentOptionsMixin, Record<string, any>, string, vue.VNodeProps & vue.AllowedComponentProps & vue.ComponentCustomProps, Readonly<{
    name?: unknown;
    size?: unknown;
    color?: unknown;
} & {
    name: string;
    size: string | number;
    color: string;
} & {}>, {
    size: string | number;
    color: string;
}>;

export default _default$1;
export { _default as FssgIconFont };
