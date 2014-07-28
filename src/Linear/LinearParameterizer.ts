module Fayde.DataVis {
    export class LinearParameterizer implements IParameterizer {
        Minimum: number = null;
        Maximum: number = null;
        Parameterize(vs: IValueSet, item: any): number {
            var n = (item || 0).valueOf();
            var min = this.Minimum;
            if (min == null || isNaN(min))
                min = vs.Min;
            var max = this.Maximum;
            if (max == null || isNaN(max))
                max = vs.Max;
            return (n - min) / (max - min);
        }
    }
}