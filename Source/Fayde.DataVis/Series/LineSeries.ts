module Fayde.DataVis {
    export class LineSeries extends Series {
        Presenter: LineSeriesPresenter;
        CreatePresenter(): SeriesPresenter {
            return new LineSeriesPresenter(this);
        }
    }
} 