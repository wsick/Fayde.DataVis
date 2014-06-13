module Fayde.DataVis {
    export interface IRangeConsumer {
        RangeChanged(provider: IRangeProvider, range: Internal.Range<any>);
    }
    export var IRangeConsumer_ = Fayde.RegisterInterface<IRangeConsumer>("IRangeConsumer");
    IRangeConsumer_.Is = function (o: any): boolean {
        return o.RangeChanged instanceof Function;
    };
} 