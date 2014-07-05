/// <reference path="BiSeriesPresenter.ts" />

module Fayde.DataVis {
    import Canvas = Controls.Canvas;

    export class LineSeriesPresenter extends BiSeriesPresenter {
        private _Line = new Shapes.Polyline();

        Series: LineSeries;
        ChartInfo: ICartesianChartInfo;

        constructor(series: LineSeries) {
            super(series);
            this._Line.Stroke = Media.SolidColorBrush.FromColor(Color.KnownColors.Black);
            this._Line.StrokeThickness = 5;
            this.Children.Add(this._Line);
        }

        OnSizeChanged(newSize: size) {
            var ci = this.ChartInfo;
            if (ci) {
                ci.XAxis.Presenter.UpdateScale();
                ci.YAxis.Presenter.UpdateScale();
            }
            this.Update();
        }

        OnItemsAdded(items: any, index: number) {
            super.OnItemsAdded(items, index);
            this.Update();
        }
        OnItemsRemoved(items: any, index: number) {
            super.OnItemsRemoved(items, index);
            this.Update();
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