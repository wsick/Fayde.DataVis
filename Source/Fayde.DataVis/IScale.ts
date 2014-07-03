module Fayde.DataVis {
    export interface IScale {
        Map(item: any, domain: IRange<any>): any;
    }
    export var IScale_ = Fayde.RegisterInterface<IScale>("IScale");
} 