module Fayde.DataVis {
    export class OrdinalParameterizer implements IParameterizer {
        Parameterize (vs: IValueSet, index: number): number {
            //Domain: [0, n - 1]
            //padding: 1 / (2 * n)
            //Range: [padding, 1 - padding]
            var padding = 1 / (2 * vs.Count);
            return index / vs.Count + padding;
        }
    }
}