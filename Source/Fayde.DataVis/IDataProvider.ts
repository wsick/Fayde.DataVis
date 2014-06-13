module Fayde.DataVis {
    export interface IDataProvider {
        GetData(axis: IDataConsumer): IEnumerable<any>;
    }
    export var IDataProvider_ = Fayde.RegisterInterface<IDataProvider>("IDataProvider");
    IDataProvider_.Is = function (o: any): boolean {
        return o.GetData instanceof Function;
    };
} 