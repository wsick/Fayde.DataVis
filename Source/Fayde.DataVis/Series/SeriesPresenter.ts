module Fayde.DataVis {
    import Canvas = Controls.Canvas;
    export class SeriesPresenter extends Canvas implements IPresenter {
        UpdateSize(newSize: size) {
            this.Width = newSize.Width;
            this.Height = newSize.Height;
        }

        OnItemAdded(item: any, index: number) { }
        OnItemRemoved(item: any, index: number) { }
    }
} 