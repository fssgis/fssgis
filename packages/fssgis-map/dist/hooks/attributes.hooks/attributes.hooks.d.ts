import { App } from 'vue';
interface IAttribute {
    layerName: string;
    fields?: {
        name: string;
        alias: string;
        type?: string;
    }[];
    exclude?: string[];
}
declare type IAttributes = IAttribute[];
export declare function createAttributes(attributes: IAttributes): {
    install(app: App): void;
};
export declare function useAttributes(): IAttributes;
export {};
