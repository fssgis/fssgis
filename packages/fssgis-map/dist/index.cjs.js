'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var utils = require('@fssgis/utils');
var observable = require('@fssgis/observable');

/**
 * 基类（抽象类）
 */
class BaseClass extends observable.Observable {
    //#region 私有属性
    /**
     * 实例初始化完成状态
     */
    _loaded;
    //#endregion
    //#region 保护属性
    /**
     * 实例配置项
     */
    options_;
    //#endregion
    //#region 构造函数
    /**
     * 构造基类
     * @param options 配置项
     * @param defaultOptions 默认配置项
     */
    constructor(options = {}, defaultOptions = {}) {
        super();
        this.options_ = utils.deepCopy(defaultOptions);
        utils.$extend(true, this.options_, options);
        this._loaded = false;
        this.once('loaded', () => this._loaded = true);
    }
    //#endregion
    //#region 公有方法
    /**
     * 监听实例初始化完成
     * @param callback 实例初始化完成回调函数
     */
    when(callback) {
        return new Promise(resolve => {
            if (this._loaded) {
                callback?.();
                resolve();
            }
            else {
                this.once('loaded', () => resolve());
            }
        });
    }
}

/**
 * 地图应用类（抽象类）
 */
class FssgMapABS extends BaseClass {
    //#region 私有属性
    /**
     * 地图容器
     */
    _container;
    //#endregion
    //#region getter settter
    /**
     * 地图容器
     */
    get container() {
        return this._container;
    }
    //#endregion
    //#region 构造函数
    /**
     * 构造地图应用实例
     * @param container 地图容器
     * @param options 配置项
     * @param defaultOptions 默认配置项
     */
    constructor(container, options, defaultOptions) {
        super(options, defaultOptions);
        this._container = container;
        this._initDebug();
    }
    //#endregion
    /**
     * 初始化调试
     * @returns this
     */
    _initDebug() {
        const { debug, debugName } = this.options_;
        if (debug && debugName) {
            debug && (window[debugName] = this);
        }
        return this;
    }
    /**
     * 安装地图应用插件
     * @param plugin 地图应用插件
     * @returns this
     */
    use(plugin) {
        this.when().then(() => {
            this[plugin.pluginName] = plugin.installPlugin(this); // eslint-disable-line
            plugin.fire('loaded');
        });
        return this;
    }
}

/**
 * 地图应用插件类（抽象类）
 */
class FssgMapPluginABS extends BaseClass {
    //#region 保护属性
    /**
     * 插件名
     */
    pluginName_;
    //#endregion
    //#region getter setter
    /**
     * 插件名
     */
    get pluginName() {
        return this.pluginName_;
    }
    //#endregion
    //#region 构造函数
    /**
     *构造地图应用插件实例
     * @param pluginName 插件名
     * @param options 配置项
     * @param defaultOptions 默认配置项
     */
    constructor(pluginName, options, defaultOptions) {
        super(options, defaultOptions);
        this.pluginName_ = pluginName;
    }
}

const TIAN_DI_TU_KEY = 'd524142425d379adcf285daba823e28a';
const TDT_3857 = {
    '影像底图': `http://t0.tianditu.gov.cn/img_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=img&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILEMATRIX={level}&TILEROW={row}&TILECOL={col}&tk=${TIAN_DI_TU_KEY}`,
    '影像注记': `http://t0.tianditu.gov.cn/cia_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=cia&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILEMATRIX={level}&TILEROW={row}&TILECOL={col}&tk=${TIAN_DI_TU_KEY}`,
    '矢量底图': `http://t0.tianditu.gov.cn/vec_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=vec&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILEMATRIX={level}&TILEROW={row}&TILECOL={col}&tk=${TIAN_DI_TU_KEY}`,
    '矢量注记': `http://t0.tianditu.gov.cn/cva_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=cva&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILEMATRIX={level}&TILEROW={row}&TILECOL={col}&tk=${TIAN_DI_TU_KEY}`,
    '地形底图': `http://t0.tianditu.gov.cn/ter_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=ter&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILEMATRIX={level}&TILEROW={row}&TILECOL={col}&tk=${TIAN_DI_TU_KEY}`,
    '地形注记': `http://t0.tianditu.gov.cn/cta_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=cta&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILEMATRIX={level}&TILEROW={row}&TILECOL={col}&tk=${TIAN_DI_TU_KEY}`,
};
const TDT_4326 = {
    '影像底图': `http://t0.tianditu.gov.cn/img_c/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=img&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILEMATRIX={level}&TILEROW={row}&TILECOL={col}&tk=${TIAN_DI_TU_KEY}`,
    '影像注记': `http://t0.tianditu.gov.cn/cia_c/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=cia&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILEMATRIX={level}&TILEROW={row}&TILECOL={col}&tk=${TIAN_DI_TU_KEY}`,
    '矢量底图': `http://t0.tianditu.gov.cn/vec_c/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=vec&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILEMATRIX={level}&TILEROW={row}&TILECOL={col}&tk=${TIAN_DI_TU_KEY}`,
    '矢量注记': `http://t0.tianditu.gov.cn/cva_c/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=cva&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILEMATRIX={level}&TILEROW={row}&TILECOL={col}&tk=${TIAN_DI_TU_KEY}`,
    '地形底图': `http://t0.tianditu.gov.cn/ter_c/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=ter&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILEMATRIX={level}&TILEROW={row}&TILECOL={col}&tk=${TIAN_DI_TU_KEY}`,
    '地形注记': `http://t0.tianditu.gov.cn/cta_c/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=cta&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILEMATRIX={level}&TILEROW={row}&TILECOL={col}&tk=${TIAN_DI_TU_KEY}`,
};
const GEOQ = {
    '彩色地图': 'http://map.geoq.cn/arcgis/rest/services/ChinaOnlineCommunity/MapServer/tile/{level}/{row}/{col}',
    '灰色地图': 'http://map.geoq.cn/arcgis/rest/services/ChinaOnlineStreetGray/MapServer/tile/{level}/{row}/{col}',
    '蓝黑色地图': 'http://map.geoq.cn/arcgis/rest/services/ChinaOnlineStreetPurplishBlue/MapServer/tile/{level}/{row}/{col}',
    '暖色地图': 'http://map.geoq.cn/arcgis/rest/services/ChinaOnlineStreetWarm/MapServer/tile/{level}/{row}/{col}',
};

