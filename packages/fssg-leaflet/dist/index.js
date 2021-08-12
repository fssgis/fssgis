import { FssgMap, FssgMapPlugin } from '@fssgis/fssg-map';
import { map, point, latLng, icon, marker, Icon, LayerGroup, tileLayer } from 'leaflet';
import { $extend } from '@fssgis/utils';

/**
 * 深度复制（采用JSON解析方式）
 * @param obj 复制对象
 */
function isNullOrUndefined(obj) {
    return obj === null || obj === undefined;
}

/**
 * 地图应用
 */
class FssgLeaflet extends FssgMap {
    basemap;
    mapElement;
    /**
     * leaflet地图实例
     */
    _map;
    /**
     * leaflet地图实例
     */
    get map() {
        return this._map;
    }
    /**
     * 构造地图应用
     * @param container 地图容器
     * @param options 配置项
     */
    constructor(container, options = {}) {
        super(container, options, {
            debugName: 'fssgLeaflet',
            debug: false,
            mapOptions: {
                zoom: 1,
                center: [0, 0],
                zoomControl: true,
                attributionControl: false,
            }
        });
    }
    /**
     * 初始化地图实例
     * @returns this
     */
    _initMap() {
        this._map = Object.assign(map(this.container, this.options_.mapOptions), { $owner: this });
        return this;
    }
    /**
     * 定位
     * @param latLng 经纬度对象
     * @param zoom 缩放等级
     * @param options 配置项
     * @returns this
     */
    _locateTo(latLng, zoom, options) {
        zoom = zoom ?? this._map.getZoom();
        this._map.flyTo(latLng, zoom, {
            ...options,
        });
        return this;
    }
    /**
     * 安装地图应用
     * @returns this
     */
    mount() {
        return this
            ._initMap()
            .fire('loaded');
    }
    /**
     * 定位
     * @param options 配置项
     * @returns this
     */
    locateTo(options) {
        const { x, y, lon, lat, zoom, ...zoomPanOptions } = options;
        if (!isNullOrUndefined(x) && !isNullOrUndefined(y)) {
            const latLng = this.xyToLatLng(point(x, y));
            this._locateTo(latLng, zoom, zoomPanOptions);
            return this;
        }
        if (!isNullOrUndefined(lon) && !isNullOrUndefined(lat)) {
            this._locateTo(latLng(lat, lon), zoom, zoomPanOptions);
            return this;
        }
        return this;
    }
    /**
     * 经纬度转投影坐标
     * @param _latLng 经纬度
     * @returns 投影坐标
     */
    latLngToXY(_latLng) {
        const crs = this.options_.mapOptions?.crs;
        if (crs) {
            return crs.project(_latLng);
        }
        return this._map.project(_latLng);
    }
    /**
     * 经纬度转投影坐标
     * @param xy 投影坐标
     * @returns 经纬度
     */
    xyToLatLng(xy) {
        const crs = this.options_.mapOptions?.crs;
        const _xy = point(xy.x, xy.y);
        if (crs) {
            return crs.unproject(_xy);
        }
        return this._map.unproject(_xy);
    }
    /**
     * 获取中心点经纬度和投影坐标信息
     * @returns 中心点的经纬度和投影坐标信息
     */
    getCenter() {
        const _latlng = this._map.getCenter();
        const xy = this.latLngToXY(_latlng);
        return {
            x: xy.x,
            y: xy.y,
            lon: _latlng.lng,
            lat: _latlng.lat,
        };
    }
    /**
     * 经纬度对象转leaflet敬畏度对象
     * @param lonlat 经纬度
     * @returns leaflet经纬度对象
     */
    lonlatToLatlng(lonlat) {
        return latLng(lonlat.lat, lonlat.lon);
    }
    /**
     * 经纬度转投影坐标
     * @param lonlat 经纬度
     * @returns 投影坐标
     */
    lonlatToXY(lonlat) {
        const _latlng = this.lonlatToLatlng(lonlat);
        return this.latLngToXY(_latlng);
    }
}

