/// <reference path="../AxisPresenter.ts" />

module Fayde.DataVis {
    export class LinearAxisPresenter extends AxisPresenter {
        IsVertical: boolean = false;

        constructor() {
            super();
            this.DefaultStyleKey = LinearAxisPresenter;
        }

        UpdateScale() {
            var ls = <LinearScale>this.Scale;
            if (ls instanceof LinearScale) {
                if (this.IsVertical) {
                    ls.RangeMin = this.ActualHeight;
                    ls.RangeMax = 0;
                } else {
                    ls.RangeMin = 0;
                    ls.RangeMax = this.ActualWidth;
                }
            }
        }
    }
}