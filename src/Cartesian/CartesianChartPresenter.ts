/// <reference path="../ChartPresenter.ts" />

module Fayde.DataVis {
    export class CartesianChartPresenter extends ChartPresenter {
        Owner: CartesianChart;

        private _yap: AxisPresenter = null;
        private _YListener: Providers.IPropertyChangedListener = null;
        private _xap: AxisPresenter = null;
        private _XListener: Providers.IPropertyChangedListener = null;

        Detach() {
            super.Detach();
            if (this._XListener)
                this._XListener.Detach();
            this._OnXChanged(null);
            if (this._YListener)
                this._YListener.Detach();
            this._OnYChanged(null);
        }
        Attach(chart: CartesianChart) {
            super.Attach(chart);
            if (chart) {
                this._OnXChanged(chart.XAxis);
                var propd = CartesianChart.XAxisProperty;
                this._XListener = propd.Store.ListenToChanged(chart, propd, (sender, args) => this._OnXChanged(args.NewValue), this);

                this._OnYChanged(chart.YAxis);
                var propd = CartesianChart.YAxisProperty;
                this._YListener = propd.Store.ListenToChanged(chart, propd, (sender, args) => this._OnYChanged(args.NewValue), this);
            }
        }
        private _OnYChanged(axis: Axis) {
            if (this._yap) {
                this.Children.Remove(this._yap);
                this._yap = null;
            }
            if (axis) {
                this._yap = axis.Presenter;
                this.Children.Add(this._yap);
            }
        }
        private _OnXChanged(axis: Axis) {
            if (this._xap) {
                this.Children.Remove(this._xap);
                this._xap = null;
            }
            if (axis) {
                this._xap = axis.Presenter;
                this.Children.Add(this._xap);
            }
        }
        OnSizeChanged(sender: any, e: SizeChangedEventArgs) {
            super.OnSizeChanged(sender, e);
            if (this._xap)
                this._xap.UpdateSize(e.NewSize);
            if (this._yap)
                this._yap.UpdateSize(e.NewSize);
        }
    }
}