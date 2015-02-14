/// <reference path="../AxisPresenter.ts" />

module Fayde.DataVis {
    export class LinearAxisPresenter extends AxisPresenter {
        IsVertical: boolean = false;

        constructor() {
            super();
            this.DefaultStyleKey = LinearAxisPresenter;
        }

        UpdateScale (width: number, height: number) {
            var ls = <LinearScale>this.Scale;
            if (ls instanceof LinearScale) {
                if (this.IsVertical) {
                    ls.RangeMin = 0;
                    ls.RangeMax = height;
                } else {
                    ls.RangeMin = 0;
                    ls.RangeMax = width;
                }
            }
        }
    }
} 