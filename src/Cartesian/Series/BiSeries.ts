/// <reference path="../../Series.ts" />

module Fayde.DataVis {
    export class BiSeries extends Series {
        static DependentValuePathProperty = DependencyProperty.Register("DependentValuePath", () => String, BiSeries, undefined, (d: BiSeries, args) => d._OnDependentValuePathChanged(args));
        static IndependentValuePathProperty = DependencyProperty.Register("IndependentValuePath", () => String, BiSeries, undefined, (d: BiSeries, args) => d._OnIndependentValuePathChanged(args));
        DependentValuePath: string;
        IndependentValuePath: string;

        Presenter: BiSeriesPresenter;

        CreatePresenter (): SeriesPresenter {
            return new BiSeriesPresenter(this);
        }

        constructor () {
            super();
            CartesianChart.OrientationProperty.Store.ListenToChanged(this, CartesianChart.OrientationProperty, this._OnOrientationChanged, this);
        }

        private _OnOrientationChanged (sender, args: IDependencyPropertyChangedEventArgs) {
            this.Presenter.OnTransposed();
        }

        private _OnDependentValuePathChanged (args: IDependencyPropertyChangedEventArgs) {
            this.Presenter.OnDependentValuePathChanged(args.NewValue);
        }

        private _OnIndependentValuePathChanged (args: IDependencyPropertyChangedEventArgs) {
            this.Presenter.OnIndependentValuePathChanged(args.NewValue);
        }
    }
}