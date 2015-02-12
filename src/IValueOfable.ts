module Fayde.DataVis {
    export interface IValueOfable {
        valueOf(): number;
    }
    export var IValueOfable_ = new nullstone.Interface<IValueOfable>('IValueOfable');
    IValueOfable_.is = function (o: any): boolean {
        return o != null && typeof o.valueOf === "function";
    };
}