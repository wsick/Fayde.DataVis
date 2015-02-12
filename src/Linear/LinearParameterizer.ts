module Fayde.DataVis {
    export class LinearParameterizer implements IParameterizer {
        Minimum: IValueOfable = null;
        Maximum: IValueOfable = null;

        Parameterize (vs: IValueSet, item: any): number {
            var n = (item || 0).valueOf();
            var min = Parameterize.ValidMinimum(this.Minimum, vs.Min);
            var max = Parameterize.ValidMaximum(this.Maximum, vs.Max);
            return (n - min) / (max - min);
        }
    }
}