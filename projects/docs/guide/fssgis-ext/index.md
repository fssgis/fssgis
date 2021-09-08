# @fssgis/ext

![npm version](https://img.shields.io/npm/v/@fssgis/ext.svg)    ![downloads-badge](https://img.shields.io/npm/dm/@fssgis/ext.svg?color=orange)

## 介绍

JavaScript原型扩展装饰器

- use `TypeScript`
- build with `Rollup` 
- support `ESM` and `CMJ`
- 单例模式

## 基本使用

```bash
npm i @fssgis/ext
```

```javascript
import { ext } from '@fssgis/ext'
```

## 原型扩展支持项

- `ext(arg: Date)` 日期对象扩展
- `ext(arg: Number)`  数值对象扩展
- `ext(arg: String)`  字符串对象扩展
- `ext(arg: Array)`  数组对象拓展