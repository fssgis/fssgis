import { App } from 'vue';
export interface IAttributesConfigItem {
    layerName: string;
    fields?: {
        name: string;
        alias: string;
        type?: string;
    }[];
    exclude?: string[];
}
export declare type IAttributesConfig = IAttributesConfigItem[];
export declare function createAttributesConfig(attributes: IAttributesConfig): {
    install(app: App): void;
};
export declare function useAttributesConfig(): IAttributesConfig;
