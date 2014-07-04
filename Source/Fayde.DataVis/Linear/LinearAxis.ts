/// <reference path="../Axis.ts" />

module Fayde.DataVis {
    export class LinearAxis extends Axis {
        static MinimumProperty = DependencyProperty.Register("Minimum", () => Number, LinearAxis, undefined, (d, args) => (<LinearAxis>d).OnMinimumChanged(args.OldValue, args.NewValue));
        static MaximumProperty = DependencyProperty.Register("Maximum", () => Number, LinearAxis, undefined, (d, args) => (<LinearAxis>d).OnMaximumChanged(args.OldValue, args.NewValue));
        Minimum: number;
        Maximum: number;
        OnMinimumChanged(oldValue: number, newValue: number) {
            this.OnScaleUpdated();
        }
        OnMaximumChanged(oldValue: number, newValue: number) {
            this.OnScaleUpdated();
        }

        get IsVertical(): boolean { return this.Presenter.IsVertical === true; }
        set IsVertical(value: boolean) { this.Presenter.IsVertical = value === true; }

        Presenter: LinearAxisPresenter;
        CreatePresenter(): LinearAxisPresenter { return new LinearAxisPresenter(); }
        Parameterize: LinearParameterizer;
        CreateParameterizer(): LinearParameterizer { return new LinearParameterizer(); }

        constructor() {
            super();
        }

        OnScaleUpdated() {
            var ls = <LinearScale>this.Scale;
            if (ls instanceof LinearScale) {
                ls.RangeMin = this.Minimum;
                ls.RangeMax = this.Maximum;
            }
            super.OnScaleUpdated();
        }
    }
}