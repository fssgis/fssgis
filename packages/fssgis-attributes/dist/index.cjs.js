'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var vue = require('vue');

const SYMBOL_KEY = Symbol();
function createAttributesConfig(attributes) {
    return {
        install(app) {
            app.provide(SYMBOL_KEY, attributes);
        }
    };
}
function useAttributesConfig() {
    return vue.inject(SYMBOL_KEY);
}

exports.createAttributesConfig = createAttributesConfig;
exports.useAttributesConfig = useAttributesConfig;
