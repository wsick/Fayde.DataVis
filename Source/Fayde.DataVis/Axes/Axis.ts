module Fayde.DataVis {
    export class Axis extends DependencyObject {
        GetPresenter(): AxisPresenter { throw new Error("Abstract"); }
    }
}