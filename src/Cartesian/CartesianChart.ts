/// <reference path="../Chart.ts" />

module Fayde.DataVis {
    export interface ICartesianChartInfo extends IChartInfo {
        XAxis: Axis;
        YAxis: Axis;
    }

    export class CartesianChart extends Chart {
        static XAxisProperty = DependencyProperty.Register("XAxis", () => Axis, CartesianChart, undefined, (d: CartesianChart, args) => d._OnXAxisChanged(args));
        static YAxisProperty = DependencyProperty.Register("YAxis", () => Axis, CartesianChart, undefined, (d: CartesianChart, args) => d._OnYAxisChanged(args));
        static OrientationProperty = DependencyProperty.RegisterAttached("Orientation", () => new Enum(CartesianOrientation), CartesianChart, CartesianOrientation.Normal);
        XAxis: Axis;
        YAxis: Axis;

        static GetOrientation (dobj: DependencyObject): CartesianOrientation {
            return dobj.GetValue(CartesianChart.OrientationProperty);
        }

        static SetOrientation (dobj: DependencyObject, value: CartesianOrientation) {
            dobj.SetValue(CartesianChart.OrientationProperty, value);
        }

        private _OnXAxisChanged (args: IDependencyPropertyChangedEventArgs) {
            var axis = args.NewValue;
            this.ChartInfo.XAxis = axis;
            if (axis)
                axis.IsVertical = false;
        }

        private _OnYAxisChanged (args: IDependencyPropertyChangedEventArgs) {
            var axis = args.NewValue;
            this.ChartInfo.YAxis = axis;
            if (axis)
                axis.IsVertical = true;
        }

        ChartInfo: ICartesianChartInfo;

        constructor () {
            super();
            this.DefaultStyleKey = CartesianChart;
        }
    }
    Controls.TemplateParts(CartesianChart,
        {Name: "Presenter", Type: CartesianChartPresenter});
}