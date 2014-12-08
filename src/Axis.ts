module Fayde.DataVis {
    export class Axis extends DependencyObject {
        static ScaleProperty = DependencyProperty.Register("Scale", () => IScale_, Axis, undefined, (d: Axis, args) => d._OnScaleChanged(args));
        Scale: IScale;
        private _OnScaleChanged(args: IDependencyPropertyChangedEventArgs) {
            this.OnScaleUpdated();
        }

        private _Presenter: AxisPresenter;
        get Presenter(): AxisPresenter { return this._Presenter = this._Presenter || this.CreatePresenter(); }
        CreatePresenter(): AxisPresenter { throw new Error("Abstract"); }

        private _Parameterizer: IParameterizer;
        get Parameterizer(): IParameterizer { return this._Parameterizer = this._Parameterizer || this.CreateParameterizer(); }
        CreateParameterizer(): IParameterizer { throw new Error("Abstract"); }

        Interpolate(t: number): any {
            var scale = this.Scale;
            if (!scale)
                return t;
            return scale.Evaluate(t);
        }

        ScaleUpdated = new nullstone.Event();
        OnScaleUpdated() {
            this.ScaleUpdated.raise(this, null);
            this.Presenter.OnScaleUpdated(this.Scale);
        }
    }
}