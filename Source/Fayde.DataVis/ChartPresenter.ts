module Fayde.DataVis {
    import Canvas = Controls.Canvas;

    export class ChartPresenter extends Canvas {
        private _Owner: Chart = null;
        private _SeriesListener: ICollectionListener = null;
        private _AxesListener: ICollectionListener = null;

        private _SeriesPresenters: SeriesPresenter[] = [];
        private _AxisPresenters: AxisPresenter[] = [];

        constructor() {
            super();
            this.SizeChanged.Subscribe(this._OnSizeChanged, this);
        }

        Detach() {
            if (this._SeriesListener) {
                this._SeriesListener.Unlisten();
                this._SeriesListener = null;
            }
            if (this._AxesListener) {
                this._AxesListener.Unlisten();
                this._AxesListener = null;
            }

            if (this._Owner) {
                for (var en = this._Owner.Series.GetEnumerator(), i = 0; en.MoveNext(); i++) {
                    this._OnSeriesRemoved(en.Current, i);
                }
                for (var en2 = this._Owner.Axes.GetEnumerator(), i = 0; en2.MoveNext(); i++) {
                    this._OnAxisRemoved(en2.Current, i);
                }
            }

            this._Owner = null;
        }
        Attach(chart: Chart) {
            this._Owner = chart;
            if (chart) {
                for (var en2 = chart.Axes.GetEnumerator(), i = 0; en2.MoveNext(); i++) {
                    this._OnAxisAdded(en2.Current, i);
                }
                for (var en = chart.Series.GetEnumerator(), i = 0; en.MoveNext(); i++) {
                    this._OnSeriesAdded(en.Current, i);
                }

                this._SeriesListener = chart.Series.Listen((item, index) => this._OnSeriesAdded(item, index), (item, index) => this._OnSeriesRemoved(item, index));
                this._AxesListener = chart.Axes.Listen((item, index) => this._OnAxisAdded(item, index), (item, index) => this._OnAxisRemoved(item, index));
            }
        }

        private _OnSeriesAdded(series: Series, index: number) {
            var presenter = series.GetPresenter();
            this._SeriesPresenters.splice(index, 0, presenter);
            this.Children.Add(presenter);
        }
        private _OnSeriesRemoved(series: Series, index: number) {
            var presenter = this._SeriesPresenters.splice(index, 1)[0];
            this.Children.Remove(presenter);
        }
        private _OnAxisAdded(axis: Axis, index: number) {
            var presenter = axis.GetPresenter();
            this._AxisPresenters.splice(index, 0, presenter);
            this.Children.Add(presenter);
        }
        private _OnAxisRemoved(axis: Axis, index: number) {
            var presenter = this._AxisPresenters.splice(index, 1)[0];
            this.Children.Remove(presenter);
        }

        private _OnSizeChanged(sender: any, e: SizeChangedEventArgs) {
            for (var i = 0, p = <FrameworkElement[]>this._SeriesPresenters, len = p.length; i < len; i++) {
                var fe = p[i];
                fe.Width = e.NewSize.Width;
                fe.Height = e.NewSize.Height;
            }
            for (var i = 0, p = <FrameworkElement[]>this._AxisPresenters, len = p.length; i < len; i++) {
                var fe = p[i];
                fe.Width = e.NewSize.Width;
                fe.Height = e.NewSize.Height;
            }
        }
    }
}