/// <reference path="../../SeriesPresenter.ts" />

module Fayde.DataVis {
    export class BiSeriesPresenter extends SeriesPresenter {
        DepValueSet = new ValueSet();
        IndValueSet = new ValueSet();

        Series: BiSeries;
        ChartInfo: IChartInfo;

        constructor (series: BiSeries) {
            super(series);
            this.OnTransposed();
        }

        OnItemsAdded (items: any, index: number) {
            super.OnItemsAdded(items, index);
            var dvs = this.DepValueSet;
            var ivs = this.IndValueSet;
            for (var i = 0, len = items.length; i < len; i++) {
                dvs.Insert(items[i], i + index);
                ivs.Insert(items[i], i + index);
            }
        }

        OnItemsRemoved (items: any, index: number) {
            super.OnItemsRemoved(items, index);
            var dvs = this.DepValueSet;
            var ivs = this.IndValueSet;
            for (var i = 0, len = items.length; i < len; i++) {
                dvs.RemoveAt(i + index);
                ivs.RemoveAt(i + index);
            }
        }

        OnTransposed () {
        }

        OnDependentValuePathChanged (path: string) {
            this.DepValueSet.Walker = new Data.PropertyPathWalker(path, true, false, false);
            this.DepValueSet.UpdateWalker(this.Items);
        }

        OnIndependentValuePathChanged (path: string) {
            this.IndValueSet.Walker = new Data.PropertyPathWalker(path, true, false, false);
            this.IndValueSet.UpdateWalker(this.Items);
        }

        GetIndependentValue (index: number) {
            return this.IndValueSet.Values[index];
        }

        InterpolateIndependent (axis: Axis, index: number): any {
            var vs = this.IndValueSet;
            var t = axis.Parameterizer.Parameterize(vs, index);
            var i = axis.Interpolate(t);
            return i;
        }

        GetDependentValue (index: number) {
            return this.DepValueSet.Values[index];
        }

        InterpolateDependent (axis: Axis, index: number): any {
            var vs = this.DepValueSet;
            var t = axis.Parameterizer.Parameterize(vs, index);
            var d = axis.Interpolate(t);
            return d;
        }
    }
}