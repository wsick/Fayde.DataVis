module Fayde.DataVis {
    import Canvas = Fayde.Controls.Canvas;

    export class OrientedAxisGridLines extends DisplayAxisGridLines {
        private _GridLinePool: Internal.ObjectPool<Shapes.Line>;

        constructor(axis: DisplayAxis) {
            super(axis);
            this._GridLinePool = new Internal.ObjectPool<Shapes.Line>(() => this._CreateObject());
        }

        Invalidate() {
            this._GridLinePool.Reset();
            try {
                var positions = this.Axis.GetMajorGridLinePositions();
                this.Children.Clear();
                var h = Math.max(Math.round(this.ActualHeight - 1.0), 0.0);
                var w = Math.max(Math.round(this.ActualWidth - 1.0), 0.0);
                for (var enumerator = positions.GetEnumerator(); enumerator.MoveNext();) {
                    var d = enumerator.Current.Value;
                    if (!isNaN(d)) {
                        var line = this._GridLinePool.Next();
                        if (this.Axis.Orientation == AxisOrientation.Y) {
                            line.Y1 = line.Y2 = h - Math.round(d - line.StrokeThickness / 2.0);
                            line.X1 = 0.0;
                            line.X2 = w;
                        } else if (this.Axis.Orientation === AxisOrientation.X) {
                            line.X1 = line.X2 = Math.round(d - line.StrokeThickness / 2.0);
                            line.Y1 = 0.0;
                            line.Y2 = h;
                        }
                        if (line.StrokeThickness % 2.0 > 0.0) {
                            line.SetValue(Canvas.LeftProperty, 0.5);
                            line.SetValue(Canvas.TopProperty, 0.5);
                        }
                        this.Children.Add(line);
                    }
                }
            } finally {
                this._GridLinePool.Done();
            }
        }

        private _CreateObject(): any {
            var line = new Shapes.Line();
            line.Style = this.Axis.GridLineStyle;
            return line;
        }
    }
}