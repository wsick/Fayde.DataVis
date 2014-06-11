module Fayde.DataVis {
    export class UnitValue {
        Value: number = 0;
        Unit: Unit = Unit.Pixels;

        static get NaN(): UnitValue {
            var uv = new UnitValue();
            uv.Value = NaN;
            return uv;
        }

        CompareTo(other: UnitValue): number {
            if (this.Unit !== other.Unit)
                throw new Exception("Cannot compare UnitValues with differieng Units.");
            return this.Value - other.Value;
        }

        static Compare(uv1: UnitValue, uv2: UnitValue): number {
            if (uv1 == null || uv2 == null)
                return (uv1 || { Value: 0 }).Value - (uv2 || { Value: 0 }).Value;
            return uv1.CompareTo(uv2);
        }
    }
} 