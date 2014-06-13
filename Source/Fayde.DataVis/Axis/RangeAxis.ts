module Fayde.DataVis {
    export interface IRangeAxis {
        Range: Internal.Range<any>;
        Origin: any;
        GetValueAtPosition(position: UnitValue): any;
    }

    export class RangeAxis extends DisplayAxis implements IRangeAxis, IAxis, IRangeConsumer, IValueMarginConsumer {
        static MinorTickMarkStyleProperty = DependencyProperty.Register("MinorTickMarkStyle", () => Style, DisplayAxis);
        MinorTickMarkStyle: Style;

        private _MajorTickMarkPool: Internal.ObjectPool<Shapes.Line>;
        private _MinorTickMarkPool: Internal.ObjectPool<Shapes.Line>;
        private _LabelPool: Internal.ObjectPool<Controls.Control>;

        private _ActualRange = new Internal.Range<any>();
        get ActualRange(): Internal.Range<any> { return this._ActualRange; }
        set ActualRange(value: Internal.Range<any>) {
            value = this._ClampRange(value);
            if (this._ActualRange.Equals(value))
                return;
            this._ActualRange = value;
            this.OnActualRangeChanged(value);
        }
        OnActualRangeChanged(value: Internal.Range<any>) {
            this.Invalidate();
        }

        private _ProtectedMinimum: any = null;
        get ProtectedMinimum() { return this._ProtectedMinimum; }
        set ProtectedMinimum(value: any) {
            if (value != null && this.ProtectedMaximum != null && value > this.ProtectedMaximum)
                throw new InvalidOperationException("Minimum value must be less than or equal to maximum value.");
            if (Internal.Equals(this._ProtectedMinimum, value))
                return;
            this._ProtectedMinimum = value;
            this._UpdateActualRange();
        }
        
        private _ProtectedMaximum: any = null;
        get ProtectedMaximum() { return this._ProtectedMaximum; }
        set ProtectedMaximum(value: any) {
            if (value != null && this.ProtectedMinimum != null && this.ProtectedMinimum > value)
                throw new InvalidOperationException("Minimum value must be greater than or equal to maximum value.");
            if (Internal.Equals(this._ProtectedMaximum, value))
                return;
            this._ProtectedMaximum = value;
            this._UpdateActualRange();
        }

        get Range(): Internal.Range<any> { return this.ActualRange; }
        get Origin(): any { return null; } //Abstract
        GetValueAtPosition(position: UnitValue): any { } //Abstract

        RangeChanged(provider: IRangeProvider, range: Internal.Range<any>) {
            this._UpdateActualRange();
        }
        ValueMarginsChanged(provider: IValueMarginProvider, valueMargins: IEnumerable<Internal.ValueMargin>) {
            var doUpdate = () => {
                if (this.Orientation === AxisOrientation.None)
                    return;
                var ranges = Enumerable.ToArray(valueMargins)
                    .map(vm => {
                        var num = this.GetPlotAreaCoordinate(vm.Value).Value;
                        return new Internal.Range<number>(num - vm.LowMargin, num + vm.HighMargin);
                    });
                if (ranges.some(range => range.Minimum < 0.0 || range.Maximum > this.ActualLength))
                    this._UpdateActualRange();
            };
            if (this.ActualLength === 0.0)
                window.setTimeout(doUpdate, 1);
            else
                doUpdate();
        }

        constructor() {
            super();
            this.DefaultStyleKey = (<any>this).constructor;
            this._MajorTickMarkPool = new Internal.ObjectPool<Shapes.Line>(() => this.CreateMajorTickMark());
            this._MinorTickMarkPool = new Internal.ObjectPool<Shapes.Line>(() => this.CreateMinorTickMark());
            this._LabelPool = new Internal.ObjectPool<Controls.Control>(() => this.CreateAxisLabel());
            this.SizeChanged.Subscribe(this._OnSizeChanged2, this);
        }

        private _OnSizeChanged2(sender: any, e: SizeChangedEventArgs) {
            this.SizeChanged.Unsubscribe(this._OnSizeChanged2, this);
            this._UpdateActualRange();
        }

        OnObjectRegistered(series: IAxisListener) {
            super.OnObjectRegistered(series);
            if (!IRangeProvider_.Is(series) && !IValueMarginProvider_.Is(series))
                return;
            this._UpdateActualRange();
        }
        OnObjectUnregistered(series: IAxisListener) {
            super.OnObjectUnregistered(series);
            if (!IRangeProvider_.Is(series) && !IValueMarginProvider_.Is(series))
                return;
            this._UpdateActualRange();
        }
        CreateMinorTickMark(): Shapes.Line {
            return this.CreateTickMark(this.MinorTickMarkStyle);
        }

        GetPlotAreaCoordinate(value: any, length?: number): UnitValue {
            if (value == null)
                throw new ArgumentNullException("value");
            if (length === null)
                return this.GetPlotAreaCoordinate(value, this.ActualLength);
            //Abstract
        }
        GetPlotAreaCoordinate_Range(value: any, range: Internal.Range<any>, length: number): UnitValue { return null; } //Abstract

        Render(availableSize: size) {
            this._RenderOriented(availableSize);
        }

        private _RenderOriented(availableSize: size) {
            this._MinorTickMarkPool.Reset();
            this._MajorTickMarkPool.Reset();
            this._LabelPool.Reset();
            var length = this.GetLength(availableSize);
            try {
                this.OrientedPanel.Children.Clear();
                if (!this.ActualRange.HasData)
                    return;
                var actualRange = this.ActualRange;
                if (Internal.Equals(actualRange.Minimum, actualRange.Maximum))
                    return;

                for (var en = this.GetMajorTickMarkValues(availableSize).GetEnumerator(); en.MoveNext();) {
                    var plotAreaCoordinate = this.GetPlotAreaCoordinate(en.Current, length);
                    if (Internal.CanGraph(plotAreaCoordinate.Value)) {
                        var line = this._MajorTickMarkPool.Next();
                        OrientedPanel.SetCenterCoordinate(line, plotAreaCoordinate.Value);
                        OrientedPanel.SetPriority(line, 0);
                        this.OrientedPanel.Children.Add(line);
                    }
                }

                for (var en = this.GetMinorTickMarkValues(availableSize).GetEnumerator(); en.MoveNext();) {
                    var plotAreaCoordinate = this.GetPlotAreaCoordinate(en.Current, length);
                    if (Internal.CanGraph(plotAreaCoordinate.Value)) {
                        var line = this._MinorTickMarkPool.Next();
                        OrientedPanel.SetCenterCoordinate(line, plotAreaCoordinate.Value);
                        OrientedPanel.SetPriority(line, 0);
                        this.OrientedPanel.Children.Add(line);
                    }
                }

                var priority = 0;
                for (var en = this.GetLabelValues(availableSize).GetEnumerator(); en.MoveNext();) {
                    var plotAreaCoordinate = this.GetPlotAreaCoordinate(en.Current, length);
                    if (Internal.CanGraph(plotAreaCoordinate.Value)) {
                        var label = this._LabelPool.Next();
                        this.PrepareAxisLabel(label, en.Current);
                        OrientedPanel.SetCenterCoordinate(label, plotAreaCoordinate.Value);
                        OrientedPanel.SetPriority(label, priority + 1);
                        this.OrientedPanel.Children.Add(label);
                        priority = (priority + 1) % 2;
                    }
                }
            } finally {
                this._MinorTickMarkPool.Done();
                this._MajorTickMarkPool.Done();
                this._LabelPool.Done();
            }
        }

        private _UpdateActualRange() {
            var action = () => {
                if (this.ProtectedMaximum == null || this.ProtectedMinimum == null) {
                    if (this.Orientation == AxisOrientation.None) {
                        if (this.ProtectedMinimum != null)
                            this.ActualRange = this.OverrideDataRange(new Internal.Range<any>(this.ProtectedMinimum, this.ProtectedMinimum));
                        else
                            this.ActualRange = this.OverrideDataRange(new Internal.Range<any>(this.ProtectedMaximum, this.ProtectedMaximum));
                    } else {
                        var source = Internal.OfInterface<IAxisListener, IRangeProvider>(this.RegisteredListeners, IRangeProvider_);
                        var range = new Internal.Range<any>();
                        for (var enumerator = source.GetEnumerator(); enumerator.MoveNext();) {
                            range = range.Add(enumerator.Current.GetRange(this));
                        }
                        this.ActualRange = this.OverrideDataRange(range);
                    }
                } else {
                    this.ActualRange = new Internal.Range<any>(this.ProtectedMinimum, this.ProtectedMaximum);
                }
            };
            action();
        }
        _UpdateValueMargins(valueMargins: Internal.IValueMarginCoordinateAndOverlap[], range: Internal.Range<any>) {
            var actualLength = this.ActualLength;
            for (var i = 0, len = valueMargins.length; i < len; ++i) {
                var cur = valueMargins[i];
                var vm = cur.ValueMargin;
                cur.Coordinate = this.GetPlotAreaCoordinate_Range(vm.Value, range, actualLength).Value;
                cur.LeftOverlap = -(cur.Coordinate - vm.LowMargin);
                cur.RightOverlap = cur.Coordinate + vm.HighMargin - actualLength;
            }
        }

        OverrideDataRange(range: Internal.Range<any>): Internal.Range<any> {
            return range;
        }

        private _ClampRange(range: Internal.Range<any>): Internal.Range<any> {
            if (!range || !range.HasData) {
                var minimum = this.ProtectedMinimum;
                var maximum = this.ProtectedMaximum;
                if (this.ProtectedMinimum != null && this.ProtectedMaximum == null) {
                    maximum = minimum;
                } else {
                    if (this.ProtectedMaximum == null || this.ProtectedMinimum != null)
                        return range;
                    minimum = maximum;
                }
                return new Internal.Range<any>(minimum, maximum);
            } else {
                var min = this.ProtectedMinimum;
                if (min == null) min = range.Minimum;
                var max = this.ProtectedMaximum;
                if (max == null) max = range.Maximum;
                if (min > max)
                    return new Internal.Range<any>(max, min);
                return new Internal.Range<any>(min, max);
            }
        }

        GetMajorGridLineCoordinates(availableSize: size): IEnumerable<UnitValue> {
            return ArrayEx.AsEnumerable(
                Enumerable.ToArray(this.GetMajorTickMarkValues(availableSize))
                    .map(v => super.GetPlotAreaCoordinate(v))
                    .filter(v => Internal.CanGraph(v.Value)));
        }
        GetMajorGridLineValues(availableSize: size): IEnumerable<any> {
            return this.GetMajorTickMarkValues(availableSize);
        }
        GetMajorTickMarkValues(availableSize: size): IEnumerable<any> { return null; } //Abstract 
        GetMinorTickMarkValues(availableSize: size): IEnumerable<any> {
            return ArrayEx.AsEnumerable([]);
        }
        GetLabelValues(availableSize: size): IEnumerable<any> { return null; } //Abstract

        static GetMaxLeftAndRightOverlap(valueMargins: Internal.IValueMarginCoordinateAndOverlap[]): { left: Internal.IValueMarginCoordinateAndOverlap; right: Internal.IValueMarginCoordinateAndOverlap; } {
            var mlovm: Internal.IValueMarginCoordinateAndOverlap;
            var mrovm: Internal.IValueMarginCoordinateAndOverlap;

            var left = Number.MIN_VALUE;
            var right = Number.MIN_VALUE;
            for (var i = 0, len = valueMargins.length; i < len; ++i) {
                var coordinateAndOverlap = valueMargins[i];
                var leftOverlap = coordinateAndOverlap.LeftOverlap;
                if (leftOverlap > left) {
                    left = leftOverlap;
                    mlovm = coordinateAndOverlap;
                }
                var rightOverlap = coordinateAndOverlap.RightOverlap;
                if (rightOverlap > right) {
                    right = rightOverlap;
                    mrovm = coordinateAndOverlap;
                }
            }

            mlovm = mlovm || {
                ValueMargin: new Internal.ValueMargin(),
                Coordinate: 0,
                LeftOverlap: 0,
                RightOverlap: 0
            };

            mrovm = mrovm || {
                ValueMargin: new Internal.ValueMargin(),
                Coordinate: 0,
                LeftOverlap: 0,
                RightOverlap: 0
            };

            return {
                left: <Internal.IValueMarginCoordinateAndOverlap>{
                    ValueMargin: mlovm.ValueMargin,
                    Coordinate: mlovm.Coordinate,
                    LeftOverlap: mlovm.LeftOverlap,
                    RightOverlap: mlovm.RightOverlap
                },
                right: <Internal.IValueMarginCoordinateAndOverlap>{
                    ValueMargin: mrovm.ValueMargin,
                    Coordinate: mrovm.Coordinate,
                    LeftOverlap: mrovm.LeftOverlap,
                    RightOverlap: mrovm.RightOverlap
                }
            };
        }
    }
}