import * as vue from 'vue';

declare const _default: vue.DefineComponent<{
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

export default _default;
