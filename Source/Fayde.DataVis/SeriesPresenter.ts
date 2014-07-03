module Fayde.DataVis {
    import Canvas = Controls.Canvas;
    export class SeriesPresenter extends Canvas implements IPresenter {
        UpdateSize(newSize: size) {
            this.Width = newSize.Width;
            this.Height = newSize.Height;
        }

        private _Items: any[] = [];
        get Items(): any[] { return this._Items; }

        OnItemAdded(item: any, index: number) {
            this._Items.splice(index, 0, item);
        }
        OnItemRemoved(item: any, index: number) {
            this._Items.splice(index, 1);
        }
    }
} 