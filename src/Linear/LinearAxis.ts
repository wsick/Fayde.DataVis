/// <reference path="../Axis.ts" />

module Fayde.DataVis {
    export class LinearAxis extends Axis {
        get IsVertical(): boolean { return this.Presenter.IsVertical === true; }
        set IsVertical(value: boolean) { this.Presenter.IsVertical = value === true; }

        Presenter: LinearAxisPresenter;
        CreatePresenter(): LinearAxisPresenter { return new LinearAxisPresenter(); }
        Parameterizer: LinearParameterizer;
        CreateParameterizer(): LinearParameterizer { return new LinearParameterizer(); }

        constructor() {
            super();
            if (!this.Scale)
                this.Scale = new LinearScale();
        }
    }
}