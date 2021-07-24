"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.extString = void 0;
const date_ext_1 = __importDefault(require("./date.ext"));
function extString(str) {
    return {
        trimAll() {
            return str.replace(new RegExp(' ', 'gm'), '');
        },
        toDate() {
            return new Date(str);
        },
        toDateFormat(fmt) {
            const date = extString(str).toDate();
            return date_ext_1.default(date).format(fmt);
        }
    };
}
exports.extString = extString;
exports.default = extString;
