module Fayde.DataVis.Shapes {
    import Canvas = Fayde.Controls.Canvas;
    import Rectangle = Fayde.Shapes.Rectangle;

    export class BarGroup extends Canvas {
        private _getInd: (axis: Axis, index: number) => number = null;
        private _getDep: (axis: Axis, index: number) => number = null;
        private _FreezeSize = false;
        private _BarStyle: Style = null;
        private _BarSpacing: Spacing = null;
        private _IsVertical: boolean = false;
        private _XAxis: Axis = null;
        private _YAxis: Axis = null;

        get BarStyle (): Style {
            return this._BarStyle;
        }

        set BarStyle (value: Style) {
            this._BarStyle = value;
            for (var en = this.Children.getEnumerator(); en.moveNext();) {
                (<Rectangle>en.current).Style = value;
            }
        }

        get BarSpacing (): Spacing {
            return this._BarSpacing;
        }

        set BarSpacing (value: Spacing) {
            this._BarSpacing = value;
            this.Update();
        }

        get IsVertical (): boolean {
            return this._IsVertical;
        }

        set IsVertical (value: boolean) {
            this._IsVertical = value;
            this.Update();
        }

        get XAxis (): Axis {
            return this._XAxis;
        }

        set XAxis (value: Axis) {
            this._XAxis = value;
            this.Update();
        }

        get YAxis (): Axis {
            return this._YAxis;
        }

        set YAxis (value: Axis) {
            this._YAxis = value;
            this.Update();
        }

        constructor () {
            super();

            var wbinding = new Data.Binding("Width");
            var rs = wbinding.RelativeSource = new Data.RelativeSource();
            rs.Mode = Data.RelativeSourceMode.FindAncestor;
            rs.AncestorType = Canvas;
            this.SetBinding(FrameworkElement.WidthProperty, wbinding);

            var hbinding = new Data.Binding("Height");
            var rs = hbinding.RelativeSource = new Data.RelativeSource();
            rs.Mode = Data.RelativeSourceMode.FindAncestor;
            rs.AncestorType = Canvas;
            this.SetBinding(FrameworkElement.HeightProperty, hbinding);

            FrameworkElement.WidthProperty.Store.ListenToChanged(this, FrameworkElement.WidthProperty, this._OnWidthChanged, this);
            FrameworkElement.WidthProperty.Store.ListenToChanged(this, FrameworkElement.WidthProperty, this._OnHeightChanged, this);
        }

        Init (getInd: (axis: Axis, index: number) => number, getDep: (axis: Axis, index: number) => number) {
            this._getInd = getInd;
            this._getDep = getDep;
        }

        private _OnWidthChanged (sender, args: IDependencyPropertyChangedEventArgs) {
            if (!this._FreezeSize)
                this.Update();
        }

        private _OnHeightChanged (sender, args: IDependencyPropertyChangedEventArgs) {
            if (!this._FreezeSize)
                this.Update();
        }

        Insert (index: number): Rectangle {
            var newBar = new Rectangle();
            newBar.Style = this.BarStyle;
            this.Children.Insert(index, newBar);
            this.Update();
            return newBar;
        }

        RemoveAt (index: number) {
            this.Children.RemoveAt(index);
            this.Update();
        }

        UpdateSize (newSize: minerva.Size) {
            this._FreezeSize = true;
            try {
                this.Width = newSize.width;
                this.Height = newSize.height;
            } finally {
                this._FreezeSize = false;
            }
            this.Update();
        }

        Update () {
            (!this._IsVertical)
                ? this.UpdateHorizontal()
                : this.UpdateVertical();
        }

        private UpdateHorizontal () {
            var ind = <OrdinalAxis>this.XAxis;
            var dep = <LinearAxis>this.YAxis;
            var getBand = createGetBand(ind, this.BarSpacing, this.Children.Count, this.Width);
            var fullHeight = this.Height;

            for (var i = 0, en = this.Children.getEnumerator(); en.moveNext(); i++) {
                var bar = <Rectangle>en.current;
                var band = getBand(this._getInd(ind, i));
                var height = this._getDep(dep, i);
                this.UpdateBar(bar, band[0], fullHeight - height, band[1], height);
            }
        }

        private UpdateVertical () {
            var ind = <OrdinalAxis>this.YAxis;
            var dep = <LinearAxis>this.XAxis;
            var getBand = createGetBand(ind, this.BarSpacing, this.Children.Count, this.Height);

            for (var i = 0, en = this.Children.getEnumerator(); en.moveNext(); i++) {
                var bar = <Rectangle>en.current;
                var band = getBand(this._getInd(ind, i));
                var width = this._getDep(dep, i);
                this.UpdateBar(bar, 0, band[0], width, band[1]);
            }
        }

        UpdateBar (bar: Rectangle, left: number, top: number, width: number, height: number) {
            Canvas.SetLeft(bar, left);
            Canvas.SetTop(bar, top);
            bar.Width = width;
            bar.Height = height;
        }
    }

    function createGetBand (indAxis: OrdinalAxis, spacing: Spacing, count: number, full: number): (c: number) => number[] {
        var scale = indAxis.Scale;
        if (scale instanceof OrdinalAxis) {
            return (c: number): number[] => scale.GetBand(c, spacing, count);
        }
        var band = full / count;
        return (c: number): number[] => [c - (band / 2), band];
    }
}