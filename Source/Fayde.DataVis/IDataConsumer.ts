module Fayde.DataVis {
    export interface IDataConsumer {
        DataChanged(dataProvider: IDataProvider, data: IEnumerable<any>);
    }
    export var IDataConsumer_ = Fayde.RegisterInterface<IDataConsumer>("IDataConsumer");
    IDataConsumer_.Is = function (o: any): boolean {
        return o.DataChanged instanceof Function;
    };
} 