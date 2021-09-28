import { Observable } from '@fssgis/observable';

interface IPictureViewerOptions {
    url: string;
}
declare class PictureViewer extends Observable<{}> {
    private _map;
    private _options;
    constructor(divId: string, options: IPictureViewerOptions);
    private _init;
}

export { IPictureViewerOptions, PictureViewer, PictureViewer as default };
