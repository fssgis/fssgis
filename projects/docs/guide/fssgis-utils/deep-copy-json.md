# deepCopyJSON

## 介绍

- JavaScript对象深拷贝
- 使用JSON解析反解析方式
- `JSON.parse(JSON.stringify(/* xxx */))`

## 使用

```javascript
import { deepCopyJSON } from '@fssgis/utils'
```

## 案例

- Can't use with `bigint`, `undefined` and `function` types

<ExampleDeepCopyJSON />