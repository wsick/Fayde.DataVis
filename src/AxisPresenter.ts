module Fayde.DataVis {
    import Canvas = Controls.Canvas;
    export class AxisPresenter extends Canvas implements IPresenter {
        constructor() {
            super();
            this.SizeChanged.on(this._OnSizeChanged, this);
        }
        private _OnSizeChanged(sender: any, e: SizeChangedEventArgs) {
            this.OnSizeChanged(e.NewSize);
            this.UpdateScale();
        }
        OnSizeChanged(newSize: minerva.Size) { }

        UpdateSize(newSize: minerva.Size) {
            this.Width = newSize.width;
            this.Height = newSize.height;
        }

        private _Scale: IScale = null;
        get Scale(): IScale { return this._Scale; }
        OnScaleUpdated(scale: IScale) {
            this._Scale = scale;
            this.UpdateScale();
        }
        UpdateScale() {
        }
    }
}