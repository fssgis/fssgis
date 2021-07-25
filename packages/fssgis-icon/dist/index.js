import { defineComponent, computed, useCssVars, openBlock, createBlock } from 'vue';

const __default__ = defineComponent({
    props: {
        height: {
            type: [String, Number],
            default: '16px',
        },
        width: {
            type: [String, Number],
            default: '16px',
        },
        url: {
            type: String,
            default: '',
        },
    },
    setup(props) {
        const iconUrl = computed(() => `url(${props.url})`);
        const widthStyle = computed(() => !isNaN(props.width) ? `${props.width}px` : props.width);
        const heightStyle = computed(() => !isNaN(props.height) ? `${props.height}px` : props.height);
        return {
            iconUrl,
            widthStyle,
            heightStyle,
        };
    }
});
const __injectCSSVars__ = () => {
    useCssVars(_ctx => ({
        "c79f4a06-widthStyle": (_ctx.widthStyle),
        "c79f4a06-heightStyle": (_ctx.heightStyle),
        "c79f4a06-iconUrl": (_ctx.iconUrl)
    }));
};
const __setup__ = __default__.setup;
__default__.setup = __setup__
    ? (props, ctx) => { __injectCSSVars__(); return __setup__(props, ctx); }
    : __injectCSSVars__;

const _hoisted_1 = { class: "fssg-icon" };

function render(_ctx, _cache, $props, $setup, $data, $options) {
  return (openBlock(), createBlock("div", _hoisted_1))
}

__default__.render = render;
__default__.__file = "packages/fssgis-icon/src/FssgIcon.vue";

export default __default__;
