/// <reference path="BiSeriesPresenter.ts" />

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
            if (ci.Orientation === CartesianOrientation.Transposed) {
                return new Point(
                    this.InterpolateDependent(ci.XAxis, index),
                    this.InterpolateIndependent(ci.YAxis, index));
            } else {
                return new Point(
                    this.InterpolateIndependent(ci.XAxis, index),
                    this.InterpolateDependent(ci.YAxis, index));
            }
        }

        Update() {
            this._Line.Points.Clear();
            this._Line.Points.AddRange(this.Items.map((item, index) => this.GetCoordinate(index)));
        }
    }
}