module Fayde.DataVis {
    export class Series extends DependencyObject {
        static ItemsSourceProperty = DependencyProperty.Register("ItemsSource", () => IEnumerable_, Series, undefined, (d, args) => (<Series>d)._OnItemsSourceChanged(args));
        static DependentValuePathProperty = DependencyProperty.Register("DependentValuePath", () => String, Series, undefined, (d, args) => (<Series>d)._OnDependentValuePathChanged(args));
        static IndependentValuePathProperty = DependencyProperty.Register("IndependentValuePath", () => String, Series, undefined, (d, args) => (<Series>d)._OnIndependentValuePathChanged(args));
        ItemsSource: IEnumerable<any>;
        DependentValuePath: string;
        IndependentValuePath: string;

        private _OnItemsSourceChanged(args: IDependencyPropertyChangedEventArgs) {
            var oldCC = Collections.INotifyCollectionChanged_.As(args.OldValue);
            if (oldCC)
                oldCC.CollectionChanged.Unsubscribe(this._OnItemsCollectionChanged, this);
            this._OnItemsRemoved(args.OldValue, 0);
            this._OnItemsAdded(args.NewValue, 0);
            var newCC = Collections.INotifyCollectionChanged_.As(args.NewValue);
            if (newCC)
                newCC.CollectionChanged.Subscribe(this._OnItemsCollectionChanged, this);
        }
        private _OnItemsCollectionChanged(sender: any, e: Collections.CollectionChangedEventArgs) {
            this._OnItemsRemoved(e.OldItems, e.OldStartingIndex);
            this._OnItemsAdded(e.NewItems, e.NewStartingIndex);
        }
        private _OnDependentValuePathChanged(args: IDependencyPropertyChangedEventArgs) {
            this.Presenter.OnDependentValueChanged(args.OldValue);
        }
        private _OnIndependentValuePathChanged(args: IDependencyPropertyChangedEventArgs) {
            this.Presenter.OnIndependentValueChanged(args.NewValue);
        }

        private _Items: any[] = [];

        ChartInfo: IChartInfo = null;

        constructor() {
            super();
        }

        private _Presenter: SeriesPresenter = null;
        get Presenter(): SeriesPresenter {
            return this._Presenter = this._Presenter = this.CreatePresenter();
        }
        CreatePresenter(): SeriesPresenter { return new SeriesPresenter(); }

        private _OnItemsAdded(items: any[], index: number) {
            for (var i = 0, len = items ? items.length : 0; i < len; i++) {
                this.OnItemAdded(items[i], i + index);
            }
            if (!items)
                return;
            this._Items = this._Items.slice(0, index - 1)
                .concat(items)
                .concat(this._Items.slice(index));
        }
        OnItemAdded(item: any, index: number) {
            this.Presenter.OnItemAdded(item, index);
        }
        private _OnItemsRemoved(items: any[], index: number) {
            for (var i = 0, len = items ? items.length : 0; i < len; i++) {
                this.OnItemRemoved(items[i], i + index);
            }
            this._Items.splice(index, items.length);
        }
        OnItemRemoved(item: any, index: number) {
            this.Presenter.OnItemRemoved(item, index);
        }
    }
}