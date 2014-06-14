module Fayde.DataVis {
    import Grid = Fayde.Controls.Grid;

    export class DateTimeAxis extends RangeAxis {
        static ActualMinimumProperty = DependencyProperty.RegisterReadOnly("ActualMinimum", () => DateTime, DateTimeAxis);
        static ActualMaximumProperty = DependencyProperty.RegisterReadOnly("ActualMaximum", () => DateTime, DateTimeAxis);
        static ActualIntervalProperty = DependencyProperty.RegisterReadOnly("ActualInterval", () => Number, DateTimeAxis, NaN);
        static ActualIntervalTypeProperty = DependencyProperty.RegisterReadOnly("ActualIntervalType", () => new Enum(DateTimeIntervalType), DateTimeAxis, DateTimeIntervalType.Auto);
        static MinimumProperty = DependencyProperty.Register("Minimum", () => DateTime, DateTimeAxis);
        static MaximumProperty = DependencyProperty.Register("Maximum", () => DateTime, DateTimeAxis);
        static IntervalProperty = DependencyProperty.Register("Interval", () => Number, DateTimeAxis);
        static IntervalTypeProperty = DependencyProperty.Register("IntervalType", () => new Enum(DateTimeIntervalType), DateTimeAxis, DateTimeIntervalType.Auto);
        ActualMinimum: DateTime;
        ActualMaximum: DateTime;
        ActualInterval: number;
        ActualIntervalType: DateTimeIntervalType;
        Minimum: DateTime;
        Maximum: DateTime;
        Interval: number;
        IntervalType: DateTimeIntervalType;

        private _OnMinimumChanged(args: IDependencyPropertyChangedEventArgs) {
            this.ProtectedMinimum = args.NewValue;
        }
        private _OnMaximumChanged(args: IDependencyPropertyChangedEventArgs) {
            this.ProtectedMaximum = args.NewValue;
        }
        private _OnIntervalChanged(args: IDependencyPropertyChangedEventArgs) {
            this.Invalidate();
        }
        private _OnIntervalTypeChanged(args: IDependencyPropertyChangedEventArgs) {
            this.SetCurrentValue(DateTimeAxis.ActualIntervalTypeProperty, args.NewValue);
            this.Invalidate();
        }

        private _ActualDateTimeRange = new Internal.Range<DateTime>();

        get Origin() { return null; }

        constructor() {
            super();
            var year = DateTime.Now.Year;
            this.ActualRange = new Internal.Range<DateTime>(new DateTime(year, 1, 1), new DateTime(year + 1, 1, 1));
        }

        CreateAxisLabel(): Controls.Control {
            return new DateTimeAxisLabel();
        }
        PrepareAxisLabel(label: Controls.Control, dataContext: any) {
            if (label instanceof DateTimeAxisLabel)
                (<DateTimeAxisLabel>label).IntervalType = this.ActualIntervalType;
            super.PrepareAxisLabel(label, dataContext);
        }
        OnActualRangeChanged(range: Internal.Range<DateTime>) {
            this._ActualDateTimeRange = range.Copy();
            if (range.HasData) {
                this.ActualMaximum = range.Maximum;
                this.ActualMinimum = range.Minimum;
            } else {
                this.ActualMaximum = null;
                this.ActualMinimum = null;
            }
            super.OnActualRangeChanged(range);
        }
        CanPlot(value: any): boolean {
            return value instanceof DateTime;
        }
        GetPlotAreaCoordinate(value: any, length: number): UnitValue {
            return getPlotAreaCoordinate(value, this._ActualDateTimeRange, length);
        }
        GetPlotAreaCoordinate_Range(value: any, range: Internal.Range<DateTime>, length: number): UnitValue {
            return getPlotAreaCoordinate(value, range, length);
        }
        private _GetMajorAxisValues(availableSize: size): DateTime[] {
            var ar = this.ActualRange;
            if (!ar.HasData || Internal.Equals(ar.Minimum, ar.Maximum))
                return [];
            if (this.GetLength(availableSize) === 0)
                return [];

            var ai = this.ActualInterval = this._CalculateActualInterval(availableSize);
            var adtr = this._ActualDateTimeRange;
            var start = alignIntervalStart(adtr.Minimum, ai, this.ActualIntervalType);
            while (start < adtr.Minimum)
                start = this._IncrementDateTime(start, ai);

            var cur = start;
            var arr: DateTime[] = [start];
            while (adtr.Contains(cur = this._IncrementDateTime(cur, ai))) {
                arr.push(cur);
            }
            return arr;
        }
        GetMajorTickMarkValues(availableSize: size): IEnumerable<any> {
            return ArrayEx.AsEnumerable(this._GetMajorAxisValues(availableSize));
        }
        GetLabelValues(availableSize: size): IEnumerable<any> {
            return ArrayEx.AsEnumerable(this._GetMajorAxisValues(availableSize));
        }
        GetValueAtPosition(value: UnitValue): any {
            if (!this.ActualRange.HasData || this.ActualLength == 0.0)
                return null;
            if (value.Unit !== Unit.Pixels)
                throw new NotSupportedException("Pixels");
            var adtr = this._ActualDateTimeRange;
            return new DateTime(value.Value * ((adtr.Maximum.Ticks - adtr.Minimum.Ticks) / this.ActualLength) + adtr.Minimum.Ticks);
        }
        OverrideDataRange(rng: Internal.Range<DateTime>): Internal.Range<DateTime> {
            var func: (provider: IValueMarginProvider) => IEnumerable<Internal.ValueMargin> = null;
            if (!rng.HasData) {
                var year = DateTime.Now.Year;
                return new Internal.Range<DateTime>(new DateTime(year, 1, 1), new DateTime(year + 1, 1, 1));
            } else if (rng.Minimum.Ticks === rng.Maximum.Ticks) {
                var dt = (Internal.Equals(DateTime.MinValue, rng.Minimum) ? DateTime.Now : rng.Minimum).Date;
                return new Internal.Range<DateTime>(dt.AddMonths(-6), dt.AddMonths(6));
            } else {
                if (rng.HasData && this.ActualLength > 1.0) {
                    var valueMargins: Internal.IValueMarginCoordinateAndOverlap[] = [];
                    for (var en = this.RegisteredListeners.GetEnumerator(); en.MoveNext();) {
                        var provider = IValueMarginProvider_.As(en.Current);
                        if (!provider)
                            continue;
                        for (var en2 = provider.GetValueMargins(this).GetEnumerator(); en2.MoveNext;) {
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
                        var range2 = rng.Copy();
                        if (range2.Minimum.Ticks === range2.Maximum.Ticks) {
                            var year = DateTime.Now.Year;
                            range2 = new Internal.Range<DateTime>(new DateTime(year, 1, 1), new DateTime(year + 1, 1, 1));
                        }
                        var actualLength = this.ActualLength;
                        this._UpdateValueMargins(valueMargins, range2);
                        var overlap = RangeAxis.GetMaxLeftAndRightOverlap(valueMargins);
                        while (overlap.left.LeftOverlap > 0.0 || overlap.right.RightOverlap > 0.0) {
                            var num = Internal.DateTimeRange_GetLength(range2) / actualLength;
                            range2 = new Internal.Range<DateTime>(new DateTime(range2.Minimum.Ticks - ((overlap.left.LeftOverlap + 0.5) * num)), new DateTime(range2.Maximum.Ticks + ((overlap.right.RightOverlap + 0.5) * num)));
                            this._UpdateValueMargins(valueMargins, range2);
                            overlap = RangeAxis.GetMaxLeftAndRightOverlap(valueMargins);
                        }
                        return range2;
                    }
                }
                return rng;
            }
        }

        private _CalculateActualInterval(availableSize: size): number {
            if (this.Interval != null)
                return this.Interval;
            var actualDateTimeRange = this._ActualDateTimeRange;
            var minimum = actualDateTimeRange.Minimum;
            var maximum = actualDateTimeRange.Maximum;
            var type = { Value: DateTimeIntervalType.Auto };
            var value = this._CalculateDateTimeInterval(minimum, maximum, type, availableSize);
            this.SetCurrentValue(DateTimeAxis.ActualIntervalTypeProperty, type.Value);
            return value;
        }
        private _CalculateDateTimeInterval(minimum: DateTime, maximum: DateTime, type: IOutValue, availableSize: size): number {
            var factor = this.Orientation === AxisOrientation.X ? 6.4 : 8.0;
            var length = this.GetLength(availableSize) / (2000.0 / factor);
            var timeSpan = maximum.Subtract(minimum);
            timeSpan = new TimeSpan(timeSpan.Ticks / length);
            return getDateTimeInterval(timeSpan, type);
        }

        private _IncrementDateTime(dt: DateTime, interval: number): DateTime {
            var actualIntervalType = this.ActualIntervalType;
            var timeSpan = new TimeSpan(0);
            if (actualIntervalType === DateTimeIntervalType.Days)
                timeSpan = TimeSpan.FromDays(interval);
            else if (actualIntervalType === DateTimeIntervalType.Hours)
                timeSpan = TimeSpan.FromHours(interval);
            else if (actualIntervalType === DateTimeIntervalType.Milliseconds)
                timeSpan = TimeSpan.FromMilliseconds(interval);
            else if (actualIntervalType === DateTimeIntervalType.Seconds)
                timeSpan = TimeSpan.FromSeconds(interval);
            else if (actualIntervalType === DateTimeIntervalType.Minutes)
                timeSpan = TimeSpan.FromMinutes(interval);
            else if (actualIntervalType === DateTimeIntervalType.Weeks)
                timeSpan = TimeSpan.FromDays(7.0 * interval);
            else if (actualIntervalType === DateTimeIntervalType.Months) {
                var flag = false;
                if (dt.Day == DateTime.DaysInMonth(dt.Year, dt.Month))
                    flag = true;
                dt = dt.AddMonths(Math.floor(interval));
                timeSpan = TimeSpan.FromDays(30.0 * (interval - Math.floor(interval)));
                if (flag && timeSpan.Ticks === 0) {
                    var num = DateTime.DaysInMonth(dt.Year, dt.Month);
                    dt = dt.AddDays(num - dt.Day);
                }
            } else if (actualIntervalType == DateTimeIntervalType.Years) {
                dt = dt.AddYears(Math.floor(interval));
                timeSpan = TimeSpan.FromDays(365.0 * (interval - Math.floor(interval)));
            }
            return dt.Add(timeSpan);
        }
    }
    Fayde.Controls.TemplateParts(DateTimeAxis,
        { Name: "AxisTitle", Type: Title },
        { Name: "AxisGrid", Type: Grid });

    //[StyleTypedProperty(Property = "GridLineStyle", StyleTargetType = typeof (Line))]
    //[StyleTypedProperty(Property = "MajorTickMarkStyle", StyleTargetType = typeof (Line))]
    //[StyleTypedProperty(Property = "MinorTickMarkStyle", StyleTargetType = typeof (Line))]
    //[StyleTypedProperty(Property = "AxisLabelStyle", StyleTargetType = typeof (DateTimeAxisLabel))]
    //[StyleTypedProperty(Property = "TitleStyle", StyleTargetType = typeof (Title))]

    function getPlotAreaCoordinate(value: any, rng: Internal.Range<DateTime>, length: number): UnitValue {
        if (!rng.HasData)
            return UnitValue.NaN;
        var dt1 = <DateTime>Fayde.ConvertAnyToType(value, DateTime);
        return new UnitValue((dt1.Ticks - rng.Minimum.Ticks) * (Math.max(length - 1.0, 0.0) / (rng.Maximum.Ticks - rng.Minimum.Ticks)), Unit.Pixels);
    }
    function getDateTimeInterval(timeSpan: TimeSpan, type: IOutValue): number {
        var totalMinutes = timeSpan.TotalMinutes;
        if (totalMinutes <= 1.0) {
            var totalMilliseconds = timeSpan.TotalMilliseconds;
            if (totalMilliseconds <= 10.0) {
                type.Value = DateTimeIntervalType.Milliseconds;
                return 1.0;
            } else if (totalMilliseconds <= 50.0) {
                type.Value = DateTimeIntervalType.Milliseconds;
                return 4.0;
            } else if (totalMilliseconds <= 200.0) {
                type.Value = DateTimeIntervalType.Milliseconds;
                return 20.0;
            } else if (totalMilliseconds <= 500.0) {
                type.Value = DateTimeIntervalType.Milliseconds;
                return 50.0;
            } else {
                var totalSeconds = timeSpan.TotalSeconds;
                if (totalSeconds <= 7.0) {
                    type.Value = DateTimeIntervalType.Seconds;
                    return 1.0;
                } else if (totalSeconds <= 15.0) {
                    type.Value = DateTimeIntervalType.Seconds;
                    return 2.0;
                } else if (totalSeconds <= 30.0) {
                    type.Value = DateTimeIntervalType.Seconds;
                    return 5.0;
                } else if (totalSeconds <= 60.0) {
                    type.Value = DateTimeIntervalType.Seconds;
                    return 10.0;
                }
            }
        } else if (totalMinutes <= 2.0) {
            type.Value = DateTimeIntervalType.Seconds;
            return 20.0;
        } else if (totalMinutes <= 3.0) {
            type.Value = DateTimeIntervalType.Seconds;
            return 30.0;
        } else if (totalMinutes <= 10.0) {
            type.Value = DateTimeIntervalType.Minutes;
            return 1.0;
        } else if (totalMinutes <= 20.0) {
            type.Value = DateTimeIntervalType.Minutes;
            return 2.0;
        } else if (totalMinutes <= 60.0) {
            type.Value = DateTimeIntervalType.Minutes;
            return 5.0;
        } else if (totalMinutes <= 120.0) {
            type.Value = DateTimeIntervalType.Minutes;
            return 10.0;
        } else if (totalMinutes <= 180.0) {
            type.Value = DateTimeIntervalType.Minutes;
            return 30.0;
        } else if (totalMinutes <= 720.0) {
            type.Value = DateTimeIntervalType.Hours;
            return 1.0;
        } else if (totalMinutes <= 1440.0) {
            type.Value = DateTimeIntervalType.Hours;
            return 4.0;
        } else if (totalMinutes <= 2880.0) {
            type.Value = DateTimeIntervalType.Hours;
            return 6.0;
        } else if (totalMinutes <= 4320.0) {
            type.Value = DateTimeIntervalType.Hours;
            return 12.0;
        } else if (totalMinutes <= 14400.0) {
            type.Value = DateTimeIntervalType.Days;
            return 1.0;
        } else if (totalMinutes <= 28800.0) {
            type.Value = DateTimeIntervalType.Days;
            return 2.0;
        } else if (totalMinutes <= 43200.0) {
            type.Value = DateTimeIntervalType.Days;
            return 3.0;
        } else if (totalMinutes <= 87840.0) {
            type.Value = DateTimeIntervalType.Weeks;
            return 1.0;
        } else if (totalMinutes <= 219600.0) {
            type.Value = DateTimeIntervalType.Weeks;
            return 2.0;
        } else if (totalMinutes <= 527040.0) {
            type.Value = DateTimeIntervalType.Months;
            return 1.0;
        } else if (totalMinutes <= 1054080.0) {
            type.Value = DateTimeIntervalType.Months;
            return 3.0;
        } else if (totalMinutes <= 2108160.0) {
            type.Value = DateTimeIntervalType.Months;
            return 6.0;
        }
        type.Value = DateTimeIntervalType.Years;
        var years = totalMinutes / 60.0 / 24.0 / 365.0;
        if (years < 5.0)
            return 1.0;
        if (years < 10.0)
            return 2.0;
        return Math.floor(years / 5.0);
    }
    function alignIntervalStart(start: DateTime, intervalSize: number, type: DateTimeIntervalType): DateTime {
        if (type === DateTimeIntervalType.Auto)
            return start;
        if (intervalSize > 0.0 && intervalSize !== 1.0 && (type === DateTimeIntervalType.Months && intervalSize <= 12.0 && intervalSize > 1.0)) {
            var cur = start;
            for (var counter = new DateTime(start.Year, 1, 1, 0, 0, 0); counter < start; counter = counter.AddMonths(intervalSize))
                cur = counter;
            return cur;
        } else {
            switch (type) {
                case DateTimeIntervalType.Milliseconds:
                    var millisecond = (start.Millisecond / intervalSize) * intervalSize;
                    start = new DateTime(start.Year, start.Month, start.Day, start.Hour, start.Minute, start.Second, millisecond);
                    break;
                case DateTimeIntervalType.Seconds:
                    var second = (start.Second / intervalSize) * intervalSize;
                    start = new DateTime(start.Year, start.Month, start.Day, start.Hour, start.Minute, second, 0);
                    break;
                case DateTimeIntervalType.Minutes:
                    var minute = (start.Minute / intervalSize) * intervalSize;
                    start = new DateTime(start.Year, start.Month, start.Day, start.Hour, minute, 0);
                    break;
                case DateTimeIntervalType.Hours:
                    var hour = (start.Hour / intervalSize) * intervalSize;
                    start = new DateTime(start.Year, start.Month, start.Day, hour, 0, 0);
                    break;
                case DateTimeIntervalType.Days:
                    var day = (start.Day / intervalSize) * intervalSize;
                    if (day <= 0)
                        day = 1;
                    start = new DateTime(start.Year, start.Month, day, 0, 0, 0);
                    break;
                case DateTimeIntervalType.Weeks:
                    start = new DateTime(start.Year, start.Month, start.Day, 0, 0, 0);
                    start = start.AddDays(-start.DayOfWeek);
                    break;
                case DateTimeIntervalType.Months:
                    var month = (start.Month / intervalSize) * intervalSize;
                    if (month <= 0)
                        month = 1;
                    start = new DateTime(start.Year, month, 1, 0, 0, 0);
                    break;
                case DateTimeIntervalType.Years:
                    var year = (start.Year / intervalSize) * intervalSize;
                    if (year <= 0)
                        year = 1;
                    start = new DateTime(year, 1, 1, 0, 0, 0);
                    break;
            }
            return start;
        }
    }
}