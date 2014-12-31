﻿module Fayde.DataVis {
    export class Series extends DependencyObject {
        static ItemsSourceProperty = DependencyProperty.Register("ItemsSource", () => nullstone.IEnumerable_, Series, undefined, (d, args) => (<Series>d)._OnItemsSourceChanged(args));
        ItemsSource: nullstone.IEnumerable<any>;

        private _OnItemsSourceChanged(args: IDependencyPropertyChangedEventArgs) {
            var oldCC = Collections.INotifyCollectionChanged_.as(args.OldValue);
            if (oldCC)
                oldCC.CollectionChanged.off(this._OnItemsCollectionChanged, this);
            this._OnItemsRemoved(args.OldValue, 0);
            this._OnItemsAdded(args.NewValue, 0);
            var newCC = Collections.INotifyCollectionChanged_.as(args.NewValue);
            if (newCC)
                newCC.CollectionChanged.on(this._OnItemsCollectionChanged, this);
        }
        private _OnItemsCollectionChanged(sender: any, e: Collections.CollectionChangedEventArgs) {
            this._OnItemsRemoved(e.OldItems, e.OldStartingIndex);
            this._OnItemsAdded(e.NewItems, e.NewStartingIndex);
        }

        ChartInfo: IChartInfo = null;

        constructor() {
            super();
        }

        private _Presenter: SeriesPresenter = null;
        get Presenter(): SeriesPresenter {
            return this._Presenter = this._Presenter || this.CreatePresenter();
        }
        CreatePresenter(): SeriesPresenter { return new SeriesPresenter(this); }

        private _OnItemsAdded(items: any[], index: number) {
            if (items)
                this.Presenter.OnItemsAdded(items, index);
        }
        private _OnItemsRemoved(items: any[], index: number) {
            if (items)
                this.Presenter.OnItemsRemoved(items, index);
        }
    }
}