# 基础地图库 @fssgis/fssg-map

## 介绍

- 基于业务功能型的二次开发标准库
- 逻辑抽象、继承设计

## 安装与使用

```shell
npm install --save @fssgis/fssg-map
```

```js
import { xxx } from '@fssgis/fssg-map'
```

## 接口与对象

| 类                              | 描述       |
| ------------------------------- | ---------- |
| [BaseClass](#baseclass)         | 基类       |
| [FssgMap](#fssgmap)             | 地图应用类 |
| [FssgMapPlugin](#fssgmapplugin) | 地图插件类 |

| 接口                  | 描述               |
| --------------------- | ------------------ |
| IBaseClassEvents      | 基类事件集接口     |
| IBaseClassOptions     | 基类配置项接口     |
| IFssgMapEvents        | 地图应用事件集接口 |
| IFssgMapOptions       | 地图应用配置项接口 |
| IFssgMapContainer     | 地图容器接口       |
| IFssgMapPluginEvents  | 地图插件事件集接口 |
| IFssgMapPluginOptions | 地图插件配置项接口 |

## BaseClass

```js
import { BaseClass } from '@fssgis/fssg-map'
```

**继承：**`BaseClass` → `Observable`

**子类：**`FssgMap`, `FssgMapPlugin`

[BaseClass](#baseclass)类起着基础类的作用。

### 构造函数

`new BaseClass(options?, defaultOptions?)`

| 构造函数参数                       | 描述       |
| ---------------------------------- | ---------- |
| options `IBaseClassOptions`        | 配置项     |
| defaultOptions `IBaseClassOptions` | 默认配置项 |

### 属性

| 访问修饰 | 成员名     | 类型                         | 描述                 | 所属类                  |
| -------- | ---------- | ---------------------------- | -------------------- | ----------------------- |
| 私有     | _eventPool | `Map<string, ICallbackFunc>` | 事件池               | Observable              |
| 私有     | _loaded    | `boolean`                    | 记录类的加载完成状态 | [BaseClass](#baseclass) |
| 保护     | options_   | `IBaseClassOptions`          | 配置项               | [BaseClass](#baseclass) |

### 方法

| 访问修饰 | 成员名                   | 返回类型  | 描述                     | 所属类                  |
| -------- | ------------------------ | --------- | ------------------------ | ----------------------- |
| 公有     | on()                     | `IHandle` | 绑定监听函数             | Observable              |
| 公有     | off()                    |           | 移除监听函数             | Observable              |
| 公有     | fire()                   | `this`    | 触发监听函数             | Observable              |
| 公有     | once()                   |           | 绑定仅执行一次的监听函数 | Observable              |
| 公有     | [when()](#when-callback) | `Promise` | 监听实例初始化完成       | [BaseClass](#baseclass) |

#### when(callback?)

当实例对象的<u>首次触发`loaded`事件</u>时或<u>`_loaded`属性为true</u>时触发回调及resolve。

## FssgMap

```js
import { FssgMap } from '@fssgis/fssg-map'
```

**继承：**`FssgMap` → `BaseClass` → `Observable`

FssgMap类是地图应用的入口类。

### 构造函数

`new BaseClass(container, options?, defaultOptions?)`

| 构造函数参数                       | 描述       |
| ---------------------------------- | ---------- |
| container `IFssgMapContainer`      | 地图容器   |
| options `IBaseClassOptions`        | 配置项     |
| defaultOptions `IBaseClassOptions` | 默认配置项 |

### 属性

| 访问修饰 | 成员名     | 类型                         | 描述                 | 所属类                  |
| -------- | ---------- | ---------------------------- | -------------------- | ----------------------- |
| 私有     | _eventPool | `Map<string, ICallbackFunc>` | 事件池               | Observable              |
| 私有     | _loaded    | `boolean`                    | 记录类的加载完成状态 | [BaseClass](#baseclass) |
| 保护     | options_   | `IBaseClassOptions`          | 配置项               | [BaseClass](#baseclass) |
| 私有     | _container | `IFssgMapContainer`          | 地图容器             | [FssgMap](#fssgmap)     |
| 公有     | container  | `IFssgMapContainer`          | 地图容器，**只读**   | [FssgMap](#fssgmap)     |

### 方法

| 访问修饰 | 成员名                   | 返回类型  | 描述                       | 所属类                  |
| -------- | ------------------------ | --------- | -------------------------- | ----------------------- |
| 公有     | on()                     | `IHandle` | 绑定监听函数               | Observable              |
| 公有     | off()                    |           | 移除监听函数               | Observable              |
| 公有     | fire()                   | `this`    | 触发监听函数               | Observable              |
| 公有     | once()                   |           | 绑定仅执行一次的监听函数   | Observable              |
| 公有     | [when()](#when-callback) | `Promise` | 监听实例初始化完成         | [BaseClass](#baseclass) |
| 私有     | _initDebug()             | `this`    | 初始化调试                 | [FssgMap](#fssgmap)     |
| 公有     | [use()](#use-plugin)     | `this`    | 安装地图插件               | [FssgMap](#fssgmap)     |
| 公有     | [mount()](#mount)        | `this`    | 安装地图应用，**抽象方法** | [FssgMap](#fssgmap)     |

#### use(plugin?)

安装地图应用插件，并当[FssgMap](#fssgmap)实例的`_loaded`属性值为`true`之后，地图应用插件实例的[installPlugin()](#installplugin-fssgmap)方法会执行，随后触发地图应用插件实例的`loaded`事件。

#### mount()

通常负责地图应用实例的初始化

## FssgMapPlugin

```js
import { FssgMapPlgin } from '@fssgis/fssg-map'
```

**继承：**`FssgMapPlugin` → `BaseClass` → `Observable`

FssgMapPlugin类是地图插件类，通过[FssgMap](#fssgmap)实例的[use()](#use-plugin)方法能够将插件实例绑定到[FssgMap](#fssgmap)上。

### 构造函数

`new BaseClass(options?, defaultOptions?)`

| 构造函数参数                       | 描述       |
| ---------------------------------- | ---------- |
| options `IBaseClassOptions`        | 配置项     |
| defaultOptions `IBaseClassOptions` | 默认配置项 |

### 属性

| 访问修饰 | 成员名      | 类型                         | 描述                 | 所属类                          |
| -------- | ----------- | ---------------------------- | -------------------- | ------------------------------- |
| 私有     | _eventPool  | `Map<string, ICallbackFunc>` | 事件池               | Observable                      |
| 私有     | _loaded     | `boolean`                    | 记录类的加载完成状态 | [BaseClass](#baseclass)         |
| 保护     | options_    | `IBaseClassOptions`          | 配置项               | [BaseClass](#baseclass)         |
| 私有     | _pluginName | `string`                     | 插件名               | [FssgMapPlugin](#fssgmapplugin) |
| 公有     | pluginName  | `string`                     | 插件名，**只读**     | [FssgMapPlugin](#fssgmapplugin) |

### 方法

| 访问修饰 | 成员名                                    | 返回类型  | 描述                     | 所属类                          |
| -------- | ----------------------------------------- | --------- | ------------------------ | ------------------------------- |
| 公有     | on()                                      | `IHandle` | 绑定监听函数             | Observable                      |
| 公有     | off()                                     |           | 移除监听函数             | Observable                      |
| 公有     | fire()                                    | `this`    | 触发监听函数             | Observable                      |
| 公有     | once()                                    |           | 绑定仅执行一次的监听函数 | Observable                      |
| 公有     | [when()](#when-callback)                  | `Promise` | 监听实例初始化完成       | [BaseClass](#baseclass)         |
| 公有     | [installPlugin()](#installplugin-fssgmap) | `this`    | 安装插件                 | [FssgMapPlugin](#fssgmapplugin) |

#### installPlugin(fssgMap?)

安装插件，负责地图插件的初始化。

## IBaseClassEvents

| 事件名 | 事件参数类型 | 描述               |
| ------ | ------------ | ------------------ |
| loaded |              | 类加载完成触发事件 |

## IFssgMapOptions

| 成员      | 类型      | 描述                                       |
| --------- | --------- | ------------------------------------------ |
| debug     | `boolean` | 是否启动调试，即是否将类挂载到window对象上 |
| debugName | `string`  | 挂载到window对象上的实例名                 |