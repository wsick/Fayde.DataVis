module Fayde.DataVis {
    export interface IParameterizer {
        Parameterize(vs: IValueSet, item: any): number;
    }
    export var IParameterizer_ = Fayde.RegisterInterface<IParameterizer>("IParameterizer");
    IParameterizer_.Is = function (o: any): boolean {
        return o && o.Parameterize instanceof Function;
    };
}