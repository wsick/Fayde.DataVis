module Fayde.DataVis {
    import Control = Controls.Control;

    export class LinearAxis extends Control {
        static IsHorizontalProperty = DependencyProperty.Register("IsHorizontal", () => Boolean, LinearAxis);
        IsHorizontal: boolean;
    }
} 