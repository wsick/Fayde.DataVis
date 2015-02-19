module Fayde.DataVis {
    export class PointSeries extends BiSeries {
        Presenter: PointSeriesPresenter;
        CreatePresenter(): SeriesPresenter {
            return new PointSeriesPresenter(this);
        }

        ChartInfo: ICartesianChartInfo;
    }
}