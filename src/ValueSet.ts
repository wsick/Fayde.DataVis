module Fayde.DataVis {
    export class ValueSet implements IValueSet {
        Walker = new Data.PropertyPathWalker("");

        get Count(): number { return this.Values.length; }

        private _Min = null;
        get Min(): any { return this._Min; }

        private _Max = null;
        get Max(): any { return this._Max }

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
            this._Min = this.Values.reduce((prev, cur) => {
                if (prev == null)
                    return cur;
                return cur < prev ? cur : prev;
            }, null);

            this._Max = this.Values.reduce((prev, cur) => {
                if (prev == null)
                    return cur;
                return cur > prev ? cur : prev;
            }, null);
        }
    }
} 