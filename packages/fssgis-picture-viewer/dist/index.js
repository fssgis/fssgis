import { Observable } from '@fssgis/observable';
import { Map, CRS, imageOverlay } from 'leaflet';

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

class PictureViewer extends Observable {
  constructor(divId, options) {
    super();

    _defineProperty(this, "_map", void 0);

    _defineProperty(this, "_options", void 0);

    this._map = new Map(divId, {
      crs: CRS.Simple,
      minZoom: -2
    }).setView([0, 0], 0);
    this._options = options;

    this._init();
  }

  _init() {
    const url = this._options.url;
    const img = new Image();
    img.src = url;

    img.onload = () => {
      console.log(img.width, img.height);
    };

    imageOverlay(url, [[0, 0], [img.width, img.height]]).addTo(this._map);

    this._map.setView([img.width / 2, img.height / 2], 0);

    return this;
  }

}

export { PictureViewer, PictureViewer as default };