const MAP_CURSOR_DIC = {
    default: 'default',
    pan: 'url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABJElEQVQ4T5XTvytGcRTH8dfzJ7AZlDIo2ex+TQaDhaQkGRFhsmAXSRksTJJBMinEYlGUhcHAZjAarDr6Xt3nPi6PU99u3e857/s5n3NuRXksYAmvmMbVT6mVwssGzKIbPRhGO0bxgDNs52uKgCGsYwxzGMzBHrGGTrxlkCJgJV3EcxmrSUnkXaazhYDFUS8gcsODI9wn6CJu/wvYxQS+leYBYVaYFlFsIVMQ/swXAQOIvlpwjutfAJkvVQoOcIfDNKKb3BfKtqQK8JxGFyqaMflfQNDG0YsXjCBU/RY1JkbBR3L4j9qv62PsR9vZFJpwig3s1UGI/6MLT/kx9uEEHamVMk4rLtLUajZxCv3YwXsJoS35FJ7VALIlmkFjCSBWejP54BNJm0cR2+ErQgAAAABJRU5ErkJggg==), default',
    panning: 'url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABFUlEQVQ4T6XSvytGYRjG8c+7mFjEYjIaKAMLC4syWSxSfmR7M1gkFgyU3sFkYkBJoZR/wI+Sv0AZLUalZDHprufUeU+djjpnec7Tuc/3vu7rvhpqPo2a/ysDTOABO+hM7yN4xXW+aREwjBN8IyBZcS8esZ1gpzgLUB7QhRUMpfMcC6nbPrYSoB89eEIrAzSxjl98YiwV7yZAnNF9FjdJXdwnM8AtLnGFNwxUmBvjtQHuEV3CuANs1AGM47kCMIO1/AiH+Eoq/hONFn5izZkH07jDXtp9FeQFmzFyfo1TuMBRBaQPH1kEikEaTZCQeFwiYwmLMX8xSFn9fJK3WgKYQweWywDdyczBEkBEOqL8XgaoMrDt+x9D2DURq20LzwAAAABJRU5ErkJggg==), default',
    wait: 'wait',
    draw: 'url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAADnSURBVDhPpdG/asJQFIDxYFeV4mOIQ6GjWNDB3UEfwaGbYyedCg76BiIKfYEOYqeOgpsggpODCHasiNJJv6PnhpuQ+Cf94OdJAvfmBh1Ky0/UHrDFO2pI4gcb3FULC/zhgCmayOGmSpCFspHZxPjFB14Q2iN2MG+3NzC+cLFP2AsG6PqeZeApplP61imNMIacqiMPtDedbmEbzJHCKybyQCvodJO/0bRGFQk8YQj5jDZMcZ157LE63Vn1YH+zX12Ze88JpKXOZ512Dd+sYHa+DK6IPoLeXMZd/WuxHDnyYimLyIuv5DhHTNdI4vF9bjkAAAAASUVORK5CYII=), default',
    zoomin: 'url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABa0lEQVQ4T5XSv0vWURTH8dczNbhIpogRtERDIEoI2Q/CqbWliJZqEkTyZ4NTtUc6ND20SpCghJMuikPgkE4KimODgSj0DyTn4V64XZ7Azva9937f53PO59Pwd13HGPoxjGPs4ADvqretz0Zx+BKf0IEf+I4A3kYftnGnhmTAA2ylyxFsVg+n8BFHuFHeBeBKkni5UlQ3e4KvCNhCvgzAB8zgKZaKv/7gfTX7Ip6jF7/yDjZwCXerlu0Aj7GCR1jPgN/4jOkEiB/ryko6cYY3SXnLhVhMWBUjRGW73qYRMizOB7CbxviSFSxjCNcuMMIk5nEThxkQnYLexGgByUrKAP3EVdzCfhmkkPOsXE6bPQQomkXtpZH3yySGLT1JSQRpLYXmPl6lruF/JDTy0IKUgCDHg4k23eNoHKcItTlUzRoQD7tTt0GcpJSGU6/TCDlwrZHaAf4hQBe+4V6y92E48T+AAId9LzCHVcyeA/3HS5LDGButAAAAAElFTkSuQmCC), default',
    zoomout: 'url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABYklEQVQ4T5XSv0tVcRjH8dedHFxETSIJWsJBiESEUkOaXFsUcakmQcSfNTipe6SD08VVBIUimmwxHAQHdfKC0uigEAX9A8lz+R44Ho5c/W7n+3zP+3k+z+dTcfM8wSSe4SUucYwzLBfe1j8ruct3WEczjnCAAPbiEQ7xogjJAK+wn4qv8bPwcA6f8QtP87UAtKcRWwsTFZuNYBsBW8uKAfiEBYxip0xn7m4T43iIq2wHe2hCf4Ofo/wGXzGMHxngHzYwnwD/S0AryYUW/MXHNHndhVhMWBUS4pTale6f4yTJ2Mom+II+PL6DhFmsogvnGWAp0auYaAC5QCe6UcsHKcYZyy+nBBTSolmc0yS5lk9i2NKBmCSCtJtCM4j3qWv4HwmNPNQheUCQ48HMLTKm8AcxbRaqahEQ/z5I3XrwO6U0nJpOErLA1SWVAW7bYxu+YQCRi6Fw4j6AAId9b7GI7/hwDSbJQ5LqoLCkAAAAAElFTkSuQmCC), default',
    clear: 'url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABBElEQVQ4T9XTvyvFURjH8df9AwwGo9xMYjDwB7gDg4WVIjbJzWzCZpTFYCALm1KUpOwoNhYGk00xGAw6Ot/b6Xbu91s2p07nR5/zfs7znM+pqW7TuMJHTlqrON/EDg6w+BfABtZxjcb/AXRhJF53LElhM+7d471IJ1fEBeyXFPcOo2WAonBlD9QKnLtBD4YwGMcw/8ZDW/8NkANsY7XCHwN46gQ4w2QFYAqnnQAvqCeAL7yhL9nbwloOMIELPEdxPx5xgzm8ohfHmMkBDqMwpHEbPXCOE+zhEuM4wmw7YAm7MXLwQjBT+Ezz6MZyBKwgmO2zAAxHQVq38HmCC0NL58W6pf0BEUUzEdQNGPUAAAAASUVORK5CYII=), default',
    help: 'help'
};

