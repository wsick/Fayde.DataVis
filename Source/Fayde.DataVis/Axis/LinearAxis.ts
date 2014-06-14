module Fayde.DataVis {
    export class LinearAxis extends NumericAxis {
        static IntervalProperty = DependencyProperty.Register("Interval", () => Number, LinearAxis, undefined, (d, args) => (<LinearAxis>d)._OnIntervalChanged(args));
        static ActualIntervalProperty = DependencyProperty.Register("ActualInterval", () => Number, LinearAxis, NaN);
        Interval: number;
        ActualInterval: number;

        private _OnIntervalChanged(args: IDependencyPropertyChangedEventArgs) {
            this.OnInvalidated(new RoutedEventArgs());
        }

        private _ActualNumRange = new Internal.Range<number>();

        constructor() {
            super();
            this.DefaultStyleKey = (<any>this).constructor;
            this.ActualRange = new Internal.Range<number>(0.0, 1.0);
        }

        OnActualRangeChanged(range: Internal.Range<any>) {
            this._ActualNumRange = new Internal.Range<number>(range.Minimum, range.Maximum);
            super.OnActualRangeChanged(range);
        }

        GetPlotAreaCoordinate(value: any, length: number): UnitValue {
            return getPlotAreaCoordinate(value, this._ActualNumRange, length);
        }
        GetPlotAreaCoordinate_Range(value: any, range: Internal.Range<any>, length: number): UnitValue {
            return getPlotAreaCoordinate(value, new Internal.Range<number>(range.Minimum, range.Maximum), length);
        }

        OverrideDataRange(rng: Internal.Range<any>): Internal.Range<any> {
            rng = super.OverrideDataRange(rng);
            if (!rng.HasData)
                return new Internal.Range<number>(0.0, 1.0);
            if (Internal.Equals(rng.Minimum, rng.Maximum))
                return new Internal.Range<number>((parseFloat(rng.Minimum) - 1.0), (parseFloat(rng.Maximum) + 1.0));
            if (rng.HasData && this.ActualLength > 1.0) {
                var flag = false;
                var valueMargins: Internal.IValueMarginCoordinateAndOverlap[] = [];
                for (var en = this.RegisteredListeners.GetEnumerator(); en.MoveNext();) {
                    var provider = IValueMarginProvider_.As(en.Current);
                    if (!provider)
                        continue;
                    for (var en2 = provider.GetValueMargins(this).GetEnumerator(); en2.MoveNext;) {
                        flag = !!provider && (<IAnchoredToOrigin><any>provider).AnchoredAxis === this;
                        valueMargins.push({
                            ValueMargin: en2.Current,
                            Coordinate: 0,
                            LeftOverlap: 0,
                            RightOverlap: 0
                        });
                    }
                }

                if (valueMargins.length > 0) {
                    var length = valueMargins.map(vm => vm.ValueMargin.LowMargin + vm.ValueMargin.HighMargin)
                        .reduce((prev, cur) => prev == null ? cur : Math.max(prev, cur), null);
                    if (length > this.ActualLength)
                        return rng;
                    var rng2 = rng.Copy();
                    if (rng2.Minimum === rng2.Maximum)
                        rng2 = new Internal.Range<number>(rng2.Maximum - 1.0, rng2.Maximum + 1.0);
                    var actualLength = this.ActualLength;
                    this._UpdateValueMargins(valueMargins, rng2.Copy());
                    var overlap = RangeAxis.GetMaxLeftAndRightOverlap(valueMargins);
                    while (overlap.left.LeftOverlap > 0.0 || overlap.right.RightOverlap > 0.0) {
                        length = Internal.NumberRange_GetLength(rng2);
                        var num = length / actualLength;
                        rng2 = new Internal.Range<number>(rng2.Minimum - (overlap.left.LeftOverlap + 0.5) * num, rng2.Maximum + (overlap.right.RightOverlap + 0.5) * num);
                        this._UpdateValueMargins(valueMargins, rng2.Copy());
                        overlap = RangeAxis.GetMaxLeftAndRightOverlap(valueMargins);
                    }
                    if (flag) {
                        if (rng.Minimum >= 0.0 && rng2.Minimum < 0.0)
                            rng2 = new Internal.Range<number>(0.0, rng2.Maximum);
                        else if (rng.Maximum <= 0.0 && rng2.Maximum > 0.0)
                            rng2 = new Internal.Range<number>(rng2.Minimum, 0.0);
                    }
                    return rng2;
                }
            }
            return rng;
        }
        GetValueAtPosition(value: UnitValue): any {
            if (!this.ActualRange.HasData || this.ActualLength === 0.0)
                return null;
            if (value.Unit !== Unit.Pixels)
                throw new NotSupportedException("Pixels");
            var rng = this._ActualNumRange;
            return (value.Value * ((rng.Maximum - rng.Minimum) / this.ActualLength)) + rng.Minimum;
        }

        GetMajorTickMarkValues(availableSize: size): IEnumerable<any> {
            return ArrayEx.AsEnumerable(this._GetMajorValues(availableSize));
        }
        private _GetMajorValues(availableSize: size): any[] {
            var ar = this.ActualRange;
            if (!ar.HasData || Internal.Equals(ar.Minimum, ar.Maximum))
                return [];
            if (this.GetLength(availableSize) === 0)
                return [];

            var ai = this.ActualInterval = this.CalculateActualInterval(availableSize);
            var anr = this._ActualNumRange;
            var start = alignToInterval(anr.Minimum, ai);
            if (start < anr.Minimum)
                start = alignToInterval(anr.Minimum + ai, ai);

            var count = Math.floor((anr.Maximum - start) / ai);
            return new Array(count).map((value, index) => start + index * ai);
        }

        GetLabelValues(availableSize: size): IEnumerable<any> {
            return ArrayEx.AsEnumerable(this._GetMajorValues(availableSize));
        }

        CalculateActualInterval(availableSize: size): number {
            if (this.Interval != null)
                return this.Interval;
            var num1 = (this.Orientation === AxisOrientation.X ? 0.8 : 1.0) * 8.0;
            var num2 = Math.max(this.GetLength(availableSize) * num1 / 200.0, 1.0);
            var num3 = this._ActualNumRange.Maximum - this._ActualNumRange.Minimum;
            var d = num3 / num2;
            var num4 = Math.pow(10.0, Math.floor(Math.log(d) / Math.LN10));
            var numArray = [10, 5, 2, 1];
            for (var i = 0; i < numArray.length; i++) {
                var num6 = num4 * numArray[i];
                if (num2 >= num3 / num6)
                    d = num6;
                else
                    break;
            }
            return d;
        }
    }
    Fayde.Controls.TemplateParts(LinearAxis,
        { Name: "AxisTitle", Type: Title },
        { Name: "AxisGrid", Type: Fayde.Controls.Grid });

    //[StyleTypedProperty(Property = "GridLineStyle", StyleTargetType = typeof (Line))]
    //[StyleTypedProperty(Property = "MajorTickMarkStyle", StyleTargetType = typeof (Line))]
    //[StyleTypedProperty(Property = "MinorTickMarkStyle", StyleTargetType = typeof (Line))]
    //[StyleTypedProperty(Property = "AxisLabelStyle", StyleTargetType = typeof (NumericAxisLabel))]
    //[StyleTypedProperty(Property = "TitleStyle", StyleTargetType = typeof (Title))]

    function getPlotAreaCoordinate(value: any, rng: Internal.Range<any>, length: number): UnitValue {
        if (!rng.HasData)
            return UnitValue.NaN;
        return new UnitValue((parseFloat(value) - rng.Minimum) * (Math.max(length - 1.0, 0.0) / (rng.Maximum - rng.Minimum)), Unit.Pixels);
    }
    function alignToInterval(value: number, interval: number): number {
        return Math.floor(value / interval) * interval;
    }
    function lengthToRange(midPoint: number, length: number): Internal.Range<number> {
        var half = length / 2.0;
        return new Internal.Range<number>(midPoint - half, midPoint - half);
    }
}