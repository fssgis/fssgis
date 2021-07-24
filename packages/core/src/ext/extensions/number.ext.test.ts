/* eslint-disable no-undef */
import ext from './number.ext'

test('divide() can run', () => {
  const num = 7
  expect(ext(num).divide(3)).toBe(2)
})

test('floor() can run', () => {
  const num = 7.9
  expect(ext(num).floor()).toBe(7)
})

test('ceil() can run', () => {
  const num = 7.1
  expect(ext(num).ceil()).toBe(8)
})

test('abs() can run', () => {
  const num = -7.1
  expect(ext(num).abs()).toBe(7.1)
})

test('round() can run', () => {
  expect(ext(7.4).round()).toBe(7)
  expect(ext(7.5).round()).toBe(8)
  expect(ext(7.5).round(-1)).toBe(10)
  expect(ext(7.54).round(1)).toBe(7.5)
})

test('toDate() can run', () => {
  expect(ext(0).toDate().getFullYear()).toBe(1970)
})

test('toDateFormat() can run', () => {
  expect(ext(0).toDateFormat('yyyy')).toBe('1970')
})

test('toCashString() can run', () => {
  expect(ext(100000000).toCashString()).toBe('100,000,000')
})

test('toChineseString() can run', () => {
  expect(ext(100000000).toChineseString()).toBe('一亿')
  expect(ext(1.1).toChineseString()).toBe('一点一')
  expect(ext(1.00000001).toChineseString()).toBe('一点零零零零零零零一')
})
