module Fayde.DataVis {
    import Canvas = Controls.Canvas;
    export class SeriesPresenter extends Canvas implements IPresenter {
        private _Series: Series;
        get Series(): Series { return this._Series; }
        get ChartInfo(): IChartInfo { return this._Series ? this._Series.ChartInfo : null; }

        private _Items: any[] = [];
        get Items(): any[] { return this._Items; }

        constructor(series: Series) {
            super();
            this._Series = series;
        }

        OnItemAdded(item: any, index: number) {
            this._Items.splice(index, 0, item);
        }
        OnItemRemoved(item: any, index: number) {
            this._Items.splice(index, 1);
        }

        UpdateSize(newSize: size) {
            this.Width = newSize.Width;
            this.Height = newSize.Height;
        }
    }
} 