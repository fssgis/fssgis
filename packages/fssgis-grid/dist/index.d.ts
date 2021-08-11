import * as vue from 'vue';
import { PropType, ComputedRef, CSSProperties } from 'vue';

declare type GridAreas = number[][];
interface IGridTemplateArea {
    gridTemplateArea: string;
    areaItems: string[];
}
interface IFssgGridOptions {
    gridAreas: GridAreas;
    templateRows?: string;
    templateColumns?: string;
    gap?: string;
    width?: string;
    height?: string;
}
declare const FssgGrid: vue.DefineComponent<{
    options: {
        type: PropType<IFssgGridOptions>;
        default: () => {};
    };
    inline: BooleanConstructor;
    margin: {
        type: StringConstructor;
        default: () => string;
    };
}, () => JSX.Element, unknown, {}, {}, vue.ComponentOptionsMixin, vue.ComponentOptionsMixin, Record<string, any>, string, vue.VNodeProps & vue.AllowedComponentProps & vue.ComponentCustomProps, Readonly<{
    options?: unknown;
    inline?: unknown;
    margin?: unknown;
} & {
    options: IFssgGridOptions;
    inline: boolean;
    margin: string;
} & {}>, {
    options: IFssgGridOptions;
    inline: boolean;
    margin: string;
}>;

declare function useGridAreaItems(gridAreas: GridAreas): ComputedRef<IGridTemplateArea>;

declare const FssgBoxV6: vue.DefineComponent<{
    iconUrl: {
        type: StringConstructor;
        default: string;
    };
    iconStyle: {
        type: vue.PropType<vue.CSSProperties>;
        default: () => {};
    };
    titleStyle: {
        type: vue.PropType<vue.CSSProperties>;
        default: () => {};
    };
    valueStyle: {
        type: vue.PropType<vue.CSSProperties>;
        default: () => {};
    };
    unitStyle: {
        type: vue.PropType<vue.CSSProperties>;
        default: () => {};
    };
    title: {
        type: StringConstructor;
        default: string;
    };
    value: {
        type: (StringConstructor | NumberConstructor)[];
        default: null;
    };
    unit: {
        type: StringConstructor;
        default: string;
    };
}, () => JSX.Element, unknown, {}, {}, vue.ComponentOptionsMixin, vue.ComponentOptionsMixin, Record<string, any>, string, vue.VNodeProps & vue.AllowedComponentProps & vue.ComponentCustomProps, Readonly<{
    iconUrl?: unknown;
    iconStyle?: unknown;
    titleStyle?: unknown;
    valueStyle?: unknown;
    unitStyle?: unknown;
    title?: unknown;
    value?: unknown;
    unit?: unknown;
} & {
    value: string | number;
    title: string;
    iconUrl: string;
    iconStyle: vue.CSSProperties;
    titleStyle: vue.CSSProperties;
    valueStyle: vue.CSSProperties;
    unitStyle: vue.CSSProperties;
    unit: string;
} & {}>, {
    value: string | number;
    title: string;
    iconUrl: string;
    iconStyle: vue.CSSProperties;
    titleStyle: vue.CSSProperties;
    valueStyle: vue.CSSProperties;
    unitStyle: vue.CSSProperties;
    unit: string;
}>;

