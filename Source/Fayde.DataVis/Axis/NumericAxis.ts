module Fayde.DataVis {
    export class NumericAxis extends RangeAxis {
        static ActualMinimumProperty = DependencyProperty.Register("ActualMinimum", () => Number, NumericAxis);
        static ActualMaximumProperty = DependencyProperty.Register("ActualMaximum", () => Number, NumericAxis);
        static MinimumProperty = DependencyProperty.Register("Minimum", () => Number, NumericAxis);
        static MaximumProperty = DependencyProperty.Register("Maximum", () => Number, NumericAxis);
        static ExtendRangeToOriginProperty = DependencyProperty.Register("ExtendRangeToOrigin", () => Boolean, NumericAxis, false);
        ActualMinimum: number;
        ActualMaximum: number;
        Minimum: number;
        Maximum: number;
        ExtendRangeToOrigin: boolean;

        private _OnMinimumChanged(args: IDependencyPropertyChangedEventArgs) {
            this.ProtectedMinimum = args.OldValue;
        }
        private _OnMaximumChanged(args: IDependencyPropertyChangedEventArgs) {
            this.ProtectedMaximum = args.NewValue;
        }
        private _OnExtendRangeToOriginChanged(args: IDependencyPropertyChangedEventArgs) {
            this.ActualRange = this.OverrideDataRange(this.ActualRange);
        }

        get Origin(): any { return 0; }

        OnActualRangeChanged(range: Internal.Range<any>) {
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
            var v = parseFloat(value);
            return !isNaN(v);
        }

        CreateAxisLabel(): Controls.Control {
            return new NumericAxisLabel();
        }

        OverrideDataRange(range: Internal.Range<any>): Internal.Range<number> {
            range = super.OverrideDataRange(range);
            if (!this.ExtendRangeToOrigin)
                return range;
            range = new Internal.Range<number>(range.Minimum, range.Maximum);
            if (!range.HasData)
                return new Internal.Range<number>(0.0, 0.0);
            var num1 = range.Minimum;
            var num2 = range.Maximum;
            if (num1 > 0.0)
                num1 = 0.0;
            else if (num2 < 0.0)
                num2 = 0.0;
            return new Internal.Range<number>(num1, num2);
        }
    }
}