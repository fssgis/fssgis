import * as baseUtils from './base.utils'

test('使用JSON方法进行深拷贝', () => {
  const a = {
    num: 1, str: 'a', bool: false,
    NULL: null,
    UNDEFINED: undefined,
    func: function () { // will be undefined
      console.log('test')
    },
    // BIGINT: 1n // TypeError: Do not know how to serialize a BigInt
  }
  const b = baseUtils.deepCopyJSON(a)
  expect(b.num).toBe(a.num)
  expect(b.str).toBe(a.str)
  expect(b.bool === a.bool).toBe(true)
  expect(b.NULL).toBe(a.NULL)
  expect(b.UNDEFINED).toBe(a.UNDEFINED)
  expect(b.func).toBe(undefined)
})

test('使用递归方法进行深拷贝', () => {
  const privateAttr = Symbol()
  const a = {
    num: 1, str: 'a', bool: false,
    NULL: null,
    UNDEFINED: undefined,
    func: function () {
      console.log('test')
    },
    BIGINT: 1n,
    obj: {
      num: 1
    },
    arr: [1, 2, 3],
    cls: class {
      static str = 'hi'
    },
    [privateAttr]: ''
  }
  const b = baseUtils.deepCopy(a)
  expect(b.num).toBe(a.num)
  expect(b.str).toBe(a.str)
  expect(b.bool === a.bool).toBe(true)
  expect(b.NULL).toBe(a.NULL)
  expect(b.UNDEFINED).toBe(a.UNDEFINED)
  expect(b.func).toBe(a.func)
  expect(b.BIGINT).toBe(a.BIGINT)
  expect(b.obj === a.obj).toBe(false)
  expect(b.obj.num).toBe(a.obj.num)
  expect(b.arr.length).toBe(a.arr.length)
  expect(b.arr === a.arr).toBe(false)
  expect(b.cls.str).toBe(b.cls.str)
  expect(b[privateAttr] === a[privateAttr]).toBe(false)
})

test('创建GUID', () => {
  expect(baseUtils.createGuid() === baseUtils.createGuid()).toBe(false)
})

test('创建指定范围的随机整数', () => {
  const min = 0, max = 2
  expect([0, 1, 2].includes(baseUtils.createIntRandom(min, max))).toBe(true)
  expect([0, 1, 2].includes(baseUtils.createIntRandom(min, max))).toBe(true)
  expect([0, 1, 2].includes(baseUtils.createIntRandom(min, max))).toBe(true)
  expect([0, 1, 2].includes(baseUtils.createIntRandom(min, max))).toBe(true)
  expect([0, 1, 2].includes(baseUtils.createIntRandom(min, max))).toBe(true)
})

test('随机获取数组的其中一个子集', () => {
  const arr = [0, 1, 2]
  expect(arr.includes(baseUtils.getArrayItemRandom(arr))).toBe(true)
  expect(arr.includes(baseUtils.getArrayItemRandom(arr))).toBe(true)
  expect(arr.includes(baseUtils.getArrayItemRandom(arr))).toBe(true)
  expect(arr.includes(baseUtils.getArrayItemRandom(arr))).toBe(true)
  expect(arr.includes(baseUtils.getArrayItemRandom(arr))).toBe(true)
})

test('列表转树形结构', () => {
  const entries = [
    {
      'id': '12', 'parentId': '0',
      'text': 'Man', 'level': '1',
    }, {
      'id': '6', 'parentId': '12',
      'text': 'Boy', 'level': '2',
    }, {
      'id': '7', 'parentId': '12',
      'text': 'Other', 'level': '2',
    }, {
      'id': '9', 'parentId': '0',
      'text': 'Woman', 'level': '1',
    }, {
      'id': '11', 'parentId': '9',
      'text': 'Girl', 'level': '2',
    }
  ]
  const tree = baseUtils.listToTree(entries, { checkParentIdCallback: pid => pid !== '0' })
  expect(tree.length).toBe(2)
  // expect(!!(entries[0] as any).children).toBe(false)
  expect((entries[0] as any).children.length).toBe(2) // eslint-disable-line
})

test('解析列表', () => {
  const list = [
    { a: '1', b: 2 }
  ]
  const newList = baseUtils.parseListField<{ A: string, B: number }, typeof list[0]>(list, [
    ['a', 'A']
  ])
  expect(newList[0].A).toBe(list[0].a)
})
