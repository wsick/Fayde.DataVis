/// <reference path="../Chart.ts" />

module Fayde.DataVis {
    export interface ICartesianChartInfo extends IChartInfo {
        Orientation: CartesianOrientation;
        XAxis: Axis;
        YAxis: Axis;
    }

    export class CartesianChart extends Chart {
        static OrientationProperty = DependencyProperty.Register("Orientation", () => Axis, CartesianChart, undefined, (d, args) => (<CartesianChart>d)._OnOrientationChanged(args));
        static XAxisProperty = DependencyProperty.Register("XAxis", () => Axis, CartesianChart, undefined, (d, args) => (<CartesianChart>d)._OnXAxisChanged(args));
        static YAxisProperty = DependencyProperty.Register("YAxis", () => Axis, CartesianChart, undefined, (d, args) => (<CartesianChart>d)._OnYAxisChanged(args));
        Orientation: CartesianOrientation;
        XAxis: Axis;
        YAxis: Axis;

        private _OnOrientationChanged(args: IDependencyPropertyChangedEventArgs) {
            this.ChartInfo.Orientation = args.NewValue;
        }
        private _OnXAxisChanged(args: IDependencyPropertyChangedEventArgs) {
            var axis = args.NewValue;
            this.ChartInfo.XAxis = axis;
            if (axis)
                axis.IsVertical = false;
        }
        private _OnYAxisChanged(args: IDependencyPropertyChangedEventArgs) {
            var axis = args.NewValue;
            this.ChartInfo.YAxis = axis;
            if (axis)
                axis.IsVertical = true;
        }

        ChartInfo: ICartesianChartInfo;

        constructor() {
            super();
            this.DefaultStyleKey = CartesianChart;
        }
    }
    Controls.TemplateParts(CartesianChart,
        { Name: "Presenter", Type: CartesianChartPresenter });
}