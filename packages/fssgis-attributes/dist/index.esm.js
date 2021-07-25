import { inject } from 'vue';

const SYMBOL_KEY = Symbol();
function createAttributesConfig(attributes) {
    return {
        install(app) {
            app.provide(SYMBOL_KEY, attributes);
        }
    };
}
function useAttributesConfig() {
    return inject(SYMBOL_KEY);
}

export { createAttributesConfig, useAttributesConfig };