class BaseToolABS extends BaseClass {
    _isOnceTool;
    _actived;
    get isOnceTool() {
        return this._isOnceTool;
    }
    get actived() {
        return this._actived;
    }
    constructor(options, defaultOptions) {
        super(options, { isOnceTool: true, ...defaultOptions });
        this._isOnceTool = !!this.options_.isOnceTool;
        this.on('tool-actived', e => this.onToolActived_(e));
        this.on('tool-deactived', e => this.onToolDeactived_(e));
    }
    //#region 保护方法
    /**
     * 工具激化处理事件
     */
    onToolActived_(e) {
        if (!this._actived) {
            return false;
        }
        return true;
    }
    /**
     * 工具失活处理事件
     */
    onToolDeactived_(e) {
        if (!this._actived) {
            return false;
        }
        this._actived = false;
        return true;
    }
    //#endregion
    //#region 公有方法
    /** 激活工具 */
    active() {
        if (this._actived) {
            return this;
        }
        this._actived = true;
        this.fire('tool-actived');
        if (this._isOnceTool) {
            this.deactive();
        }
        return this;
    }
    /** 接触工具激活状态 */
    deactive() {
        if (!this._actived) {
            return this;
        }
        this.fire('tool-deactived');
        return this;
    }
}

exports.BaseClass = BaseClass;
exports.BaseToolABS = BaseToolABS;
exports.FssgMapABS = FssgMapABS;
exports.FssgMapPluginABS = FssgMapPluginABS;
exports.GEOQ = GEOQ;
exports.MAP_CURSOR_DIC = MAP_CURSOR_DIC;
exports.TDT_3857 = TDT_3857;
exports.TDT_4326 = TDT_4326;
