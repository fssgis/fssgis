"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cryptoUtils = void 0;
const enc_utf8_1 = __importDefault(require("../libs/crypto/enc-utf8"));
const enc_base64_1 = __importDefault(require("../libs/crypto/enc-base64"));
const enc_hex_1 = __importDefault(require("../libs/crypto/enc-hex"));
const pad_pkcs7_1 = __importDefault(require("../libs/crypto/pad-pkcs7"));
const aes_1 = __importDefault(require("../libs/crypto/aes"));
let STRING_CRYPTO_IV = '5201314';
let STRING_CRYPTO_KEY = '5201314520131452013145201314';
exports.cryptoUtils = {
    setGlobelKey(key) {
        STRING_CRYPTO_KEY = key;
        return exports.cryptoUtils;
    },
    setGlobelIV(iv) {
        STRING_CRYPTO_IV = iv;
        return exports.cryptoUtils;
    },
    encrypto(str, options = {}) {
        const key = enc_utf8_1.default.parse(options.key ?? STRING_CRYPTO_KEY);
        const iv = enc_utf8_1.default.parse(options.iv ?? STRING_CRYPTO_IV);
        const newVal = enc_utf8_1.default.parse(str);
        const encrypted = aes_1.default.encrypt(newVal, key, {
            iv,
            padding: pad_pkcs7_1.default,
        });
        return encrypted.ciphertext.toString();
    },
    decrypto(str, options = {}) {
        const key = enc_utf8_1.default.parse(options.key ?? STRING_CRYPTO_KEY);
        const iv = enc_utf8_1.default.parse(options.iv ?? STRING_CRYPTO_IV);
        const encryptedHexStr = enc_hex_1.default.parse(str);
        const newVal = enc_base64_1.default.stringify(encryptedHexStr);
        const decrypt = aes_1.default.decrypt(newVal, key, {
            iv,
            padding: pad_pkcs7_1.default
        });
        const decryptedStr = decrypt.toString(enc_utf8_1.default);
        return decryptedStr.toString();
    }
};
exports.default = exports.cryptoUtils;
