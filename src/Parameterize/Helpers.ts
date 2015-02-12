module Fayde.DataVis.Parameterize {
    export function ValidMinimum (vo: IValueOfable, fallback: IValueOfable): number {
        var val = getValidValue(vo, fallback);
        return val == null ? 0 : val;
    }

    export function ValidMaximum (vo: IValueOfable, fallback: IValueOfable): number {
        var val = getValidValue(vo, fallback);
        return val == null ? 1 : val;
    }

    function getValidValue (vo: IValueOfable, fallback: IValueOfable): number {
        var val = vo.valueOf();
        if (vo == null || isNaN(val))
            return fallback == null ? null : fallback.valueOf();
        return val;
    }
}