class FssgLeafletPlugin extends FssgMapPlugin {
    /**
     * leaflet地图实例
     */
    map_;
    /**
     * 绑定的地图应用实例
     */
    get $() {
        return this.map_.$owner;
    }
    /**
     * 安装插件
     * @param fssgLeaflet 地图应用实例
     * @returns this
     */
    installPlugin(fssgLeaflet) {
        this.map_ = fssgLeaflet.map;
        return this;
    }
}

/**
 * 图元控制插件
 */
class MapElement extends FssgLeafletPlugin {
    /**
     * 图元存储池
     */
    _elementPool;
    /**
     * 构造图元控制插件
     * @param options 配置项
     */
    constructor(options) {
        super(options, {});
        this._elementPool = new Set();
    }
    /**
     * 添加图元
     * @param layer 图元
     * @returns this
     */
    add(layer) {
        this._elementPool.add(layer.addTo(this.map_));
        return this;
    }
    addMarkerByXY(xy, iconOptions, options) {
        let leafletIcon = undefined;
        if (iconOptions) {
            leafletIcon = icon(iconOptions);
        }
        const latlng = this.$.xyToLatLng(xy);
        const _marker = marker(latlng, {
            icon: leafletIcon ?? new Icon.Default(),
            ...options,
        }).addTo(this.map_);
        this._elementPool.add(_marker);
        return _marker;
    }
    clearAll() {
        this._elementPool.forEach(item => item.removeFrom(this.map_));
        this._elementPool.clear();
        return this;
    }
    setMarkersByList(list, options) {
        this.clearAll();
        const { xField, yField, labelField, iconUrlField, iconOptions, labelOptions, classNameField } = options;
        list.forEach(item => {
            const x = item[xField];
            const y = item[yField];
            const label = item[labelField];
            const className = item[classNameField ?? ''];
            let _icon;
            if (iconUrlField) {
                _icon = icon({ iconUrl: item[iconUrlField], ...iconOptions });
            }
            const _marker = marker(this.$.xyToLatLng({ x, y }), { icon: _icon ?? new Icon.Default() })
                .bindTooltip(label, { permanent: true, sticky: true, className, ...labelOptions });
            this.add(_marker);
        });
        return this;
    }
}
/*
    Leaflet.label, a plugin that adds labels to markers and vectors for Leaflet powered maps.
    (c) 2012-2013, Jacob Toye, Smartrak

    https://github.com/Leaflet/Leaflet.label
    http://leafletjs.com
    https://github.com/jacobtoye
*/
// ;(function (window, document) {
//   (L as any).labelVersion = '0.2.2-dev'
//   ;(L as any).Label = L.Class.extend({
//     includes: L.Mixin.Events,
//     options: {
//       className: '',
//       clickable: false,
//       direction: 'right',
//       noHide: false,
//       offset: [12, -15], // 6 (width of the label triangle) + 6 (padding)
//       opacity: 1,
//       zoomAnimation: true
//     },
//     initialize: function (options, source) {
//       L.setOptions(this, options)
//       this._source = source
//       this._animated = L.Browser.any3d && this.options.zoomAnimation
//       this._isOpen = false
//     },
//     onAdd: function (map) {
//       this._map = map
//       this._pane = this.options.pane ? map._panes[this.options.pane] :
//         this._source instanceof L.Marker ? map._panes.markerPane : map._panes.popupPane
//       if (!this._container) {
//         this._initLayout()
//       }
//       this._pane.appendChild(this._container)
//       this._initInteraction()
//       this._update()
//       this.setOpacity(this.options.opacity)
//       map
//         .on('moveend', this._onMoveEnd, this)
//         .on('viewreset', this._onViewReset, this)
//       if (this._animated) {
//         map.on('zoomanim', this._zoomAnimation, this)
//       }
//       if (L.Browser.touch && !this.options.noHide) {
//         L.DomEvent.on(this._container, 'click', this.close, this)
//         map.on('click', this.close, this)
//       }
//     },
//     onRemove: function (map) {
//       this._pane.removeChild(this._container)
//       map.off({
//         zoomanim: this._zoomAnimation,
//         moveend: this._onMoveEnd,
//         viewreset: this._onViewReset
//       }, this)
//       this._removeInteraction()
//       this._map = null
//     },
//     setLatLng: function (latlng) {
//       this._latlng = L.latLng(latlng)
//       if (this._map) {
//         this._updatePosition()
//       }
//       return this
//     },
//     setContent: function (content) {
//       // Backup previous content and store new content
//       this._previousContent = this._content
//       this._content = content
//       this._updateContent()
//       return this
//     },
//     close: function () {
//       const map = this._map
//       if (map) {
//         if (L.Browser.touch && !this.options.noHide) {
//           L.DomEvent.off(this._container, 'click', this.close)
//           map.off('click', this.close, this)
//         }
//         map.removeLayer(this)
//       }
//     },
//     updateZIndex: function (zIndex) {
//       this._zIndex = zIndex
//       if (this._container && this._zIndex) {
//         this._container.style.zIndex = zIndex
//       }
//     },
//     setOpacity: function (opacity) {
//       this.options.opacity = opacity
//       if (this._container) {
//         L.DomUtil.setOpacity(this._container, opacity)
//       }
//     },
//     _initLayout: function () {
//       this._container = L.DomUtil.create('div', 'leaflet-label ' + this.options.className + ' leaflet-zoom-animated')
//       this.updateZIndex(this._zIndex)
//     },
//     _update: function () {
//       if (!this._map) {
//  return
// }
//       this._container.style.visibility = 'hidden'
//       this._updateContent()
//       this._updatePosition()
//       this._container.style.visibility = ''
//     },
//     _updateContent: function () {
//       if (!this._content || !this._map || this._prevContent === this._content) {
//         return
//       }
//       if (typeof this._content === 'string') {
//         this._container.innerHTML = this._content
//         this._prevContent = this._content
//         this._labelWidth = this._container.offsetWidth
//       }
//     },
//     _updatePosition: function () {
//       const pos = this._map.latLngToLayerPoint(this._latlng)
//       this._setPosition(pos)
//     },
//     _setPosition: function (pos) {
//       const map = this._map,
//         container = this._container,
//         centerPoint = map.latLngToContainerPoint(map.getCenter()),
//         labelPoint = map.layerPointToContainerPoint(pos),
//         direction = this.options.direction,
//         labelWidth = this._labelWidth,
//         offset = L.point(this.options.offset)
//       // position to the right (right or auto & needs to)
//       if (direction === 'right' || direction === 'auto' && labelPoint.x < centerPoint.x) {
//         L.DomUtil.addClass(container, 'leaflet-label-right')
//         L.DomUtil.removeClass(container, 'leaflet-label-left')
//         pos = pos.add(offset)
//       } else { // position to the left
//         L.DomUtil.addClass(container, 'leaflet-label-left')
//         L.DomUtil.removeClass(container, 'leaflet-label-right')
//         pos = pos.add(L.point(-offset.x - labelWidth, offset.y))
//       }
//       L.DomUtil.setPosition(container, pos)
//     },
//     _zoomAnimation: function (opt) {
//       const pos = this._map._latLngToNewLayerPoint(this._latlng, opt.zoom, opt.center).round()
//       this._setPosition(pos)
//     },
//     _onMoveEnd: function () {
//       if (!this._animated || this.options.direction === 'auto') {
//         this._updatePosition()
//       }
//     },
//     _onViewReset: function (e) {
//       /* if map resets hard, we must update the label */
//       if (e && e.hard) {
//         this._update()
//       }
//     },
//     _initInteraction: function () {
//       if (!this.options.clickable) {
//  return
// }
//       const container = this._container,
//         events = ['dblclick', 'mousedown', 'mouseover', 'mouseout', 'contextmenu']
//       L.DomUtil.addClass(container, 'leaflet-clickable')
//       L.DomEvent.on(container, 'click', this._onMouseClick, this)
//       for (let i = 0; i < events.length; i++) {
//         L.DomEvent.on(container, events[i], this._fireMouseEvent, this)
//       }
//     },
//     _removeInteraction: function () {
//       if (!this.options.clickable) {
//  return
// }
//       const container = this._container,
//         events = ['dblclick', 'mousedown', 'mouseover', 'mouseout', 'contextmenu']
//       L.DomUtil.removeClass(container, 'leaflet-clickable')
//       L.DomEvent.off(container, 'click', this._onMouseClick, this)
//       for (let i = 0; i < events.length; i++) {
//         L.DomEvent.off(container, events[i], this._fireMouseEvent, this)
//       }
//     },
//     _onMouseClick: function (e) {
//       if (this.hasEventListeners(e.type)) {
//         L.DomEvent.stopPropagation(e)
//       }
//       this.fire(e.type, {
//         originalEvent: e
//       })
//     },
//     _fireMouseEvent: function (e) {
//       this.fire(e.type, {
//         originalEvent: e
//       })
//       // TODO proper custom event propagation
//       // this line will always be called if marker is in a FeatureGroup
//       if (e.type === 'contextmenu' && this.hasEventListeners(e.type)) {
//         L.DomEvent.preventDefault(e)
//       }
//       if (e.type !== 'mousedown') {
//         L.DomEvent.stopPropagation(e)
//       } else {
//         L.DomEvent.preventDefault(e)
//       }
//     }
//   })
//   // This object is a mixin for L.Marker and L.CircleMarker. We declare it here as both need to include the contents.
//   ;(L as any).BaseMarkerMethods = {
//     showLabel: function () {
//       if (this.label && this._map) {
//         this.label.setLatLng(this._latlng)
//         this._map.showLabel(this.label)
//       }
//       return this
//     },
//     hideLabel: function () {
//       if (this.label) {
//         this.label.close()
//       }
//       return this
//     },
//     setLabelNoHide: function (noHide) {
//       if (this._labelNoHide === noHide) {
//         return
//       }
//       this._labelNoHide = noHide
//       if (noHide) {
//         this._removeLabelRevealHandlers()
//         this.showLabel()
//       } else {
//         this._addLabelRevealHandlers()
//         this.hideLabel()
//       }
//     },
//     bindLabel: function (content, options) {
//       const labelAnchor = this.options.icon ? this.options.icon.options.labelAnchor : this.options.labelAnchor
//       let anchor = L.point(labelAnchor) || L.point(0, 0)
//       anchor = anchor.add(L.Label.prototype.options.offset)
//       if (options && options.offset) {
//         anchor = anchor.add(options.offset)
//       }
//       options = L.Util.extend({offset: anchor}, options)
//       this._labelNoHide = options.noHide
//       if (!this.label) {
//         if (!this._labelNoHide) {
//           this._addLabelRevealHandlers()
//         }
//         this
//           .on('remove', this.hideLabel, this)
//           .on('move', this._moveLabel, this)
//           .on('add', this._onMarkerAdd, this)
//         this._hasLabelHandlers = true
//       }
//       // eslint-disable-next-line
//       // @ts-ignore
//       this.label = new L.Label(options, this)
//         .setContent(content)
//       return this
//     },
//     unbindLabel: function () {
//       if (this.label) {
//         this.hideLabel()
//         this.label = null
//         if (this._hasLabelHandlers) {
//           if (!this._labelNoHide) {
//             this._removeLabelRevealHandlers()
//           }
//           this
//             .off('remove', this.hideLabel, this)
//             .off('move', this._moveLabel, this)
//             .off('add', this._onMarkerAdd, this)
//         }
//         this._hasLabelHandlers = false
//       }
//       return this
//     },
//     updateLabelContent: function (content) {
//       if (this.label) {
//         this.label.setContent(content)
//       }
//     },
//     getLabel: function () {
//       return this.label
//     },
//     _onMarkerAdd: function () {
//       if (this._labelNoHide) {
//         this.showLabel()
//       }
//     },
//     _addLabelRevealHandlers: function () {
//       this
//         .on('mouseover', this.showLabel, this)
//         .on('mouseout', this.hideLabel, this)
//       if (L.Browser.touch) {
//         this.on('click', this.showLabel, this)
//       }
//     },
//     _removeLabelRevealHandlers: function () {
//       this
//         .off('mouseover', this.showLabel, this)
//         .off('mouseout', this.hideLabel, this)
//       if (L.Browser.touch) {
//         this.off('click', this.showLabel, this)
//       }
//     },
//     _moveLabel: function (e) {
//       this.label.setLatLng(e.latlng)
//     }
//   }
//   // Add in an option to icon that is used to set where the label anchor is
//   L.Icon.Default.mergeOptions({
//     labelAnchor: new L.Point(9, -20)
//   })
//   // Have to do this since Leaflet is loaded before this plugin and initializes
//   // L.Marker.options.icon therefore missing our mixin above.
//   L.Marker.mergeOptions({
//     icon: new L.Icon.Default()
//   })
//   L.Marker.include((L as any).BaseMarkerMethods)
//   L.Marker.include({
//     _originalUpdateZIndex: (L.Marker.prototype as any)._updateZIndex,
//     _updateZIndex: function (offset) {
//       const zIndex = this._zIndex + offset
//       this._originalUpdateZIndex(offset)
//       if (this.label) {
//         this.label.updateZIndex(zIndex)
//       }
//     },
//     _originalSetOpacity: L.Marker.prototype.setOpacity,
//     setOpacity: function (opacity, labelHasSemiTransparency) {
//       this.options.labelHasSemiTransparency = labelHasSemiTransparency
//       this._originalSetOpacity(opacity)
//     },
//     _originalUpdateOpacity: (L.Marker.prototype as any)._updateOpacity,
//     _updateOpacity: function () {
//       const absoluteOpacity = this.options.opacity === 0 ? 0 : 1
//       this._originalUpdateOpacity()
//       if (this.label) {
//         this.label.setOpacity(this.options.labelHasSemiTransparency ? this.options.opacity : absoluteOpacity)
//       }
//     },
//     _originalSetLatLng: L.Marker.prototype.setLatLng,
//     setLatLng: function (latlng) {
//       if (this.label && !this._labelNoHide) {
//         this.hideLabel()
//       }
//       return this._originalSetLatLng(latlng)
//     }
//   })
//   // Add in an option to icon that is used to set where the label anchor is
//   L.CircleMarker.mergeOptions({
//     labelAnchor: new L.Point(0, 0)
//   })
//   L.CircleMarker.include((L as any).BaseMarkerMethods)
//   L.Path.include({
//     bindLabel: function (content, options) {
//       if (!this.label || this.label.options !== options) {
//         // eslint-disable-next-line
//         // @ts-ignore
//         this.label = new L.Label(options, this)
//       }
//       this.label.setContent(content)
//       if (!this._showLabelAdded) {
//         this
//           .on('mouseover', this._showLabel, this)
//           .on('mousemove', this._moveLabel, this)
//           .on('mouseout remove', this._hideLabel, this)
//         if (L.Browser.touch) {
//           this.on('click', this._showLabel, this)
//         }
//         this._showLabelAdded = true
//       }
//       return this
//     },
//     unbindLabel: function () {
//       if (this.label) {
//         this._hideLabel()
//         this.label = null
//         this._showLabelAdded = false
//         this
//           .off('mouseover', this._showLabel, this)
//           .off('mousemove', this._moveLabel, this)
//           .off('mouseout remove', this._hideLabel, this)
//       }
//       return this
//     },
//     updateLabelContent: function (content) {
//       if (this.label) {
//         this.label.setContent(content)
//       }
//     },
//     _showLabel: function (e) {
//       this.label.setLatLng(e.latlng)
//       this._map.showLabel(this.label)
//     },
//     _moveLabel: function (e) {
//       this.label.setLatLng(e.latlng)
//     },
//     _hideLabel: function () {
//       this.label.close()
//     }
//   })
//   L.Map.include({
//     showLabel: function (label) {
//       return this.addLayer(label)
//     }
//   })
//   L.FeatureGroup.include({
//     // TODO: remove this when AOP is supported in Leaflet, need this as we cannot put code in removeLayer()
//     clearLayers: function () {
//       this.unbindLabel()
//       this.eachLayer(this.removeLayer, this)
//       return this
//     },
//     bindLabel: function (content, options) {
//       return this.invoke('bindLabel', content, options)
//     },
//     unbindLabel: function () {
//       return this.invoke('unbindLabel')
//     },
//     updateLabelContent: function (content) {
//       this.invoke('updateLabelContent', content)
//     }
//   })
//   }(this, document))

