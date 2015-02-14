module Fayde.DataVis {
    export class OrdinalAxis extends Axis {
        get IsVertical(): boolean { return this.Presenter.IsVertical === true; }
        set IsVertical(value: boolean) { this.Presenter.IsVertical = value === true; }

        Presenter: OrdinalAxisPresenter;
        CreatePresenter(): OrdinalAxisPresenter { return new OrdinalAxisPresenter(); }
        Parameterizer: OrdinalParameterizer;
        CreateParameterizer(): OrdinalParameterizer { return new OrdinalParameterizer(); }

        constructor() {
            super();
            if (!this.Scale)
                this.Scale = new OrdinalScale();
        }
    }
}