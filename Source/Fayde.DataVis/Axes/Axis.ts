module Fayde.DataVis {
    import Control = Controls.Control;
    export class Axis extends Control {
        GetPresenter(): AxisPresenter { throw new Error("Abstract"); }
    }
}