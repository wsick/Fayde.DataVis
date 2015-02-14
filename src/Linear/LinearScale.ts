module Fayde.DataVis {
    export class LinearScale implements IScale {
        RangeMin: number = 0;
        RangeMax: number = 1;

        Evaluate(t: number): any {
            var min = this.RangeMin || 0;
            var max = this.RangeMax;
            if (max == null)
                max = 1;
            return t * (max - min) + min;
        }
    }
}