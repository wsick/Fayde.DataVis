module Fayde.DataVis {
    export class LinearScale extends DependencyObject implements IScale {
        DomainMin: number = 0;
        DomainMax: number = 1;

        RangeMin: number = 0;
        RangeMax: number = 1;

        Parameterize(item: number): number {
            var min = this.DomainMin || 0;
            var max = this.DomainMax;
            if (max == null)
                max = 1;
            return (item - min) / (max - min);
        }
        Evaluate(t: number): any {
            var min = this.RangeMin || 0;
            var max = this.RangeMax;
            if (max == null)
                max = 1;
            return t * (max - min) + min;
        }
    }
}