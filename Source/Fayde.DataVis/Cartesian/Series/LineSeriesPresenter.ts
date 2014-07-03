module Fayde.DataVis {
    import Canvas = Controls.Canvas;

    export class LineSeriesPresenter extends CartesianSeriesPresenter {
        private _Line = new Shapes.Polyline();
        private _Series: LineSeries;

        constructor(series: LineSeries) {
            super();
            this._Series = series;
            this.Children.Add(this._Line);
        }

        private get ChartInfo(): ICartesianChartInfo {
            return this._Series ? this._Series.ChartInfo : null;
        }

        OnItemAdded(item: any, index: number) {
            super.OnItemAdded(item, index);
            this._Line.Points.Insert(index, this._CalculatePoint(item, index));
        }
        OnItemRemoved(item: any, index: number) {
            super.OnItemRemoved(item, index);
            this._Line.Points.RemoveAt(index);
        }

        Update() {
            this._Line.Points.Clear();
            this._Line.Points.AddRange(this.Items.map((item, i) => this._CalculatePoint(item, i)));
        }

        private _CalculatePoint(item: any, index: number): Point {
            var dvs = this.DepValueSet;
            var ivs = this.IndValueSet;

            var ci = this.ChartInfo;
            var isTransposed = ci.Orientation === CartesianOrientation.Transposed;
            var xaxis = isTransposed ? ci.IndependentAxis : ci.DependentAxis;
            var yaxis = !isTransposed ? ci.IndependentAxis : ci.DependentAxis;

            var x = xaxis.Map(dvs.Values[index], ci, dvs);
            if (typeof x !== "number")
                x = xaxis.GetCoordinate(x);
            var y = yaxis.Map(ivs.Values[index], ci, ivs);
            if (typeof y !== "number")
                y = yaxis.GetCoordinate(y);
            y = yaxis.Invert(y);

            return new Point(x, y);
        }
    }
}