module Fayde.DataVis {
    import Canvas = Controls.Canvas;
    export class AxisPresenter extends Canvas implements IPresenter {
        UpdateSize (newSize: minerva.Size) {
            this.Width = newSize.width;
            this.Height = newSize.height;
            this.UpdateScale(newSize.width, newSize.height);
        }

        private _Scale: IScale = null;
        get Scale (): IScale {
            return this._Scale;
        }

        OnScaleUpdated (scale: IScale) {
            this._Scale = scale;
            this.UpdateScale(this.Width, this.Height);
        }

        UpdateScale (width: number, height: number) {
        }
    }
}