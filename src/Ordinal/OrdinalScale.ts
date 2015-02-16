module Fayde.DataVis {
    export class OrdinalScale extends LinearScale {
        GetBand (center: number, spacing: Spacing, count: number): number[] {
            var rmin = this.RangeMin || 0;
            var rmax = this.RangeMax;
            if (rmax == null) rmax = 1;
            var band = (rmax - rmin) / count;
            var padding = (!spacing) ? 0 : spacing.Evaluate(band);
            if (padding > band)
                return [center, 0];
            if (padding > 0)
                band -= padding;
            return [center - (band / 2), band];
        }
    }
}