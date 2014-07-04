module Fayde.DataVis {
    export interface IScale {
        Parameterize(item: any): number;
        Evaluate(t: number): any;
    }
    export var IScale_ = Fayde.RegisterInterface<any>("IScale");
} 