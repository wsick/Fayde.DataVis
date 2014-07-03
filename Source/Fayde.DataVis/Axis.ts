module Fayde.DataVis {
    export class Axis extends DependencyObject {
        static ScaleProperty = DependencyProperty.Register("Scale", () => IScale_, Axis);
        Scale: IScale;

        GetPresenter(): AxisPresenter { throw new Error("Abstract"); }

        Map(item: any, chartInfo: IChartInfo, domain: IRange<any>): any {
            var scale = this.Scale || new LinearScale();
            return scale.Map(item, domain);
        }
        GetCoordinate(obj: any): number {
            return Number(obj);
        }
        Invert(value: any): any {
            return value;
        }
    }
}