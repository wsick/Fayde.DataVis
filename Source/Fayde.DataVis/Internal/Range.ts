module Fayde.DataVis.Internal {
    export class Range<T> {
        private _HasData: boolean = false;
        get HasData(): boolean { return this._HasData; }

        private _Minimum: T;
        get Minimum(): T { return this._Minimum; }

        private _Maximum: T;
        get Maximum(): T { return this._Maximum; }

        constructor(min?: T, max?: T) {
            this._Minimum = min;
            this._Maximum = max;
            this._HasData = this._Minimum != null && this._Maximum != null;
        }

        Add(other: Range<T>): Range<T> {
            if (!this.HasData)
                return other;
            if (!other.HasData)
                return this;
            return new Range<T>(other._Minimum > this._Minimum ? this._Minimum : other._Minimum,
                other._Maximum > this._Maximum ? this._Maximum : other._Maximum);
        }

        Equals(other: Range<T>): boolean {
            return this._Minimum === other._Minimum
                && this._Maximum === other._Maximum;
        }

        Contains(value: T): boolean {
            return this._Minimum <= value && value <= this._Maximum;
        }

        IntersectsWith(other: Range<T>): boolean {
            return this.Contains(other._Minimum)
                || this.Contains(other._Maximum);
        }

        Copy(): Range<T> {
            return new Range<T>(this._Minimum, this._Maximum);
        }
    }

    export function NumberRange_GetLength(range: Internal.Range<number>): number {
        if (range.HasData)
            return range.Maximum - range.Minimum;
        return 0;
    }
    export function DateTimeRange_GetLength(range: Internal.Range<DateTime>): number {
        if (range.HasData)
            return range.Maximum.Ticks - range.Minimum.Ticks;
        return 0;
    }
}