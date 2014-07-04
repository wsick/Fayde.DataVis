module Fayde.DataVis {
    export class Axis extends DependencyObject {
        static ScaleProperty = DependencyProperty.Register("Scale", () => IScale_, Axis, undefined, (d, args) => (<Axis>d)._OnScaleChanged(args));
        Scale: IScale;
        private _OnScaleChanged(args: IDependencyPropertyChangedEventArgs) {
            this.OnScaleUpdated();
        }

        private _Presenter: AxisPresenter;
        get Presenter(): AxisPresenter { return this._Presenter = this._Presenter || this.CreatePresenter(); }
        CreatePresenter(): AxisPresenter { throw new Error("Abstract"); }

        Interpolate(item: any): any {
            var scale = this.Scale || new LinearScale();
            return scale.Evaluate(scale.Parameterize(item));
        }

        ScaleUpdated = new MulticastEvent<EventArgs>();
        OnScaleUpdated() {
            this.ScaleUpdated.Raise(this, EventArgs.Empty);
        }
    }
}