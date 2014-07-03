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
            super.OnItemAdded(item, index);
            var p = this._CalculatePoint(item);
            this._Line.Points.Insert(index, p);
        }
        OnItemRemoved(item: any, index: number) {
            super.OnItemRemoved(item, index);
            this._Line.Points.RemoveAt(index);
        }

        private _DepWalker: Data.PropertyPathWalker = null;
        OnDependentValueChanged(path: string) {
            this._DepWalker = new Data.PropertyPathWalker(path, true, false, false);
            this._ForceRefresh();
        }
        private _IndWalker: Data.PropertyPathWalker = null;
        OnIndependentValueChanged(path: string) {
            this._IndWalker = new Data.PropertyPathWalker(path, true, false, false);
            this._ForceRefresh();
        }

        private _ForceRefresh() {
            this._Line.Points.Clear();
            for (var i = 0, items = this.Items, len = items.length; i < len; i++) {
                var p = this._CalculatePoint(item);
                this._Line.Points.Add(p);
            }
        }

        private _CalculatePoint(item: any): Point {
            var dep = this._DepWalker.GetValue(item);
            var ind = this._IndWalker.GetValue(item);

            var ci = this.ChartInfo;
            var isTransposed = ci.Orientation === CartesianOrientation.Transposed;
            var xaxis = isTransposed ? ci.IndependentAxis : ci.DependentAxis;
            var yaxis = !isTransposed ? ci.IndependentAxis : ci.DependentAxis;

            var x = xaxis.Map(dep, ci);
            var y = yaxis.Map(ind, ci);
            y = yaxis.Invert(y);

            return new Point(x, y);
        }
    }
}