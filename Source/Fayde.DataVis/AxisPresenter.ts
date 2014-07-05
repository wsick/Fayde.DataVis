module Fayde.DataVis {
    import Canvas = Controls.Canvas;
    export class AxisPresenter extends Canvas implements IPresenter {
        constructor() {
            super();
            this.SizeChanged.Subscribe(this._OnSizeChanged, this);
        }
        private _OnSizeChanged(sender: any, e: SizeChangedEventArgs) {
            this.OnSizeChanged(e.NewSize);
        }
        OnSizeChanged(newSize: size) { }

        UpdateSize(newSize: size) {
            this.Width = newSize.Width;
            this.Height = newSize.Height;
        }

        private _Scale: IScale = null;
        get Scale(): IScale { return this._Scale; }
        OnScaleUpdated(scale: IScale) {
            this._Scale = scale;
        }
    }
}