# @fssgis/utils

![npm version](https://img.shields.io/npm/v/@fssgis/utils.svg)    ![downloads-badge](https://img.shields.io/npm/dm/@fssgis/utils.svg?color=orange)

## 介绍

JavaScript工具库，即**代码片段**的收集。

- use `TypeScript`
- build with `Rollup` 
- support `ESM` and `CMJ`

## 基本使用

```bash
npm i @fssgis/utils
```

```javascript
import { /* ... */ } from '@fssgis/utils'
```

## 函数目录

| 函数                                        | 描述         |
| ------------------------------------------- | ------------ |
| `deepCopyJSON()` | 深度复制     |
| `deepCopy()`          | 深度复制     |
| `createGuid()`          | 创建GUID     |
| `createIntRandom()`     | 创建随机整数 |
| `isFromMobileBrowser()`     | 判断网页是否通过移动端设备打开 |
| `copyText()`     | 复制文本 |
| `getArrayItemRandom()`     | 随机获取数组的其中一个子集 |
| `loadCss()`     | 加载css |
| `loadJs()`     | 加载js |
| `$extend()`     | 对象扩展 |
| `debounce()`     | 防抖 |
| `throttle()`     | 节流 |
| `listToTree()`     | 列表转树形结构 |
| `parseListField()`     | 解析列表 |
| `whenRightReturn()`     | 异步等待结果 |
| `isPromise()`     | 判断是否为Promise对象 |