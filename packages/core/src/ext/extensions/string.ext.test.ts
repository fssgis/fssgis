/* eslint-disable no-undef */
import ext from './string.ext'

test('trimAll() can run', () => {
  const str = '  tes  test  '
  const newStr = ext(str).trimAll()
  expect(newStr).toBe('testest')
})

test('toDate() can run', () => {
  const dateStr = '2020/1/1'
  const date = ext(dateStr).toDate()
  expect(date.getFullYear()).toBe(2020)
})

test('toDateFormat() can run', () => {
  const dateStr = '2020/1/1'
  const year = ext(dateStr).toDateFormat('yyyy')
  expect(year).toBe('2020')
})
