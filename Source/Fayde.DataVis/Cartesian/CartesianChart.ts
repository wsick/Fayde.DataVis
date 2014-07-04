/// <reference path="../Chart.ts" />

module Fayde.DataVis {
    export interface ICartesianChartInfo extends IChartInfo {
        XAxis: Axis;
        YAxis: Axis;
    }

    export class CartesianChart extends Chart {
        static XAxisProperty = DependencyProperty.Register("XAxis", () => Axis, CartesianChart, undefined, (d, args) => (<CartesianChart>d)._OnXAxisChanged(args));
        static YAxisProperty = DependencyProperty.Register("YAxis", () => Axis, CartesianChart, undefined, (d, args) => (<CartesianChart>d)._OnYAxisChanged(args));
        XAxis: Axis;
        YAxis: Axis;

        private _OnXAxisChanged(args: IDependencyPropertyChangedEventArgs) {
            this.ChartInfo.XAxis = args.NewValue;
        }
        private _OnYAxisChanged(args: IDependencyPropertyChangedEventArgs) {
            this.ChartInfo.YAxis = args.NewValue;
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