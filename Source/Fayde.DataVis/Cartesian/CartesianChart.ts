/// <reference path="../Chart.ts" />

module Fayde.DataVis {
    export interface ICartesianChartInfo extends IChartInfo {
        XAxis: LinearAxis;
        YAxis: LinearAxis;
    }

    export class CartesianChart extends Chart {
        static XAxisProperty = DependencyProperty.Register("XAxis", () => LinearAxis, CartesianChart, undefined, (d, args) => (<CartesianChart>d)._OnXAxisChanged(args));
        static YAxisProperty = DependencyProperty.Register("YAxis", () => LinearAxis, CartesianChart, undefined, (d, args) => (<CartesianChart>d)._OnYAxisChanged(args));
        XAxis: LinearAxis;
        YAxis: LinearAxis;

        private _OnXAxisChanged(args: IDependencyPropertyChangedEventArgs) {
            var axis: LinearAxis = args.NewValue;
            this.ChartInfo.XAxis = axis;
            if (axis instanceof LinearAxis)
                axis.IsVertical = false;
        }
        private _OnYAxisChanged(args: IDependencyPropertyChangedEventArgs) {
            var axis: LinearAxis = args.NewValue;
            this.ChartInfo.YAxis = axis;
            if (axis instanceof LinearAxis)
                axis.IsVertical = true;
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