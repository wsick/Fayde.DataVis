module Fayde.DataVis {
    import Canvas = Controls.Canvas;
    export class AxisPresenter extends Canvas implements IPresenter {
        UpdateSize(newSize: size) {
            this.Width = newSize.Width;
            this.Height = newSize.Height;
        }
    }
} 