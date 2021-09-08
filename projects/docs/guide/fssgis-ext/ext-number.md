# extNumber

## 介绍

- 数值对象扩展器

## 使用

```javascript
import { ext } from '@fssgis/ext'
```

or

```javascript
import { extNumber } from '@fssgis/ext'
```

## 案例

### 数值的中文表达转换

```javascript
import { ext } from '@fssgis/ext'
ext(100).toChineseString() // output: 一百
```

<ExampleNumberToChinese />

## Todos

- [ ] fix bug with 负数
- [ ] fix bug with 10（need "十", nor "一十"）