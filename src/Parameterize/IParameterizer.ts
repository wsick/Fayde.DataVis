module Fayde.DataVis {
    export interface IParameterizer {
        Parameterize(vs: IValueSet, index: number): number;
    }
    export var IParameterizer_ = new nullstone.Interface<IParameterizer>("IParameterizer");
    IParameterizer_.is = function (o: any): boolean {
        return o && o.Parameterize instanceof Function;
    };
}