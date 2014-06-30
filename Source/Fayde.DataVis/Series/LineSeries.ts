module Fayde.DataVis {
    export class LineSeries extends Series {
        private _Presenter: LineSeriesPresenter = null;
        GetPresenter(): SeriesPresenter {
            return this._Presenter = this._Presenter || new LineSeriesPresenter(this);
        }
    }
} 