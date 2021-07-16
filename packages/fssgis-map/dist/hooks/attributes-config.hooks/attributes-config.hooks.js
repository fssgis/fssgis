import { inject } from 'vue';
const SYMBOL_KEY = Symbol();
export function createAttributesConfig(attributes) {
    return {
        install(app) {
            app.provide(SYMBOL_KEY, attributes);
        }
    };
}
export function useAttributesConfig() {
    return inject(SYMBOL_KEY);
}
