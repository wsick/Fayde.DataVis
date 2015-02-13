/// <reference path="../Axis.ts" />

module Fayde.DataVis {
    export class LinearAxis extends Axis {
        get IsVertical(): boolean { return this.Presenter.IsVertical === true; }
        set IsVertical(value: boolean) { this.Presenter.IsVertical = value === true; }

        static MinimumProperty = DependencyProperty.Register("Minimum", () => IValueOfable_, Axis, undefined, (d: LinearAxis, args) => d.OnMinimumChanged(args.OldValue, args.NewValue));
        static MaximumProperty = DependencyProperty.Register("Maximum", () => IValueOfable_, Axis, undefined, (d: LinearAxis, args) => d.OnMaximumChanged(args.OldValue, args.NewValue));
        Minimum: IValueOfable;
        Maximum: IValueOfable;

        OnMinimumChanged (oldValue: IValueOfable, newValue: IValueOfable) {
            this.Parameterizer.Minimum = newValue;
        }

        OnMaximumChanged (oldValue: IValueOfable, newValue: IValueOfable) {
            this.Parameterizer.Maximum = newValue;
        }

        Presenter: LinearAxisPresenter;
        CreatePresenter(): LinearAxisPresenter { return new LinearAxisPresenter(); }
        Parameterizer: LinearParameterizer;
        CreateParameterizer(): LinearParameterizer { return new LinearParameterizer(); }

        constructor() {
            super();
            if (!this.Scale)
                this.Scale = new LinearScale();
        }
    }
}