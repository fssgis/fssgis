import Utf8 from '../libs/crypto/enc-utf8'
import Base64 from '../libs/crypto/enc-base64'
import Hex from '../libs/crypto/enc-hex'
import Pkcs7 from '../libs/crypto/pad-pkcs7'
import AES from '../libs/crypto/aes'
let STRING_CRYPTO_IV = '5201314'
let STRING_CRYPTO_KEY = '5201314520131452013145201314'

export interface ICryptoOptions {
  key?: string
  iv?: string
}

export interface ICryptoUtils {
  setGlobelKey (key: string) : ICryptoUtils
  setGlobelIV (iv: string) : ICryptoUtils
  encrypto (str: string, options?: ICryptoOptions) : string
  decrypto (str: string, options?: ICryptoOptions) : string
}

export const cryptoUtils : ICryptoUtils = {
  setGlobelKey (key: string) {
    STRING_CRYPTO_KEY = key
    return cryptoUtils
  },
  setGlobelIV (iv: string) {
    STRING_CRYPTO_IV = iv
    return cryptoUtils
  },
  encrypto (str: string, options: ICryptoOptions = {}) : string {
    const key = Utf8.parse(options.key ?? STRING_CRYPTO_KEY)
    const iv = Utf8.parse(options.iv ?? STRING_CRYPTO_IV)
    const newVal = Utf8.parse(str)
    const encrypted = AES.encrypt(newVal, key, {
      iv,
      padding: Pkcs7,
    })
    return encrypted.ciphertext.toString()
  },
  decrypto (str: string, options: ICryptoOptions = {}) : string {
    const key = Utf8.parse(options.key ?? STRING_CRYPTO_KEY)
    const iv = Utf8.parse(options.iv ?? STRING_CRYPTO_IV)
    const encryptedHexStr = Hex.parse(str)
    const newVal = Base64.stringify(encryptedHexStr)
    const decrypt = AES.decrypt(newVal, key, {
      iv,
      padding: Pkcs7
    })
    const decryptedStr = decrypt.toString(Utf8)
    return decryptedStr.toString()
  }
}

export default cryptoUtils
