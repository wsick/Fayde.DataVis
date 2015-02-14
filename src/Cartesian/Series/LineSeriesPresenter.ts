/// <reference path="BiSeriesPresenter.ts" />

module Fayde.DataVis {
    import Canvas = Controls.Canvas;
    import Polyline = Fayde.Shapes.Polyline;

    export class LineSeriesPresenter extends BiSeriesPresenter {
        static LineStyleProperty = DependencyProperty.Register("LineStyle", () => Style, LineSeriesPresenter, undefined, (d: LineSeriesPresenter, args) => d._OnLineStyleChanged(args));
        LineStyle: Style;

        private _OnLineStyleChanged (args: IDependencyPropertyChangedEventArgs) {
            this._Line.Style = args.NewValue;
        }

        private _Line = new Polyline();

        Series: LineSeries;
        ChartInfo: ICartesianChartInfo;

        constructor (series: LineSeries) {
            super(series);
            this.DefaultStyleKey = LineSeriesPresenter;
            this.Children.Add(this._Line);
        }

        OnSizeChanged (newSize: minerva.Size) {
            this.Update();
        }

        OnItemsAdded (items: any, index: number) {
            super.OnItemsAdded(items, index);
            this.Update();
        }

        OnItemsRemoved (items: any, index: number) {
            super.OnItemsRemoved(items, index);
            this.Update();
        }

        GetCoordinate (index: number): Point {
            var ci = this.ChartInfo;
            if (CartesianChart.GetOrientation(this.Series) === CartesianOrientation.Transposed) {
                return new Point(
                    this.InterpolateDependent(ci.XAxis, index),
                    this.InterpolateIndependent(ci.YAxis, index));
            } else {
                return new Point(
                    this.InterpolateIndependent(ci.XAxis, index),
                    this.InterpolateDependent(ci.YAxis, index));
            }
        }

        Update () {
            this._Line.Points.Clear();
            this._Line.Points.AddRange(this.Items.map((item, index) => this.GetCoordinate(index)));
        }
    }
}