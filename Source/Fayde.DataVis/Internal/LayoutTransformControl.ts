module Fayde.DataVis.Internal {
    import Panel = Fayde.Controls.Panel;
    import Matrix = Fayde.Media.Matrix;

    var template = '<ControlTemplate xmlns="http://schemas.wsick.com/fayde" xmlns:x="http://schemas.wsick.com/fayde/x"><Grid x:Name="LayoutRoot" Background="{TemplateBinding Background}"><Grid.RenderTransform><MatrixTransform x:Name="MatrixTransform"/></Grid.RenderTransform></Grid></ControlTemplate>';

    export class LayoutTransformControl extends Fayde.Controls.Control {
        static ChildProperty = DependencyProperty.Register("Child", () => FrameworkElement, LayoutTransformControl);
        static TransformProperty = DependencyProperty.Register("Transform", () => Media.Transform, LayoutTransformControl);
        Child: FrameworkElement;
        Transform: Media.Transform;

        private _OnChildChanged(args: IDependencyPropertyChangedEventArgs) {
            if (!this._LayoutRoot)
                return;
            this._LayoutRoot.Children.Clear();
            var newContent = args.NewValue
            if (newContent)
                this._LayoutRoot.Children.Add(newContent);
            this.InvalidateMeasure();
        }
        private _OnTransformChanged(args: IDependencyPropertyChangedEventArgs) {
            this._ProcessTransform(args.NewValue);
        }

        private _LayoutRoot: Panel = null;
        private _MatrixTransform: Media.MatrixTransform = null;
        private _ChildActualSize: size = new size();
        private _Transformation: Matrix = null;

        constructor() {
            super();
            this.DefaultStyleKey = (<any>this).constructor;
            this.IsTabStop = false;
            this.UseLayoutRounding = false;
            this.Template = <Controls.ControlTemplate>Xaml.Load(new Xaml.XamlDocument(template).Document);
        }

        OnApplyTemplate() {
            var child = this.Child;
            this.Child = null;
            super.OnApplyTemplate();
            this._LayoutRoot = <Panel>this.GetTemplateChild("LayoutRoot", Panel);
            this._MatrixTransform = <Media.MatrixTransform>this.GetTemplateChild("MatrixTransform", Media.MatrixTransform);
            this.Child = child;
            this._ProcessTransform(this.Transform);
        }

        MeasureOverride(availableSize: size): size {
            if (!this._LayoutRoot || !this.Child)
                return new size();
            var as = this._ChildActualSize;
            if (size.isEqual(this._ChildActualSize, new size()))
                as = this._ComputeLargestTransformedSize(availableSize);
            this._LayoutRoot.Measure(as);
            var tr = rectTransform(rect.fromSize(this._LayoutRoot.DesiredSize), this._Transformation);
            return size.fromRect(tr);
        }
        ArrangeOverride(finalSize: size): size {
            var child = this.Child;
            if (!this._LayoutRoot || !child)
                return finalSize;
            var a = this._ComputeLargestTransformedSize(finalSize);
            if (isSizeSmaller(a, this._LayoutRoot.DesiredSize))
                a = this._LayoutRoot.DesiredSize;
            var tr = rectTransform(rect.fromSize(a), this._Transformation);
            var fr = new rect();
            rect.set(fr, -tr.X + (finalSize.Width - tr.Width) / 2.0, -tr.Y + (finalSize.Height - tr.Height) / 2.0, a.Width, a.Height);
            this._LayoutRoot.Arrange(fr);
            if (isSizeSmaller(a, child.RenderSize) && size.isEqual(this._ChildActualSize, new size())) {
                this._ChildActualSize = size.fromRaw(child.ActualWidth, child.ActualHeight);
                this.InvalidateMeasure();
            } else {
                this._ChildActualSize = new size();
            }
            return finalSize;
        }

        private _ProcessTransform(transform: Media.Transform) {
            this._Transformation = roundMatrix(this._GetTransformMatrix(transform), 4);
            if (this._MatrixTransform)
                this._MatrixTransform.Matrix = this._Transformation;
            this.InvalidateMeasure();
        }
        private _GetTransformMatrix(transform: Media.Transform): Matrix {
            if (!transform)
                return Matrix.Identity;
            return new Matrix(transform.Value._Raw.slice(0));
        }
        private _ComputeLargestTransformedSize(arrangeBounds: size): size {
            var s = new size();
            var flag1 = !isFinite(arrangeBounds.Width);
            if (flag1)
                arrangeBounds.Width = arrangeBounds.Height;
            var flag2 = !isFinite(arrangeBounds.Height);
            if (flag2)
                arrangeBounds.Height = arrangeBounds.Width;
            var m11 = this._Transformation.M11;
            var m12 = this._Transformation.M12;
            var m21 = this._Transformation.M21;
            var m22 = this._Transformation.M22;
            var num1 = Math.abs(arrangeBounds.Width / m11);
            var num2 = Math.abs(arrangeBounds.Width / m21);
            var num3 = Math.abs(arrangeBounds.Height / m12);
            var num4 = Math.abs(arrangeBounds.Height / m22);
            var num5 = num1 / 2.0;
            var num6 = num2 / 2.0;
            var num7 = num3 / 2.0;
            var num8 = num4 / 2.0;
            var num9 = -(num2 / num1);
            var num10 = -(num4 / num3);
            if (0.0 === arrangeBounds.Width || 0.0 === arrangeBounds.Height)
                s = new size();
            else if (flag1 && flag2)
                s = size.fromRaw(Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY);
            else if (!doesMatrixHaveInverse(this._Transformation))
                s = new size();
            else if (0.0 === m12 || 0.0 === m21) {
                var num11 = flag2 ? Number.POSITIVE_INFINITY : num4;
                var num12 = flag1 ? Number.POSITIVE_INFINITY : num1;
                if (0.0 === m12 && 0.0 === m21)
                    s = size.fromRaw(num12, num11);
                else if (0.0 === m12) {
                    var height = Math.min(num6, num11);
                    s = size.fromRaw(num12 - Math.abs(m21 * height / m11), height);
                } else if (0.0 === m21) {
                    var width = Math.min(num7, num12);
                    s = size.fromRaw(width, num11 - Math.abs(m12 * width / m22));
                }
            } else if (0.0 === m11 || 0.0 === m22) {
                var num11 = flag2 ? Number.POSITIVE_INFINITY : num3;
                var num12 = flag1 ? Number.POSITIVE_INFINITY : num2;
                if (0.0 === m11 && 0.0 === m22)
                    s = size.fromRaw(num11, num12);
                else if (0.0 === m11) {
                    var height = Math.min(num8, num12);
                    s = size.fromRaw(num11 - Math.abs(m22 * height / m12), height);
                } else if (0.0 === m22) {
                    var width = Math.min(num5, num11);
                    s = size.fromRaw(width, num12 - Math.abs(m11 * width / m21));
                }
            } else if (num6 <= num10 * num5 + num4)
                s = size.fromRaw(num5, num6);
            else if (num8 <= num9 * num7 + num2) {
                s = size.fromRaw(num7, num8);
            } else {
                var width = (num4 - num2) / (num9 - num10);
                s = size.fromRaw(width, num9 * width + num2);
            }
            return s;
        }
    }
    Xaml.Content(LayoutTransformControl, LayoutTransformControl.ChildProperty);

    function rectTransform(rectangle: rect, matrix: Matrix): rect {
        var raw = matrix._Raw;
        var p1 = mat3.transformVec2(raw, [rectangle.X, rectangle.Y]);
        var p2 = mat3.transformVec2(raw, [rectangle.X + rectangle.Width, rectangle.Y]);
        var p3 = mat3.transformVec2(raw, [rectangle.X, rectangle.Y + rectangle.Height]);
        var p4 = mat3.transformVec2(raw, [rectangle.X + rectangle.Width, rectangle.Y + rectangle.Height]);

        var x = Math.min(Math.min(p1[0], p2[0]), Math.min(p3[0], p4[0]));
        var y = Math.min(Math.min(p1[1], p2[1]), Math.min(p3[1], p4[1]));
        var r = Math.max(Math.max(p1[0], p2[0]), Math.max(p3[0], p4[0]));
        var b = Math.max(Math.max(p1[1], p2[1]), Math.max(p3[1], p4[1]));

        var rv = new rect();
        rect.set(rv, x, y, r - x, b - y);
        return rv;
    }
    function roundMatrix(matrix: Matrix, digits: number): Matrix {
        var rv = new Matrix()
        rv.M11 = round(matrix.M11, digits);
        rv.M12 = round(matrix.M12, digits);
        rv.M21 = round(matrix.M21, digits);
        rv.M22 = round(matrix.M22, digits);
        rv.OffsetX = round(matrix.OffsetX, digits);
        rv.OffsetY = round(matrix.OffsetY, digits);
        return rv;
    }
    function round(value: number, digits: number): number {
        var shift = Math.pow(10, digits);
        return Math.round(value * shift) / shift;
    }
    function isSizeSmaller(a: size, b: size): boolean {
        return a.Width + 0.0001 < b.Width || a.Height + 0.0001 < b.Height;
    }
    function doesMatrixHaveInverse(matrix: Matrix): boolean {
        return 0.0 !== matrix.M11 * matrix.M22 - matrix.M12 * matrix.M21;
    }
}