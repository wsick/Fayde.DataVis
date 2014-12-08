module Fayde.DataVis {
    export interface IScale {
        Evaluate(t: number): any;
    }
    export var IScale_ = new nullstone.Interface<any>("IScale");
    IScale_.is = function (o: any): boolean {
        return o && o.Evaluate instanceof Function;
    };
} 