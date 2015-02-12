/// <reference path="../../SeriesPresenter.ts" />

module Fayde.DataVis {
    export class BiSeriesPresenter extends SeriesPresenter {
        private _DepValueSet = new ValueSet();
        private _IndValueSet = new ValueSet();

        Series: BiSeries;
        ChartInfo: IChartInfo;

        constructor (series: BiSeries) {
            super(series);
        }

        OnItemsAdded (items: any, index: number) {
            super.OnItemsAdded(items, index);
            var dvs = this._DepValueSet;
            var ivs = this._IndValueSet;
            for (var i = 0, len = items.length; i < len; i++) {
                dvs.Insert(items[i], i + index);
                ivs.Insert(items[i], i + index);
            }
        }

        OnItemsRemoved (items: any, index: number) {
            super.OnItemsRemoved(items, index);
            var dvs = this._DepValueSet;
            var ivs = this._IndValueSet;
            for (var i = 0, len = items.length; i < len; i++) {
                dvs.RemoveAt(i + index);
                ivs.RemoveAt(i + index);
            }
        }

        OnDependentValuePathChanged (path: string) {
            this._DepValueSet.Walker = new Data.PropertyPathWalker(path, true, false, false);
            this._DepValueSet.UpdateWalker(this.Items);
        }

        OnIndependentValuePathChanged (path: string) {
            this._IndValueSet.Walker = new Data.PropertyPathWalker(path, true, false, false);
            this._IndValueSet.UpdateWalker(this.Items);
        }

        GetIndependentValue (index: number) {
            return this._IndValueSet.Values[index];
        }

        InterpolateIndependent (axis: Axis, index: number): any {
            var vs = this._IndValueSet;
            var t = axis.Parameterizer.Parameterize(vs, vs.Values[index]);
            var i = axis.Interpolate(t);
            return i;
        }

        GetDependentValue (index: number) {
            return this._DepValueSet.Values[index];
        }

        InterpolateDependent (axis: Axis, index: number): any {
            var vs = this._DepValueSet;
            var t = axis.Parameterizer.Parameterize(vs, vs.Values[index]);
            var d = axis.Interpolate(t);
            return d;
        }
    }
}