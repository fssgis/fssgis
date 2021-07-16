import { App } from 'vue';
interface IAttributesConfigItem {
    layerName: string;
    fields?: {
        name: string;
        alias: string;
        type?: string;
    }[];
    exclude?: string[];
}
declare type IAttributesConfig = IAttributesConfigItem[];
export declare function createAttributes(attributes: IAttributesConfig): {
    install(app: App): void;
};
export declare function useAttributes(): IAttributesConfig;
export {};