class ExtLayer extends LayerGroup {
    options_;
    layer_;
    visible_;
    get visible() {
        return this.visible_;
    }
    set visible(v) {
        if (this.visible_ !== v) {
            this.visible_ = v;
            (v && this.layer_)
                ? this.addLayer(this.layer_)
                : this.removeLayer(this.layer_);
            this.fire('changed:visible');
        }
    }
    constructor(layer, options) {
        super();
        layer && (this.layer_ = layer);
        this.options_ = $extend(true, this.options_, {
            visible: true,
        }, options ?? {});
        this._init();
    }
    _init() {
        this.visible_ = this.options_.visible;
        if (this.visible_ && this.layer_) {
            this.addLayer(this.layer_);
        }
        return this;
    }
    setLayer(layer) {
        (this.visible_ && this.layer_) && this.removeLayer(this.layer_);
        this.layer_ = layer;
        this.visible_ && this.addLayer(layer);
        return this;
    }
}

/**
 * 底图插件
 */
class Basemap extends FssgLeafletPlugin {
    _basemapLayer;
    _selectedKey;
    _visible;
    _itemPools;
    get visible() {
        return this._visible;
    }
    set visible(v) {
        this._basemapLayer.visible = v;
        this._visible = v;
        this.fire('changed:visible', { visible: v });
    }
    /**
     * 构造底图插件
     * @param options 配置项
     */
    constructor(options) {
        super(options, {
            items: [],
            selectedKey: options?.items?.[0].key,
            visible: true,
        });
    }
    /**
     * 初始化
     * @returns this
     */
    _init() {
        this._selectedKey = this.options_.selectedKey;
        this._visible = this.options_.visible;
        this._basemapLayer = new ExtLayer(undefined, { visible: this._visible })
            .addTo(this.map_)
            .setZIndex(0);
        this._itemPools = new Map();
        return this
            ._initBasemapItems();
    }
    _initBasemapItems() {
        this.options_.items?.forEach(item => {
            let layer = undefined;
            if (item.type === 'tile' && item.url) {
                layer = tileLayer(item.url);
            }
            if (layer) {
                this._itemPools.set(item.key, { options: item, layers: [layer] });
            }
        });
        const selectedItem = this._itemPools.get(this._selectedKey);
        if (selectedItem) {
            this._basemapLayer.setLayer(selectedItem.layers[0]);
        }
        return this;
    }
    /**
     * 安装插件
     * @param fssgLeaflet 地图应用
     * @returns this
     */
    installPlugin(fssgLeaflet) {
        return super.installPlugin(fssgLeaflet)
            ._init();
    }
}

export { Basemap, FssgLeaflet, FssgLeafletPlugin, MapElement };
