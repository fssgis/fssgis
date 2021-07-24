/* eslint-disable no-undef */
import cryptoUtils from './crypto.utils'

test('encrypto and decrypto: can run true', () => {
  const str = 'hello world'
  const enStr = cryptoUtils.encrypto(str)
  const deStr = cryptoUtils.decrypto(enStr)
  expect(deStr).toBe(str)
})

test('encrypto and decrypto: can run true with seted config', () => {
  const str = 'hello world'
  cryptoUtils.setGlobelIV('1234567890123456')
  cryptoUtils.setGlobelKey('12345678901234561234567890123456')
  const enStr = cryptoUtils.encrypto(str)
  const deStr = cryptoUtils.decrypto(enStr)
  expect(deStr).toBe(str)
})
