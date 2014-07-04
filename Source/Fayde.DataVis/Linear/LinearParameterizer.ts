module Fayde.DataVis {
    export class LinearParameterizer implements IParameterizer {
        Parameterize(vs: IValueSet, item: any): number {
            var n = (item || 0).valueOf();
            return (n - vs.Min) / (vs.Max - vs.Min);
        }
    }
}