declare const FssgBoxV5: vue.DefineComponent<{
    iconUrl: {
        type: StringConstructor;
        default: string;
    };
    iconStyle: {
        type: vue.PropType<vue.CSSProperties>;
        default: () => {};
    };
    titleStyle: {
        type: vue.PropType<vue.CSSProperties>;
        default: () => {};
    };
    valueStyle: {
        type: vue.PropType<vue.CSSProperties>;
        default: () => {};
    };
    unitStyle: {
        type: vue.PropType<vue.CSSProperties>;
        default: () => {};
    };
    title: {
        type: StringConstructor;
        default: string;
    };
    value: {
        type: (StringConstructor | NumberConstructor)[];
        default: null;
    };
    unit: {
        type: StringConstructor;
        default: string;
    };
}, () => JSX.Element, unknown, {}, {}, vue.ComponentOptionsMixin, vue.ComponentOptionsMixin, Record<string, any>, string, vue.VNodeProps & vue.AllowedComponentProps & vue.ComponentCustomProps, Readonly<{
    iconUrl?: unknown;
    iconStyle?: unknown;
    titleStyle?: unknown;
    valueStyle?: unknown;
    unitStyle?: unknown;
    title?: unknown;
    value?: unknown;
    unit?: unknown;
} & {
    value: string | number;
    title: string;
    iconUrl: string;
    iconStyle: vue.CSSProperties;
    titleStyle: vue.CSSProperties;
    valueStyle: vue.CSSProperties;
    unitStyle: vue.CSSProperties;
    unit: string;
} & {}>, {
    value: string | number;
    title: string;
    iconUrl: string;
    iconStyle: vue.CSSProperties;
    titleStyle: vue.CSSProperties;
    valueStyle: vue.CSSProperties;
    unitStyle: vue.CSSProperties;
    unit: string;
}>;

declare const FssgBoxV4: vue.DefineComponent<{
    iconUrl: {
        type: StringConstructor;
        default: string;
    };
    iconStyle: {
        type: vue.PropType<vue.CSSProperties>;
        default: () => {};
    };
    titleStyle: {
        type: vue.PropType<vue.CSSProperties>;
        default: () => {};
    };
    valueStyle: {
        type: vue.PropType<vue.CSSProperties>;
        default: () => {};
    };
    unitStyle: {
        type: vue.PropType<vue.CSSProperties>;
        default: () => {};
    };
    title: {
        type: StringConstructor;
        default: string;
    };
    value: {
        type: (StringConstructor | NumberConstructor)[];
        default: null;
    };
    unit: {
        type: StringConstructor;
        default: string;
    };
}, () => JSX.Element, unknown, {}, {}, vue.ComponentOptionsMixin, vue.ComponentOptionsMixin, Record<string, any>, string, vue.VNodeProps & vue.AllowedComponentProps & vue.ComponentCustomProps, Readonly<{
    iconUrl?: unknown;
    iconStyle?: unknown;
    titleStyle?: unknown;
    valueStyle?: unknown;
    unitStyle?: unknown;
    title?: unknown;
    value?: unknown;
    unit?: unknown;
} & {
    value: string | number;
    title: string;
    iconUrl: string;
    iconStyle: vue.CSSProperties;
    titleStyle: vue.CSSProperties;
    valueStyle: vue.CSSProperties;
    unitStyle: vue.CSSProperties;
    unit: string;
} & {}>, {
    value: string | number;
    title: string;
    iconUrl: string;
    iconStyle: vue.CSSProperties;
    titleStyle: vue.CSSProperties;
    valueStyle: vue.CSSProperties;
    unitStyle: vue.CSSProperties;
    unit: string;
}>;

declare const FssgBoxV3: vue.DefineComponent<{
    iconUrl: {
        type: StringConstructor;
        default: string;
    };
    iconStyle: {
        type: vue.PropType<vue.CSSProperties>;
        default: () => {};
    };
    titleStyle: {
        type: vue.PropType<vue.CSSProperties>;
        default: () => {};
    };
    valueStyle: {
        type: vue.PropType<vue.CSSProperties>;
        default: () => {};
    };
    unitStyle: {
        type: vue.PropType<vue.CSSProperties>;
        default: () => {};
    };
    title: {
        type: StringConstructor;
        default: string;
    };
    value: {
        type: (StringConstructor | NumberConstructor)[];
        default: null;
    };
    unit: {
        type: StringConstructor;
        default: string;
    };
}, () => JSX.Element, unknown, {}, {}, vue.ComponentOptionsMixin, vue.ComponentOptionsMixin, Record<string, any>, string, vue.VNodeProps & vue.AllowedComponentProps & vue.ComponentCustomProps, Readonly<{
    iconUrl?: unknown;
    iconStyle?: unknown;
    titleStyle?: unknown;
    valueStyle?: unknown;
    unitStyle?: unknown;
    title?: unknown;
    value?: unknown;
    unit?: unknown;
} & {
    value: string | number;
    title: string;
    iconUrl: string;
    iconStyle: vue.CSSProperties;
    titleStyle: vue.CSSProperties;
    valueStyle: vue.CSSProperties;
    unitStyle: vue.CSSProperties;
    unit: string;
} & {}>, {
    value: string | number;
    title: string;
    iconUrl: string;
    iconStyle: vue.CSSProperties;
    titleStyle: vue.CSSProperties;
    valueStyle: vue.CSSProperties;
    unitStyle: vue.CSSProperties;
    unit: string;
}>;

