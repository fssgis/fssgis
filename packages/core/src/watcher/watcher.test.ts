import Watcher from './watcher'

export class TestClass extends Watcher {
  public num = 0
  public str = 'a'
  public bool = true
}

test('通过get方法获取对象成员', () => {
  const testObj = new TestClass()
  const num = testObj.get('num')
  expect(num).toBe(testObj.num)
})

test('通过set方法对类成员进行赋值', () => {
  const testObj = new TestClass()
  const newVal = 'b'
  testObj.set('str', newVal)
  expect(testObj.str).toBe(newVal)
})

test('通过set方法对类成员进行赋值 方式二', () => {
  const testObj = new TestClass()
  const newVal = false
  testObj.set({
    bool: newVal
  })
  expect(testObj.bool).toBe(newVal)
})

test('通过watch方法对类成员进行监听', () => {
  const testObj = new TestClass()
  let count = 0
  testObj.watch('num', () => count++)
  testObj.num = 1
  testObj.set('num', 2)
  testObj.set({ num: -1 })
  expect(count).toBe(3)
})

test('通过remove方法接触对类成员的监听', () => {
  const testObj = new TestClass()
  let count = 0
  const handle = testObj.watch('str', () => count++)
  testObj.str = '1'
  testObj.set('str', 'feawf')
  testObj.set({ str: '  ' })
  handle.remove()
  testObj.set('str', 'feawf')
  testObj.str = '1'
  expect(count).toBe(3)
})

test('通过watch方法对多个类成员进行监听', () => {
  const testObj = new TestClass()
  let count = 0
  testObj.watch(['num', 'str', 'bool'], () => count++)
  testObj.set('str', 'feawf')
  testObj.num = 3
  testObj.set({ bool: false })
  testObj.set({ bool: false })
  expect(count).toBe(4)
})

test('watch监听回调函数的参数对象值', () => {
  const testObj = new TestClass()
  const oldStr = testObj.str
  const newStr = 'testObj.str'
  let newVal, olVal, propName, target
  testObj.watch('str', (...args) => {
    newVal = args[0]
    olVal = args[1]
    propName = args[2]
    target = args[3]
  })
  testObj.str = newStr
  expect(newVal).toBe(newStr)
  expect(olVal).toBe(oldStr)
  expect(propName).toBe('str')
  expect(target === testObj).toBe(false) // proxy代理对象不等于源对象
})

test('watch回调函数的target参数问题', () => {
  const testObj = new TestClass()
  let target, count = 0
  testObj.watch('num', (...args) => {
    count++
    target = args[3]
  })
  testObj.num = 3 // 触发监听
  target.num = 2 // 不触发监听
  expect(count).toBe(1)
  expect(testObj.num).toBe(2)
})
