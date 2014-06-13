module Fayde.DataVis {
    export interface IValueMarginConsumer {
        ValueMarginsChanged(provider: IValueMarginProvider, valueMargins: IEnumerable<Internal.ValueMargin>);
    }
    export var IValueMarginConsumer_ = Fayde.RegisterInterface<IValueMarginConsumer>("IValueMarginConsumer");
    IValueMarginConsumer_.Is = function (o: any): boolean {
        return o.ValueMarginsChanged instanceof Function;
    };
}