let _gotoPromise : Promise<unknown> | undefined
let _handleId : NodeJS.Timeout

export function goto (
  view: __esri.MapView,
  target: __esri.Geometry | __esri.Graphic | __esri.Geometry[] | __esri.Graphic[] | number[] | __esri.Collection<__esri.Geometry> | __esri.Collection<__esri.Graphic> | { center?: __esri.Point, zoom?: number },
  options?: __esri.GoToOptions2D
) : void {
  clearTimeout(_handleId)
  const gotoFunc : () => Promise<unknown> = view.goTo.bind(view, target, options)
  if (_gotoPromise) {
    _gotoPromise = _gotoPromise.then(() => gotoFunc())
  } else {
    _gotoPromise = gotoFunc()
  }
  _handleId = setTimeout(() => _gotoPromise = undefined, 2500)
}