declare const FssgBoxV2: vue.DefineComponent<{
    iconUrl: {
        type: StringConstructor;
        default: string;
    };
    iconStyle: {
        type: vue.PropType<vue.CSSProperties>;
        default: () => {};
    };
    titleStyle: {
        type: vue.PropType<vue.CSSProperties>;
        default: () => {};
    };
    valueStyle: {
        type: vue.PropType<vue.CSSProperties>;
        default: () => {};
    };
    unitStyle: {
        type: vue.PropType<vue.CSSProperties>;
        default: () => {};
    };
    title: {
        type: StringConstructor;
        default: string;
    };
    value: {
        type: (StringConstructor | NumberConstructor)[];
        default: null;
    };
    unit: {
        type: StringConstructor;
        default: string;
    };
}, () => JSX.Element, unknown, {}, {}, vue.ComponentOptionsMixin, vue.ComponentOptionsMixin, Record<string, any>, string, vue.VNodeProps & vue.AllowedComponentProps & vue.ComponentCustomProps, Readonly<{
    iconUrl?: unknown;
    iconStyle?: unknown;
    titleStyle?: unknown;
    valueStyle?: unknown;
    unitStyle?: unknown;
    title?: unknown;
    value?: unknown;
    unit?: unknown;
} & {
    value: string | number;
    title: string;
    iconUrl: string;
    iconStyle: vue.CSSProperties;
    titleStyle: vue.CSSProperties;
    valueStyle: vue.CSSProperties;
    unitStyle: vue.CSSProperties;
    unit: string;
} & {}>, {
    value: string | number;
    title: string;
    iconUrl: string;
    iconStyle: vue.CSSProperties;
    titleStyle: vue.CSSProperties;
    valueStyle: vue.CSSProperties;
    unitStyle: vue.CSSProperties;
    unit: string;
}>;

declare const FssgBoxV1: vue.DefineComponent<{
    values: {
        type: PropType<IStatistics[]>;
        default: () => null;
    };
    iconUrl: {
        type: StringConstructor;
        default: string;
    };
    iconStyle: {
        type: PropType<vue.CSSProperties>;
        default: () => {};
    };
    titleStyle: {
        type: PropType<vue.CSSProperties>;
        default: () => {};
    };
    valueStyle: {
        type: PropType<vue.CSSProperties>;
        default: () => {};
    };
    unitStyle: {
        type: PropType<vue.CSSProperties>;
        default: () => {};
    };
    title: {
        type: StringConstructor;
        default: string;
    };
    value: {
        type: (StringConstructor | NumberConstructor)[];
        default: null;
    };
    unit: {
        type: StringConstructor;
        default: string;
    };
}, () => JSX.Element, unknown, {}, {}, vue.ComponentOptionsMixin, vue.ComponentOptionsMixin, Record<string, any>, string, vue.VNodeProps & vue.AllowedComponentProps & vue.ComponentCustomProps, Readonly<{
    values?: unknown;
    iconUrl?: unknown;
    iconStyle?: unknown;
    titleStyle?: unknown;
    valueStyle?: unknown;
    unitStyle?: unknown;
    title?: unknown;
    value?: unknown;
    unit?: unknown;
} & {
    value: string | number;
    values: IStatistics[];
    title: string;
    iconUrl: string;
    iconStyle: vue.CSSProperties;
    titleStyle: vue.CSSProperties;
    valueStyle: vue.CSSProperties;
    unitStyle: vue.CSSProperties;
    unit: string;
} & {}>, {
    value: string | number;
    values: IStatistics[];
    title: string;
    iconUrl: string;
    iconStyle: vue.CSSProperties;
    titleStyle: vue.CSSProperties;
    valueStyle: vue.CSSProperties;
    unitStyle: vue.CSSProperties;
    unit: string;
}>;

