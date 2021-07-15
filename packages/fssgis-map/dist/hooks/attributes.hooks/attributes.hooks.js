import { inject } from 'vue';
const SYMBOL_KEY = Symbol();
export function createAttributes(attributes) {
    return {
        install(app) {
            app.provide(SYMBOL_KEY, attributes);
        }
    };
}
export function useAttributes() {
    return inject(SYMBOL_KEY);
}
