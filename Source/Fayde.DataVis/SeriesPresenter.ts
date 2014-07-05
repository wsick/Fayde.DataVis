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

        OnItemsAdded(items: any, index: number) {
            this._Items = this._Items.slice(0, index - 1)
                .concat(items)
                .concat(this._Items.slice(index));
        }
        OnItemsRemoved(items: any, index: number) {
            this._Items.splice(index, items.length);
        }

        UpdateSize(newSize: size) {
            this.Width = newSize.Width;
            this.Height = newSize.Height;
        }
    }
}