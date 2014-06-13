module Fayde.DataVis {
    export interface IRangeProvider {
        GetRange(rangeConsumer: IRangeConsumer): Internal.Range<any>;
    }
    export var IRangeProvider_ = Fayde.RegisterInterface<IRangeProvider>("IRangeProvider");
    IRangeProvider_.Is = function (o: any): boolean {
        return o.GetRange instanceof Function;
    };
} 