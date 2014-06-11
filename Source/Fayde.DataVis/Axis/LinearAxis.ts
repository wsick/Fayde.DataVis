module Fayde.DataVis {
    export class LinearAxis extends NumericAxis {
        static IntervalProperty = DependencyProperty.Register("Interval", () => Number, LinearAxis, undefined, (d, args) => (<LinearAxis>d)._OnIntervalChanged(args));
        static ActualIntervalProperty = DependencyProperty.Register("ActualInterval", () => Number, LinearAxis, NaN);
        Interval: number;
        ActualInterval: number;

        private _OnIntervalChanged(args: IDependencyPropertyChangedEventArgs) {
            this.OnInvalidated(new RoutedEventArgs());
        }

        constructor() {
            super();
            this.DefaultStyleKey = (<any>this).constructor;
            //this.ActualRange = ...;
        }

        GetPlotAreaCoordinate(value: any, length: number): UnitValue {
            var rng = this.ActualRange;
            if (!rng.HasData)
                return UnitValue.NaN;
            var num1 = ValueHelper.ToDouble(value);
            var num2 = Math.Max(length - 1.0, 0.0);
            var num3 = rng.Maximum - rng.Minimum;
            return new UnitValue((num1 - rng.Minimum) * (num2 / num3), Unit.Pixels);
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
}