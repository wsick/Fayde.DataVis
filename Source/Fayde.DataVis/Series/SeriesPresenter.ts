module Fayde.DataVis {
    import Canvas = Controls.Canvas;
    export class SeriesPresenter extends Canvas {
        constructor() {
            super();
        }

        OnAxisCoerced(min: Point, max: Point) {

        }

        OnItemAdded(item: any, index: number) { }
        OnItemRemoved(item: any, index: number) { }
    }
} 