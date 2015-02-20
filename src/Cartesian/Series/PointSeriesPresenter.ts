/// <reference path="BiSeriesPresenter" />

module Fayde.DataVis {
    import Canvas = Fayde.Controls.Canvas;
    import Ellipse = Fayde.Shapes.Ellipse;

    export class PointSeriesPresenter extends BiSeriesPresenter {
        static PointStyleProperty = DependencyProperty.Register("PointStyle", () => Style, PointSeriesPresenter, undefined, (d: PointSeriesPresenter, args) => d._OnPointStyleChanged(args));
        PointStyle: Style;

        private _OnPointStyleChanged (args: IDependencyPropertyChangedEventArgs) {
            var ps = this.PointStyle;
            for (var en = this.Children.getEnumerator(); en.moveNext();) {
                var ellipse = <Ellipse>en.current;
                ellipse.Style = ps;
            }
            this.Update();
        }

        Series: PointSeries;
        ChartInfo: ICartesianChartInfo;

        constructor (series: PointSeries) {
            super(series);
            this.DefaultStyleKey = PointSeriesPresenter;
        }

        OnSizeChanged (newSize: minerva.Size) {
            this.Update();
        }

        OnItemsAdded (items: any[], index: number) {
            super.OnItemsAdded(items, index);
            var ps = this.PointStyle;
            for (var i = 0, children = this.Children; i < items.length; i++) {
                var ellipse = new Ellipse();
                ellipse.Style = ps;
                children.Insert(i + index, ellipse);
            }
            this.Update();
        }

        OnItemsRemoved (items: any[], index: number) {
            super.OnItemsRemoved(items, index);
            for (var i = 0, children = this.Children; i < items.length; i++) {
                children.RemoveAt(i);
            }
            this.Update();
        }

        GetCoordinate (index: number): Point {
            var ci = this.ChartInfo;
            var fullHeight = this.Height;
            if (CartesianChart.GetOrientation(this.Series) === CartesianOrientation.Transposed) {
                return new Point(
                    this.InterpolateDependent(ci.XAxis, index),
                    fullHeight - this.InterpolateIndependent(ci.YAxis, index));
            } else {
                return new Point(
                    this.InterpolateIndependent(ci.XAxis, index),
                    fullHeight - this.InterpolateDependent(ci.YAxis, index));
            }
        }

        Update () {
            for (var i = 0, en = this.Children.getEnumerator(); en.moveNext(); i++) {
                var ellipse = <Ellipse>en.current;
                var width = ellipse.Width;
                var height = ellipse.Height;
                if (isNaN(width) || isNaN(height))
                    continue;
                var coord = this.GetCoordinate(i);
                var left = coord.x - (width / 2);
                var top = coord.y - (height / 2);
                this.UpdatePoint(ellipse, left, top, width, height);
            }
        }

        UpdatePoint (point: Ellipse, left: number, top: number, width: number, height: number) {
            Canvas.SetLeft(point, left);
            Canvas.SetTop(point, top);
            point.Width = width;
            point.Height = height;
        }
    }
}