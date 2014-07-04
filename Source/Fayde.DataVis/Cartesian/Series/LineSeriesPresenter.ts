module Fayde.DataVis {
    import Canvas = Controls.Canvas;

    export class LineSeriesPresenter extends CartesianSeriesPresenter {
        private _Line = new Shapes.Polyline();

        Series: LineSeries;

        constructor(series: LineSeries) {
            super(series);
            this.Children.Add(this._Line);
        }

        OnItemAdded(item: any, index: number) {
            super.OnItemAdded(item, index);
            this._Line.Points.Insert(index, this.GetCoordinate(index));
        }
        OnItemRemoved(item: any, index: number) {
            super.OnItemRemoved(item, index);
            this._Line.Points.RemoveAt(index);
        }

        Update() {
            this._Line.Points.Clear();
            this._Line.Points.AddRange(this.Items.map((item, index) => this.GetCoordinate(index)));
        }
    }
}