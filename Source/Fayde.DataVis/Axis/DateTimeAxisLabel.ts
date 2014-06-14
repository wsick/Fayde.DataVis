module Fayde.DataVis {
    export class DateTimeAxisLabel extends AxisLabel {
        static IntervalTypeProperty = DependencyProperty.Register("IntervalType", () => new Enum(DateTimeIntervalType), DateTimeAxisLabel, DateTimeIntervalType.Auto);
        static YearsIntervalStringFormatProperty = DependencyProperty.Register("YearsIntervalStringFormat", () => String, DateTimeAxisLabel, undefined, (d, args) => (<DateTimeAxisLabel>d).OnYearsIntervalStringFormatChanged(args.OldValue, args.NewValue));
        static MonthsIntervalStringFormatProperty = DependencyProperty.Register("MonthsIntervalStringFormat", () => String, DateTimeAxisLabel, undefined, (d, args) => (<DateTimeAxisLabel>d).OnMonthsIntervalStringFormatChanged(args.OldValue, args.NewValue));
        static WeeksIntervalStringFormatProperty = DependencyProperty.Register("WeeksIntervalStringFormat", () => String, DateTimeAxisLabel, undefined, (d, args) => (<DateTimeAxisLabel>d).OnWeeksIntervalStringFormatChanged(args.OldValue, args.NewValue));
        static DaysIntervalStringFormatProperty = DependencyProperty.Register("DaysIntervalStringFormat", () => String, DateTimeAxisLabel, undefined, (d, args) => (<DateTimeAxisLabel>d).OnDaysIntervalStringFormatChanged(args.OldValue, args.NewValue));
        static HoursIntervalStringFormatProperty = DependencyProperty.Register("HoursIntervalStringFormat", () => String, DateTimeAxisLabel, undefined, (d, args) => (<DateTimeAxisLabel>d).OnHoursIntervalStringFormatChanged(args.OldValue, args.NewValue));
        static MinutesIntervalStringFormatProperty = DependencyProperty.Register("MinutesIntervalStringFormat", () => String, DateTimeAxisLabel, undefined, (d, args) => (<DateTimeAxisLabel>d).OnMinutesIntervalStringFormatChanged(args.OldValue, args.NewValue));
        static SecondsIntervalStringFormatProperty = DependencyProperty.Register("SecondsIntervalStringFormat", () => String, DateTimeAxisLabel, undefined, (d, args) => (<DateTimeAxisLabel>d).OnSecondsIntervalStringFormatChanged(args.OldValue, args.NewValue));
        static MillisecondsIntervalStringFormatProperty = DependencyProperty.Register("MillisecondsIntervalStringFormat", () => String, DateTimeAxisLabel, undefined, (d, args) => (<DateTimeAxisLabel>d).OnMillisecondsIntervalStringFormatChanged(args.OldValue, args.NewValue));
        IntervalType: DateTimeIntervalType;
        YearsIntervalStringFormat: string;
        MonthsIntervalStringFormat: string;
        WeeksIntervalStringFormat: string;
        DaysIntervalStringFormat: string;
        HoursIntervalStringFormat: string;
        MinutesIntervalStringFormat: string;
        SecondsIntervalStringFormat: string;
        MillisecondsIntervalStringFormat: string;

        OnYearsIntervalStringFormatChanged(oldValue: string, newValue: string) {
            this.UpdateFormattedContent();
        }
        OnMonthsIntervalStringFormatChanged(oldValue: string, newValue: string) {
            this.UpdateFormattedContent();
        }
        OnWeeksIntervalStringFormatChanged(oldValue: string, newValue: string) {
            this.UpdateFormattedContent();
        }
        OnDaysIntervalStringFormatChanged(oldValue: string, newValue: string) {
            this.UpdateFormattedContent();
        }
        OnHoursIntervalStringFormatChanged(oldValue: string, newValue: string) {
            this.UpdateFormattedContent();
        }
        OnMinutesIntervalStringFormatChanged(oldValue: string, newValue: string) {
            this.UpdateFormattedContent();
        }
        OnSecondsIntervalStringFormatChanged(oldValue: string, newValue: string) {
            this.UpdateFormattedContent();
        }
        OnMillisecondsIntervalStringFormatChanged(oldValue: string, newValue: string) {
            this.UpdateFormattedContent();
        }

        constructor() {
            super();
            this.DefaultStyleKey = (<any>this).constructor;
        }

        UpdateFormattedContent() {
            if (this.StringFormat != null)
                return super.UpdateFormattedContent();

            var par = "";
            switch (this.IntervalType) {
                case DateTimeIntervalType.Milliseconds:
                    par = this.MillisecondsIntervalStringFormat;
                    break;
                case DateTimeIntervalType.Seconds:
                    par = this.SecondsIntervalStringFormat;
                    break;
                case DateTimeIntervalType.Minutes:
                    par = this.MinutesIntervalStringFormat;
                    break;
                case DateTimeIntervalType.Hours:
                    par = this.HoursIntervalStringFormat;
                    break;
                case DateTimeIntervalType.Days:
                    par = this.DaysIntervalStringFormat;
                    break;
                case DateTimeIntervalType.Weeks:
                    par = this.WeeksIntervalStringFormat;
                    break;
                case DateTimeIntervalType.Months:
                    par = this.MonthsIntervalStringFormat;
                    break;
                case DateTimeIntervalType.Years:
                    par = this.YearsIntervalStringFormat;
                    break;
                default:
                    return super.UpdateFormattedContent();
            }

            var binding = new Data.Binding();
            binding.Converter = {
                Convert: function (value: any, targetType: IType, parameter: any, culture: any): any {
                    return Localization.Format(parameter, value);
                },
                ConvertBack: function (value: any, targetType: IType, parameter: any, culture: any): any { return value; }
            };
            binding.ConverterParameter = par || this.StringFormat || "{0}";
            this.SetBinding(AxisLabel.FormattedContentProperty, binding);
        }
    }
}