/// <reference path="../AxisPresenter.ts" />

module Fayde.DataVis {
    export class LinearAxisPresenter extends AxisPresenter {
        IsVertical: boolean = false;

        OnScaleUpdated(scale: IScale) {
            super.OnScaleUpdated(scale);
            this._UpdateScale();
        }

        OnSizeChanged(newSize: size) {
            this._UpdateScale();
        }

        private _UpdateScale() {
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