declare type Grid = Array<Array<number | 'i' | 't' | 'v' | 'u'>>;
declare const FssgBox: vue.DefineComponent<{
    grid: {
        type: PropType<Grid>;
        default: () => never[];
    };
    iconUrl: {
        type: StringConstructor;
        default: string;
    };
    iconStyle: {
        type: PropType<vue.CSSProperties>;
        default: () => {};
    };
    titleStyle: {
        type: PropType<vue.CSSProperties>;
        default: () => {};
    };
    valueStyle: {
        type: PropType<vue.CSSProperties>;
        default: () => {};
    };
    unitStyle: {
        type: PropType<vue.CSSProperties>;
        default: () => {};
    };
    title: {
        type: StringConstructor;
        default: string;
    };
    value: {
        type: (StringConstructor | NumberConstructor)[];
        default: null;
    };
    unit: {
        type: StringConstructor;
        default: string;
    };
}, () => JSX.Element, unknown, {}, {}, vue.ComponentOptionsMixin, vue.ComponentOptionsMixin, Record<string, any>, string, vue.VNodeProps & vue.AllowedComponentProps & vue.ComponentCustomProps, Readonly<{
    grid?: unknown;
    iconUrl?: unknown;
    iconStyle?: unknown;
    titleStyle?: unknown;
    valueStyle?: unknown;
    unitStyle?: unknown;
    title?: unknown;
    value?: unknown;
    unit?: unknown;
} & {
    value: string | number;
    title: string;
    grid: Grid;
    iconUrl: string;
    iconStyle: vue.CSSProperties;
    titleStyle: vue.CSSProperties;
    valueStyle: vue.CSSProperties;
    unitStyle: vue.CSSProperties;
    unit: string;
} & {}>, {
    value: string | number;
    title: string;
    grid: Grid;
    iconUrl: string;
    iconStyle: vue.CSSProperties;
    titleStyle: vue.CSSProperties;
    valueStyle: vue.CSSProperties;
    unitStyle: vue.CSSProperties;
    unit: string;
}>;

interface IStatistics {
    title: string;
    value?: string | number;
    unit?: string;
    iconUrl?: string;
    iconStyle?: CSSProperties;
    titleStyle?: CSSProperties;
    valueStyle?: CSSProperties;
    unitStyle?: CSSProperties;
    style?: CSSProperties;
    onClick?: (e: MouseEvent) => void;
}
declare function statisticsProps(): {
    title: {
        type: StringConstructor;
        default: string;
    };
    value: {
        type: (StringConstructor | NumberConstructor)[];
        default: null;
    };
    unit: {
        type: StringConstructor;
        default: string;
    };
};
declare function statisticsStyleProps(): {
    iconUrl: {
        type: StringConstructor;
        default: string;
    };
    iconStyle: {
        type: PropType<CSSProperties>;
        default: () => {};
    };
    titleStyle: {
        type: PropType<CSSProperties>;
        default: () => {};
    };
    valueStyle: {
        type: PropType<CSSProperties>;
        default: () => {};
    };
    unitStyle: {
        type: PropType<CSSProperties>;
        default: () => {};
    };
};
declare function toValue(value?: string | number | null, initValue?: string): string | number;

export { FssgBox, FssgBoxV1, FssgBoxV2, FssgBoxV3, FssgBoxV4, FssgBoxV5, FssgBoxV6, FssgGrid, Grid, GridAreas, IFssgGridOptions, IGridTemplateArea, IStatistics, statisticsProps, statisticsStyleProps, toValue, useGridAreaItems };
