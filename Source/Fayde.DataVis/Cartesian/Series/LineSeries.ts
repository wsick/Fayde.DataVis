module Fayde.DataVis {
    export class LineSeries extends BiSeries {
        Presenter: LineSeriesPresenter;
        CreatePresenter(): SeriesPresenter {
            return new LineSeriesPresenter(this);
        }

        ChartInfo: ICartesianChartInfo;
    }
}