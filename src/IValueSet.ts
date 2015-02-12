module Fayde.DataVis {
    export interface IValueSet {
        Count: number;
        Min: IValueOfable;
        Max: IValueOfable;
        Values: IValueOfable[];
    }
} 