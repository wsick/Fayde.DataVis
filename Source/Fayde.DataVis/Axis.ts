module Fayde.DataVis {
    export class Axis extends DependencyObject {
        GetPresenter(): AxisPresenter { throw new Error("Abstract"); }

        Map(item: any, chartInfo: IChartInfo): any { return item; }
        Invert(value: any): any { return value; }
    }
}