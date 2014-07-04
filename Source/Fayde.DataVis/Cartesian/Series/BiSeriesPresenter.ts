/// <reference path="../../SeriesPresenter.ts" />

module Fayde.DataVis {
    export class BiSeriesPresenter extends SeriesPresenter {
        private _DepValueSet = new ValueSet();
        private _IndValueSet = new ValueSet();

        Series: BiSeries;
        ChartInfo: IChartInfo;

        constructor(series: BiSeries) {
            super(series);
        }

        OnItemAdded(item: any, index: number) {
            super.OnItemAdded(item, index);
            this._DepValueSet.Insert(item, index);
            this._IndValueSet.Insert(item, index);
        }
        OnItemRemoved(item: any, index: number) {
            super.OnItemRemoved(item, index);
            this._DepValueSet.RemoveAt(index);
            this._IndValueSet.RemoveAt(index);
        }

        OnDependentValuePathChanged(path: string) {
            this._DepValueSet.Walker = new Data.PropertyPathWalker(path, true, false, false);
            this._DepValueSet.UpdateWalker(this.Items);
        }
        OnIndependentValuePathChanged(path: string) {
            this._IndValueSet.Walker = new Data.PropertyPathWalker(path, true, false, false);
            this._IndValueSet.UpdateWalker(this.Items);
        }
        
        GetIndependentValue(index: number) {
            return this._IndValueSet.Values[index];
        }
        GetDependentValue(index: number) {
            return this._DepValueSet.Values[index];
        }
    }

    export class ValueSet implements IRange<any> {
        Walker = new Data.PropertyPathWalker("");
        Min = null;
        Max = null;
        Values: any[] = [];

        Insert(item: any, index: number) {
            this.Values.splice(index, 0, this.Walker.GetValue(item));
            this.Update();
        }
        RemoveAt(index: number) {
            this.Values.splice(index, 1);
            this.Update();
        }
        UpdateWalker(items: any[]) {
            for (var i = 0, vals = this.Values, walker = this.Walker, len = items.length; i < len; i++) {
                vals[i] = walker.GetValue(items[i]);
            }
        }
        Update() {
            this.Min = this.Values.reduce((prev, cur) => {
                if (prev == null)
                    return cur;
                return cur < prev ? cur : prev;
            }, null);

            this.Max = this.Values.reduce((prev, cur) => {
                if (prev == null)
                    return cur;
                return cur > prev ? cur : prev;
            }, null);
        }
    }
}