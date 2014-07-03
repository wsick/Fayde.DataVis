module Fayde.DataVis {
    export class CartesianSeriesPresenter extends SeriesPresenter {
        DepValueSet = new ValueSet();
        IndValueSet = new ValueSet();

        Series: CartesianSeries;
        ChartInfo: ICartesianChartInfo;

        constructor(series: CartesianSeries) {
            super(series);
        }

        OnItemAdded(item: any, index: number) {
            super.OnItemAdded(item, index);
            this.DepValueSet.Insert(item, index);
            this.IndValueSet.Insert(item, index);
        }
        OnItemRemoved(item: any, index: number) {
            super.OnItemRemoved(item, index);
            this.DepValueSet.RemoveAt(index);
            this.IndValueSet.RemoveAt(index);
        }

        OnDependentValueChanged(path: string) {
            this.DepValueSet.Walker = new Data.PropertyPathWalker(path, true, false, false);
            this.DepValueSet.Update();
        }
        OnIndependentValueChanged(path: string) {
            this.IndValueSet.Walker = new Data.PropertyPathWalker(path, true, false, false);
            this.IndValueSet.Update();
        }
    }

    export class ValueSet implements IRange<any> {
        Walker: Data.PropertyPathWalker = null;
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