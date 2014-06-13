module Fayde.DataVis.Internal {
    export interface IValueMarginCoordinateAndOverlap {
        ValueMargin: ValueMargin;
        Coordinate: number;
        LeftOverlap: number;
        RightOverlap: number;
    }

    export class ValueMargin {
        Value: any;
        LowMargin: number;
        HighMargin: number;

        constructor(value?: any, lowMargin?: number, highMargin?: number) {
            Object.defineProperty(this, "Value", { value: value, writable: false });
            Object.defineProperty(this, "LowMargin", { value: lowMargin, writable: false });
            Object.defineProperty(this, "HighMargin", { value: highMargin, writable: false });
        }

        Equals(other: ValueMargin): boolean {
            if (!Internal.Equals(this.Value, other.Value))
                return false;
            return this.LowMargin === other.LowMargin && this.HighMargin === other.HighMargin;
        }
    }
} 