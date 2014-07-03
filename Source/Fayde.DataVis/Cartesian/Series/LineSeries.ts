module Fayde.DataVis {
    export class LineSeries extends CartesianSeries {
        Presenter: LineSeriesPresenter;
        CreatePresenter(): SeriesPresenter {
            return new LineSeriesPresenter(this);
        }

        ChartInfo: ICartesianChartInfo;
    }
} 