import Observable from './observable'

interface Prop {
  'inc': { value: number },
  'dev': { val: number },
  'change': void
}

export class TestClass<T extends Prop> extends Observable<T & Prop> {
  private _value = 1
  constructor () {
    super()
  }
  inc () : void {
    this._value++
    this.fire('inc', {
      value: this._value
    })
    this.fire('change')
  }
  dec () : void {
    this._value--
    this.fire('dev', {
      val: this._value
    })
    this.fire('change')
  }
}

test('通过on和fire函数绑定和触发监听事件', () => {
  const testObj = new TestClass()
  let count = 0
  testObj.inc()
  testObj.on('inc', () => count++)
  testObj.inc() // +1
  testObj.inc() // +1
  testObj.on('dev', () => count++)
  testObj.dec() // +1
  testObj.dec() // +1
  expect(count).toBe(4)
})

test('监听回调函数的返回参数的对应', () => {
  const testObj = new TestClass() // value = 1
  let origin, value, name
  testObj.inc() // value = 2
  testObj.on('inc', e => {
    origin = e.origin
    value = e.value
    name = e.name
  })
  testObj.inc() // value = 3
  expect(origin).toBe(testObj)
  expect(value).toBe(3)
  expect(name).toBe('inc')
})

test('通过off方法解除监听函数的绑定状态', () => {
  const testObj = new TestClass()
  let count = 0
  const func = () => count++
  testObj.on('inc', func)
  testObj.on('dev', () => count++)
  testObj.inc() // +1
  testObj.inc() // +1
  testObj.off('inc', func)
  testObj.dec() // +1
  testObj.inc()
  testObj.dec() // +1
  expect(count).toBe(4)
})

test('通过off方法接解除所有监听函数的绑定状态', () => {
  const testObj = new TestClass()
  let count = 0
  testObj.on('inc', () => count++)
  testObj.on('inc', () => count++)
  testObj.on('dev', () => count++)
  testObj.inc() // +2
  testObj.dec() // +1
  testObj.off('inc')
  testObj.inc()
  testObj.inc()
  testObj.dec() // +1
  expect(count).toBe(4)
})

test('通过remove方法解除监听函数的绑定状态', () => {
  const testObj = new TestClass()
  let count = 0
  const handler = testObj.on('inc', () => count++)
  testObj.inc()
  handler.remove()
  testObj.inc()
  expect(count).toBe(1)
})

test('手动一次性监听方法-1', () => {
  const testObj = new TestClass()
  let count = 0
  testObj.on('inc', () => count++)
  const handler = testObj.on('inc', () => {
    count++
    handler.remove()
  })
  testObj.inc()
  testObj.inc()
  expect(count).toBe(3)
})

test('手动一次性监听方法-1', () => {
  const testObj = new TestClass()
  let count = 0
  const handler = testObj.on('inc', () => {
    count++
    handler.remove()
  })
  testObj.inc()
  testObj.inc()
  expect(count).toBe(1)
})

test('使用once方法进行一次性监听', () => {
  const testObj = new TestClass()
  let count = 0
  testObj.once('inc', e => count += e.value)
  testObj.inc()
  testObj.inc()
  testObj.inc()
  expect(count).toBe(2)
})

test('多次执行off函数不会异常-1', () => {
  const testObj = new TestClass()
  let count = 0
  const func = () => count++
  testObj.on('inc', func)
  testObj.on('dev', () => count++)
  testObj.inc() // +1
  testObj.inc() // +1
  testObj.off('inc', func)
  testObj.off('inc', func)
  testObj.dec() // +1
  testObj.inc()
  testObj.dec() // +1
  expect(count).toBe(4)
})

test('多次执行off函数不会异常-2', () => {
  const testObj = new TestClass()
  let count = 0
  const func = () => count++
  testObj.on('inc', func)
  testObj.on('dev', () => count++)
  testObj.inc() // +1
  testObj.inc() // +1
  testObj.off('inc')
  testObj.off('inc')
  testObj.dec() // +1
  testObj.inc()
  testObj.dec() // +1
  expect(count).toBe(4)
})

test('off未层on的监听类型不会异常', () => {
  const testObj = new TestClass()
  testObj.off('inc')
  testObj.off('inc')
  let count = 0
  testObj.on('change', () => count++)
  testObj.inc()
  testObj.dec()
  expect(count).toBe(2)
})
