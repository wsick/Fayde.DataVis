module Fayde.DataVis {
    export class NumericAxisLabel extends AxisLabel {
        constructor() {
            super();
            this.DefaultStyleKey = (<any>this).constructor;
        }
    }
}