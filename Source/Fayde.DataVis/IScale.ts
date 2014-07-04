module Fayde.DataVis {
    export interface IScale {
        Evaluate(t: number): any;
    }
    export var IScale_ = Fayde.RegisterInterface<any>("IScale");
    IScale_.Is = function (o: any): boolean {
        return o && o.Evaluate instanceof Function;
    };
} 