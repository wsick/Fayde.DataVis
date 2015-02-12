module Fayde.DataVis {
    export class Axis extends DependencyObject {
        static ScaleProperty = DependencyProperty.Register("Scale", () => IScale_, Axis, undefined, (d: Axis, args) => d._OnScaleChanged(args));
        static MinimumProperty = DependencyProperty.Register("Minimum", () => IValueOfable_, Axis, undefined, (d: Axis, args) => d.OnMinimumChanged(args.OldValue, args.NewValue));
        static MaximumProperty = DependencyProperty.Register("Maximum", () => IValueOfable_, Axis, undefined, (d: Axis, args) => d.OnMaximumChanged(args.OldValue, args.NewValue));
        Scale: IScale;
        Minimum: IValueOfable;
        Maximum: IValueOfable;

        private _OnScaleChanged (args: IDependencyPropertyChangedEventArgs) {
            this.OnScaleUpdated();
        }

        OnMinimumChanged (oldValue: IValueOfable, newValue: IValueOfable) {
            this.Parameterizer.Minimum = newValue;
        }

        OnMaximumChanged (oldValue: IValueOfable, newValue: IValueOfable) {
            this.Parameterizer.Maximum = newValue;
        }

        private _Presenter: AxisPresenter;
        get Presenter (): AxisPresenter {
            return this._Presenter = this._Presenter || this.CreatePresenter();
        }

        CreatePresenter (): AxisPresenter {
            throw new Error("Abstract");
        }

        private _Parameterizer: IParameterizer;
        get Parameterizer (): IParameterizer {
            return this._Parameterizer = this._Parameterizer || this.CreateParameterizer();
        }

        CreateParameterizer (): IParameterizer {
            throw new Error("Abstract");
        }

        Interpolate (t: number): any {
            var scale = this.Scale;
            if (!scale)
                return t;
            return scale.Evaluate(t);
        }

        ScaleUpdated = new nullstone.Event();

        OnScaleUpdated () {
            this.ScaleUpdated.raise(this, null);
            this.Presenter.OnScaleUpdated(this.Scale);
        }
    }
}