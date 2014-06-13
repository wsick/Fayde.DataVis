module Fayde.DataVis {
    export interface IValueMarginProvider {
        GetValueMargins(consumer: IValueMarginConsumer): IEnumerable<Internal.ValueMargin>;
    }
    export var IValueMarginProvider_ = Fayde.RegisterInterface<IValueMarginProvider>("IValueMarginProvider");
    IValueMarginProvider_.Is = function (o: any): boolean {
        return o.GetValueMargins instanceof Function;
    };
} 