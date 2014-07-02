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
            var p = new Point();
            //Calc x,y based on axis scaling functions
            //Swap x,y if dependent axis is vertical
            //Invert y
            this._Line.Points.Insert(index, p);
        }
        OnItemRemoved(item: any, index: number) {
            this._Line.Points.RemoveAt(index);
        }
    }
} 