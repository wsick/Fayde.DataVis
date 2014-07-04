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
        InterpolateIndependent(axis: Axis, index: number) {
            var vs = this._IndValueSet;
            var t = axis.Parameterizer.Parameterize(vs, vs.Values[index]);
            return axis.Interpolate(t);
        }
        GetDependentValue(index: number) {
            return this._DepValueSet.Values[index];
        }
        InterpolateDependent(axis: Axis, index: number) {
            var vs = this._DepValueSet;
            var t = axis.Parameterizer.Parameterize(vs, vs.Values[index]);
            return axis.Interpolate(t);
        }
    }
}