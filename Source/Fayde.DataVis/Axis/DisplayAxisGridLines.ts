module Fayde.DataVis {
    export class DisplayAxisGridLines extends Fayde.Controls.Canvas implements IAxisListener {
        Axis: DisplayAxis;

        constructor(axis: DisplayAxis) {
            super();
            Object.defineProperty(this, "Axis", { value: axis, writable: false });
            if (this.Axis)
                this.Axis.RegisteredListeners.Add(this);
            this.SizeChanged.Subscribe(this._SizeChanged, this);
        }

        private _SizeChanged(sender: any, e: SizeChangedEventArgs) {
            this.Invalidate();
        }

        AxisInvalidated(axis: IAxis) {
            this.Invalidate();
        }

        Invalidate() { }
    }
}