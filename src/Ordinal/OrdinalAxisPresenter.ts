/// <reference path="../AxisPresenter.ts" />

module Fayde.DataVis {
    export class OrdinalAxisPresenter extends AxisPresenter {
        IsVertical: boolean = false;

        constructor () {
            super();
            this.DefaultStyleKey = OrdinalAxisPresenter;
        }

        UpdateScale (width: number, height: number) {
            var ls = <LinearScale>this.Scale;
            if (ls instanceof LinearScale) {
                if (this.IsVertical) {
                    ls.RangeMin = height;
                    ls.RangeMax = 0;
                } else {
                    ls.RangeMin = 0;
                    ls.RangeMax = width;
                }
            }
        }
    }
}