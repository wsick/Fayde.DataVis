module Fayde.DataVis {
    export class CartesianSeries extends Series {
        static DependentValuePathProperty = DependencyProperty.Register("DependentValuePath", () => String, CartesianSeries, undefined, (d, args) => (<CartesianSeries>d)._OnDependentValuePathChanged(args));
        static IndependentValuePathProperty = DependencyProperty.Register("IndependentValuePath", () => String, CartesianSeries, undefined, (d, args) => (<CartesianSeries>d)._OnIndependentValuePathChanged(args));
        DependentValuePath: string;
        IndependentValuePath: string;

        Presenter: CartesianSeriesPresenter;
        CreatePresenter(): SeriesPresenter { return new CartesianSeriesPresenter(this); }

        private _OnDependentValuePathChanged(args: IDependencyPropertyChangedEventArgs) {
            this.Presenter.OnDependentValueChanged(args.OldValue);
        }
        private _OnIndependentValuePathChanged(args: IDependencyPropertyChangedEventArgs) {
            this.Presenter.OnIndependentValueChanged(args.NewValue);
        }
    }
}