module Fayde.DataVis {
    import Canvas = Controls.Canvas;

    export class LineSeriesPresenter extends SeriesPresenter {
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
            var p = this._CalculatePoint(item);
            this._Line.Points.Insert(index, p);
        }
        OnItemRemoved(item: any, index: number) {
            this._Line.Points.RemoveAt(index);
        }

        private _CalculatePoint(item: any): Point {
            var p = new Point();
            //Retrieve dependent, independent values from bindings
            //Apply axis scaling function to values to acquire x,y
            this._ApplyOrientation(p);
            this._AdjustYForScreen(p);
            return p;
        }
        private _ApplyOrientation(point: Point) {
            if (this.ChartInfo.Orientation === CartesianOrientation.Transposed) {
                var t = point.X;
                point.X = point.Y;
                point.Y = t;
            }
        }
        private _AdjustYForScreen(point: Point) {
            //var h = this.Height;
            //point.Y = h - point.Y;
        }
    }
}