/// <reference path="BiSeries.ts" />

module Fayde.DataVis {
    export class BarSeries extends BiSeries {
        Presenter: BarSeriesPresenter;
        CreatePresenter (): SeriesPresenter {
            return new BarSeriesPresenter(this);
        }
        ChartInfo: ICartesianChartInfo;
    }
}