# 基础工具集（baseUtils）

## 使用方式

```javascript
import { ... } from '@fssgis/utils'
// or
import * as baseUtils from '@fssgis/utils'
```

## 函数目录

| 函数                                        | 描述         |
| ------------------------------------------- | ------------ |
| [deepCopyJSON()](#deepcopyjson-obj-object ) | 深度复制     |
| [deepCopy()](#deepcopy-obj-object)          | 深度复制     |
| [createGuid()](#createguid-string)          | 创建GUID     |
| [createIntRandom()](#createguid-string)     | 创建随机整数 |
| [isFromMobileBrowser()](#isfrommobilebrowser-boolean)     | 判断网页是否通过移动端设备打开 |
| [copyText()](#copytext-text-promise-string)     | 复制文本 |
| [getArrayItemRandom()](#getarrayitemrandom-arr-array)     | 随机获取数组的其中一个子集 |
| [loadCss()](#loadcss-cssurl-void)     | 加载css |
| [loadJs()](#loadjs-jsurl-void)     | 加载js |
| [$extend()](#extend-arg0-arg1-arg2-object)     | 对象扩展 |
| [debounce()](#debounce-fn-wait-immediate-function-cancel-void)     | 防抖 |
| [throttle()](#throttle-fn-wait-options-function-cancel-void)     | 节流 |
| [listToTree()](#listtotree-list-options-array)     | 列表转树形结构 |
| [parseListField()](#listtotree-list-options-array)     | 解析列表 |
| [whenRightReturn()](#whenrightreturn-time-intervalcallback-promise)     | 异步等待结果 |
| [isPromise()](#ispromise-obj-boolean)     | 判断是否为Promise对象 |

## 功能函数

### deepCopyJSON(obj) `=> Object`

采用**JSON解析**方式的JavaScript对象深度复制/拷贝

| 参数          | 说明           |
| ------------- | -------------- |
| obj  `Object` | JavaScript对象 |

Example:

```javascript
import { deepCopyJSON } from '@fssgis/utils'

const obj = {
  num: 1, str: 'a', bool: false,
  NULL: null, UNDEFINED: undefined,
  func: function () { // will be undefined
    console.log('test')
  },
  // BIGINT: 1n // TypeError: Do not know how to serialize a BigInt
}

const newObj = deepCopyJSON(obj)
```

### deepCopy(obj) `=> Object`

采用**递归**方式的JavaScript对象深度复制/拷贝

| 参数          | 说明           |
| ------------- | -------------- |
| obj  `Object` | JavaScript对象 |

Example:

```javascript
import { deepCopy } from '@fssgis/utils'

const privateAttr = Symbol()
const obj = {
    num: 1, str: 'a', bool: false,
    NULL: null, UNDEFINED: undefined,
    func: function () {
      console.log('test')
    },
    BIGINT: 1n,
    obj: { num: 1 },
    arr: [1, 2, 3],
    cls: class {
      static str = 'hi'
    },
    [privateAttr]: ''
}

const newObj = deepCopy(obj)
```

### createGuid () `=> string`

创建GUID随机码

Example:

```javascript
import { createGuid } from '@fssgis/utils'
const guid = createGuid()
```

<CreateGuid />

### createIntRandom (minInt, maxInt) `=> number`

| 参数            | 说明     |
| --------------- | -------- |
| minInt `number` | 最小整数 |
| maxInt `number` | 最大整数 |

创建指定范围的随机整数

Example:

```javascript
import { createIntRandom } from '@fssgis/utils'
const intNum = createIntRandom()
```

<CreateIntRandom />

### isFromMobileBrowser () `=> boolean`

判断网页是否通过移动端设备打开

Example:

```js
import { isFromMobileBrowser  } from '@fssgis/utils'
const result = isFromMobileBrowser()
```

### copyText (text) `=> Promise<string>`

复制文本

| 参数          | 说明       |
| ------------- | ---------- |
| text `string` | 复制的文本 |

Example:

```js
import { copyText } from '@fssgis/utils'
const value = 'xxx'
const result = await copyText(value)
```

### getArrayItemRandom (arr) `=> Array`

随机获取数组的其中一个子集

| 参数        | 说明 |
| ----------- | ---- |
| arr `Array` | 数组 |

```js
import { getArrayItemRandom  } from '@fssgis/utils'
```

### loadCss (cssUrl) `=> void`

加载css

| 参数            | 说明        |
| --------------- | ----------- |
| cssUrl `string` | css资源路径 |

Example:

```js
import { loadCss } from '@fssgis/utils'
const cssUrl = 'xxx.css'
loadCss(cssUrl)
```

### loadJs (jsUrl) `=> void`

加载js

| 参数           | 说明       |
| -------------- | ---------- |
| jsUrl `string` | js资源路径 |

Example:

```js
import { loadjs } from '@fssgis/utils'
const jsUrl = 'xxx.js'
loadCss(jsUrl)
```

### $extend (arg0, arg1, arg2) `=> Object`

对象扩展（JQuery $.extend 实现代码），具体参考：https://api.jquery.com/jquery.extend/

Example:

```js
import { $extend } from '@fssgis/utils'
```

### debounce (fn, wait, immediate?) `=> Function & { cancel(): void }`

防抖（当持续触发事件时，一定时间段内没有再触发事件，事件处理函数才会执行一次，如果设定的时间到来之前，又一次触发了事件，就重新开始延时）

| 参数                | 说明                                |
| ------------------- | ----------------------------------- |
| fn `Function`       | 防抖函数                            |
| wait `number`       | 防抖时间戳                          |
| immediate `boolean` | 是否立即执行防抖函数，默认为`false` |

Example:

```js
import { debounce } from '@fssgis/utils'
```

### throttle (fn, wait, options?) `=> Function & { cancel(): void } `

节流（当持续触发事件时，保证一定时间段内只调用一次事件处理函数）

| 参数                       | 说明                                     |
| -------------------------- | ---------------------------------------- |
| fn `Function`              | 节流函数                                 |
| wait `number`              | 节流时间戳                               |
| options `Object`           | 配置项                                   |
| options.leading `boolean`  | 是否立即执行节流函数，默认为`true`       |
| options.trailing `boolean` | 结束节流时是否执行节流函数，默认为`true` |

```js
import { throttle } from '@fssgis/utils'
```

### listToTree (list, options?) `=> Array`

| 参数                                     | 说明                                                         |
| ---------------------------------------- | ------------------------------------------------------------ |
| list`Array`                              | 列表                                                         |
| options`Object`                          | 配置项                                                       |
| options.idField `string`                 | 子集的Id字段，默认为`'id'`                                   |
| options.parentIdField `string`           | 子集的parentId字段，默认为`'parentId'`                       |
| options.checkParentIdCallback `Function` | 判断子集是否存在parentId的回调函数，<br />默认为`parentId => !!parentId` |

列表转树形结构

```js
import { listToTree } from '@fssgis/utils'
```

### parseListField (list, parseFields) `=> Array`

解析列表

```js
import { parseListField } from '@fssgis/utils'
```

### whenRightReturn (time, intervalCallback) `=> Promise`

异步等待结果

```js
import { whenRightReturn } from '@fssgis/utils'
```

### isPromise (obj) `=> boolean`

判断是否为Promise对象

```js
import { isPromise } from '@fssgis/utils'
```
