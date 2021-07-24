"use strict";
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-types */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setGlobelAxiosInstance = void 0;
const axios_1 = __importDefault(require("axios"));
let _axiosInstance = axios_1.default.create();
function createAxios() {
    let config = {};
    const axiosController = {
        setUrl(url) {
            config.url = url;
            return axiosController;
        },
        mountGet(axiosInit = _axiosInstance) {
            return axiosInit({
                ...config,
                method: 'get'
            }).then(res => res.data);
        },
        mountPost(axiosInit = _axiosInstance) {
            return axiosInit({
                ...config,
                method: 'post'
            }).then(res => res.data);
        },
        setBody(...args) {
            if (!config.data) {
                config.data = {};
            }
            if (args.length === 1) {
                const body = args[0];
                Object.assign(config.data, body);
            }
            else if (args.length === 2) {
                const [key, value] = args;
                config.data[key] = value;
            }
            return axiosController;
        },
        setHeaders(...args) {
            if (!config.headers) {
                config.data = {};
            }
            if (args.length === 1) {
                const headers = args[0];
                Object.assign(config.headers, headers);
            }
            else if (args.length === 2) {
                const [key, value] = args;
                config.headers[key] = value;
            }
            return axiosController;
        },
        setParams(...args) {
            if (!config.params) {
                config.params = {};
            }
            if (args.length === 1) {
                const params = args[0];
                Object.assign(config.params, params);
            }
            else if (args.length === 2) {
                const [key, value] = args;
                config.params[key] = value;
            }
            return axiosController;
        },
        setConfig(_config) {
            config = _config;
            return axiosController;
        }
    };
    return axiosController;
}
function setGlobelAxiosInstance(axiosInstance) {
    _axiosInstance = axiosInstance;
}
exports.setGlobelAxiosInstance = setGlobelAxiosInstance;
exports.default = createAxios;
