module Fayde.DataVis {
    export class Axis extends DependencyObject {
        GetPresenter(): AxisPresenter { throw new Error("Abstract"); }

        Map(item: any, chartInfo: IChartInfo, range: IRange<any>): any {
            return item;
        }
        GetCoordinate(obj: any): number {
        }
        Invert(value: any): any {
            return value;
        }
    }
}