module Fayde.DataVis {
    export class CartesianChartPresenter extends ChartPresenter {
        Owner: CartesianChart;

        private _IndAP: AxisPresenter = null;
        private _IndListener: Providers.IPropertyChangedListener = null;
        private _DepAP: AxisPresenter = null;
        private _DepListener: Providers.IPropertyChangedListener = null;

        Detach() {
            super.Detach();
            if (this._IndListener)
                this._IndListener.Detach();
            if (this._DepListener)
                this._DepListener.Detach();
            this._OnIndependentChanged(null);
            this._OnDependentChanged(null);
        }
        Attach(chart: CartesianChart) {
            super.Attach(chart);
            if (chart) {
                this._OnIndependentChanged(chart.IndependentAxis);
                this._OnDependentChanged(chart.DependentAxis);

                var propd = CartesianChart.IndependentAxisProperty;
                this._IndListener = propd.Store.ListenToChanged(chart, propd, (sender, args) => this._OnIndependentChanged(args.NewValue), this);

                var propd = CartesianChart.DependentAxisProperty;
                this._DepListener = propd.Store.ListenToChanged(chart, propd, (sender, args) => this._OnIndependentChanged(args.NewValue), this);
            }
        }
        private _OnIndependentChanged(axis: Axis) {
            if (this._IndAP) {
                this.Children.Remove(this._IndAP);
                this._IndAP = null;
            }
            if (axis) {
                this._IndAP = axis.Presenter;
                this.Children.Add(this._IndAP);
            }
        }
        private _OnDependentChanged(axis: Axis) {
            if (this._DepAP) {
                this.Children.Remove(this._DepAP);
                this._DepAP = null;
            }
            if (axis) {
                this._DepAP = axis.Presenter;
                this.Children.Add(this._DepAP);
            }
        }
        OnSizeChanged(sender: any, e: SizeChangedEventArgs) {
            super.OnSizeChanged(sender, e);
            if (this._IndAP)
                this._IndAP.UpdateSize(e.NewSize);
            if (this._DepAP)
                this._DepAP.UpdateSize(e.NewSize);
        }
    }
}