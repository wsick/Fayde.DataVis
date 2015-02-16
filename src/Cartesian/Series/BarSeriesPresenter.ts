/// <reference path="BiSeriesPresenter" />
/// <reference path="../../Shapes/BarGroup" />

module Fayde.DataVis {
    import Canvas = Fayde.Controls.Canvas;
    import Rectangle = Fayde.Shapes.Rectangle;
    import BarGroup = Fayde.DataVis.Shapes.BarGroup;

    export class BarSeriesPresenter extends BiSeriesPresenter {
        static BarStyleProperty = DependencyProperty.Register("BarStyle", () => Style, BarSeriesPresenter, undefined, (d: BarSeriesPresenter, args) => d._OnBarStyleChanged(args));
        static BarSpacing = DependencyProperty.Register("BarSpacing", () => Spacing, BarSeriesPresenter, undefined, (d: BarSeriesPresenter, args) => d._OnBarSpacingChanged(args));
        BarStyle: Style;
        BarSpacing: Spacing;

        private _OnBarStyleChanged (args: IDependencyPropertyChangedEventArgs) {
            this._Group.BarStyle = args.NewValue;
        }

        private _OnBarSpacingChanged (args: IDependencyPropertyChangedEventArgs) {
            this._Group.BarSpacing = args.NewValue;
        }

        private _Group: BarGroup;

        Series: BarSeries;
        ChartInfo: ICartesianChartInfo;

        constructor (series: BarSeries) {
            super(series);
            this.DefaultStyleKey = BarSeriesPresenter;
            var grp = this._Group = new BarGroup();
            grp.Init((axis, index) => this.InterpolateIndependent(axis, index),
                (axis, index) => this.InterpolateDependent(axis, index));
            var ci = series.ChartInfo;
            if (ci) {
                grp.XAxis = ci.XAxis;
                grp.YAxis = ci.YAxis;
            }
            this.Children.Add(grp);
        }

        OnSizeChanged (newSize: minerva.Size) {
            this._Group.UpdateSize(newSize);
        }

        OnItemsAdded (items: any[], index: number) {
            super.OnItemsAdded(items, index);
            this._Group.InsertMany(index, items.length);
        }

        OnItemsRemoved (items: any[], index: number) {
            super.OnItemsRemoved(items, index);
            this._Group.RemoveManyAt(index, items.length);
        }

        OnTransposed () {
            super.OnTransposed();
            this._Group.IsVertical = CartesianChart.GetOrientation(this.Series) === CartesianOrientation.Transposed;
        }

        OnAttached () {
            super.OnAttached();
            var grp = this._Group;
            var ci = this.ChartInfo;
            grp.XAxis = ci.XAxis;
            grp.YAxis = ci.YAxis;
        }

        OnXAxisChanged (axis: Axis) {
            super.OnXAxisChanged(axis);
            this._Group.XAxis = axis;
        }

        OnYAxisChanged (axis: Axis) {
            super.OnYAxisChanged(axis);
            this._Group.YAxis = axis;
        }
    }
}