module Fayde.DataVis {
    import Canvas = Controls.Canvas;

    export class LineSeriesPresenter extends BiSeriesPresenter {
        private _Line = new Shapes.Polyline();

        Series: LineSeries;
        ChartInfo: ICartesianChartInfo;

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

        GetCoordinate(index: number): Point {
            var ci = this.ChartInfo;
            var x = ci.XAxis.Interpolate(this.GetIndependentValue(index));
            var y = ci.YAxis.Interpolate(this.GetDependentValue(index));
            return new Point(x, y);
        }

        Update() {
            this._Line.Points.Clear();
            this._Line.Points.AddRange(this.Items.map((item, index) => this.GetCoordinate(index)));
        }
    }
}