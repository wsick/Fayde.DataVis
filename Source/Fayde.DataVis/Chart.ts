module Fayde.DataVis {
    import Control = Controls.Control;

    export class Chart extends Control {
        static SeriesProperty = DependencyProperty.RegisterImmutable<SeriesCollection>("Series", () => SeriesCollection, Chart);
        static AxesProperty = DependencyProperty.RegisterImmutable<AxisCollection>("Axes", () => AxisCollection, Chart);
        Series: SeriesCollection;
        Axes: AxisCollection;

        private _Presenter: ChartPresenter = null;

        constructor() {
            super();
            this.DefaultStyleKey = (<any>this).constructor;
            Chart.SeriesProperty.Initialize(this);
            Chart.AxesProperty.Initialize(this);
        }

        OnApplyTemplate() {
            super.OnApplyTemplate();

            if (this._Presenter)
                this._Presenter.Detach();
            this._Presenter = <ChartPresenter>this.GetTemplateChild("Presenter", ChartPresenter);
            if (this._Presenter)
                this._Presenter.Attach(this);
        }
    }

    Controls.TemplateParts(Chart,
        { Name: "Presenter", Type: ChartPresenter });
}