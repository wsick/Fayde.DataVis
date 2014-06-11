module Fayde.DataVis {
    import ObservableCollection = Fayde.Collections.ObservableCollection;

    export interface ISeriesHost extends IRequireSeriesHost {
        Axes: ObservableCollection<IAxis>;
        Series: ObservableCollection<ISeries>;
        ForegroundElements: ObservableCollection<UIElement>;
        BackgroundElements: ObservableCollection<UIElement>;
    }
    export interface IRequireSeriesHost {
        SeriesHost: ISeriesHost;
    }
    export interface ISeries {
        LegendItems: ObservableCollection<any>;
    }
    export class Series extends Fayde.Controls.Control implements ISeries, IRequireSeriesHost {
        static TitleProperty = DependencyProperty.Register("Title", () => Object, Series, undefined, (d, args) => (<Series>d).OnTitleChanged(args.OldValue, args.NewValue));
        Title: any;

        LegendItems: ObservableCollection<any>;

        private _SeriesHost: ISeriesHost = null;
        get SeriesHost(): ISeriesHost { return this._SeriesHost; }
        set SeriesHost(value: ISeriesHost) {
            var old = this._SeriesHost;
            this._SeriesHost = value;
            if (this._SeriesHost !== old)
                this.OnSeriesHostChanged(old, this._SeriesHost);
        }
        OnSeriesHostChanged(oldValue: ISeriesHost, newValue: ISeriesHost) { }

        constructor() {
            super();
            Object.defineProperty(this, "LegendItems", { value: new ObservableCollection<any>(), writable: false });
        }

        OnTitleChanged(oldTitle: any, newTitle: any) { }
    }
}