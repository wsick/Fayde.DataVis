module Fayde.DataVis {
    export interface ICartesianChartInfo extends IChartInfo {
        Orientation: CartesianOrientation;
        IndependentAxis: Axis;
        DependentAxis: Axis;
    }

    export class CartesianChart extends Chart {
        static OrientationProperty = DependencyProperty.Register("Orientation", () => new Enum(CartesianOrientation), CartesianChart, CartesianOrientation.Normal, (d, args) => (<CartesianChart>d)._OnOrientationChanged(args));
        static DependentAxisProperty = DependencyProperty.Register("DependentAxis", () => Axis, CartesianChart, undefined, (d, args) => (<CartesianChart>d)._OnDependentAxisChanged(args));
        static IndependentAxisProperty = DependencyProperty.Register("IndependentAxis", () => Axis, CartesianChart, undefined, (d, args) => (<CartesianChart>d)._OnIndependentAxisChanged(args));
        Orientation: CartesianOrientation;
        DependentAxis: Axis;
        IndependentAxis: Axis;

        private _OnOrientationChanged(args: IDependencyPropertyChangedEventArgs) {
            this.ChartInfo.Orientation = args.NewValue;
        }
        private _OnDependentAxisChanged(args: IDependencyPropertyChangedEventArgs) {
            this.ChartInfo.DependentAxis = args.NewValue;
        }
        private _OnIndependentAxisChanged(args: IDependencyPropertyChangedEventArgs) {
            this.ChartInfo.IndependentAxis = args.NewValue;
        }

        ChartInfo: ICartesianChartInfo;

        constructor() {
            super();
            this.DefaultStyleKey = (<any>this).constructor;
        }
    }
    Controls.TemplateParts(CartesianChart,
        { Name: "Presenter", Type: CartesianChartPresenter });
} 