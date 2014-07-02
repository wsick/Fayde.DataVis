module Fayde.DataVis {
    export class CartesianChart extends Chart {
        static OrientationProperty = DependencyProperty.Register("Orientation", () => new Enum(CartesianOrientation), CartesianChart, CartesianOrientation.Normal);
        static DependentAxisProperty = DependencyProperty.Register("DependentAxis", () => Axis, CartesianChart);
        static IndependentAxisProperty = DependencyProperty.Register("IndependentAxis", () => Axis, CartesianChart);
        Orientation: CartesianOrientation;
        DependentAxis: Axis;
        IndependentAxis: Axis;

        constructor() {
            super();
            this.DefaultStyleKey = (<any>this).constructor;
        }
    }
    Controls.TemplateParts(CartesianChart,
        { Name: "Presenter", Type: CartesianChartPresenter });
} 