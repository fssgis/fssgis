'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var axios = require('axios');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var axios__default = /*#__PURE__*/_interopDefaultLegacy(axios);

/* eslint-disable @typescript-eslint/no-explicit-any */
let _axiosInstance = axios__default['default'].create();
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
                config.headers = {};
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

Object.defineProperty(exports, 'axios', {
  enumerable: true,
  get: function () {
    return axios__default['default'];
  }
});
exports.createAxios = createAxios;
exports.setGlobelAxiosInstance = setGlobelAxiosInstance;
