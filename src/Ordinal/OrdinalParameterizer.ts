module Fayde.DataVis {
    export class OrdinalParameterizer implements IParameterizer {
        Parameterize (vs: IValueSet, index: number): number {
            //Domain: [0, n - 1]
            //padding: 1 / (2 * n)
            //Range: [padding, 1 - padding]
            return (index + 0.5) / vs.Count;
        }
    }
}