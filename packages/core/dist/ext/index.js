"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ext = exports.extString = exports.extNumber = exports.extDate = exports.extArray = void 0;
const array_ext_1 = __importDefault(require("./extensions/array.ext"));
exports.extArray = array_ext_1.default;
const date_ext_1 = __importDefault(require("./extensions/date.ext"));
exports.extDate = date_ext_1.default;
const number_ext_1 = __importDefault(require("./extensions/number.ext"));
exports.extNumber = number_ext_1.default;
const string_ext_1 = __importDefault(require("./extensions/string.ext"));
exports.extString = string_ext_1.default;
function ext(_this) {
    if (_this instanceof Date) {
        return date_ext_1.default(_this);
    }
    if (typeof _this === 'string') {
        return string_ext_1.default(_this);
    }
    if (typeof _this === 'number') {
        return number_ext_1.default(_this);
    }
    if (Array.isArray(_this)) {
        return array_ext_1.default(_this);
    }
}
exports.ext = ext;
exports.default = ext;
