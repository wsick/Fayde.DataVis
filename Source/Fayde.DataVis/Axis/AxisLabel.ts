module Fayde.DataVis {
    export class AxisLabel extends Fayde.Controls.Control {
        static StringFormatProperty = DependencyProperty.Register("StringFormat", () => String, AxisLabel, undefined, (d, args) => (<AxisLabel>d)._OnStringFormatChanged(args));
        static FormattedContentProperty = DependencyProperty.Register("FormattedContent", () => String, AxisLabel);
        StringFormat: string;
        FormattedContent: string;

        private _OnStringFormatChanged(args: IDependencyPropertyChangedEventArgs) {
            this.UpdateFormattedContent();
        }

        constructor() {
            super();
            this.DefaultStyleKey = (<any>this).constructor;
            this.UpdateFormattedContent();
        }

        UpdateFormattedContent() {
            var dp = AxisLabel.FormattedContentProperty;
            var binding = new Data.Binding();
            binding.Converter = {
                Convert: function (value: any, targetType: IType, parameter: any, culture: any): any {
                    return Localization.Format(parameter, value);
                },
                ConvertBack: function (value: any, targetType: IType, parameter: any, culture: any): any { return value; }
            };
            binding.ConverterParameter = this.StringFormat || "{0}";
            this.SetBinding(dp, binding);
        }
    }
}