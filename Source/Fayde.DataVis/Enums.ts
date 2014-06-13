module Fayde.DataVis {
    export enum AxisOrientation {
        None,
        X,
        Y
    }
    Fayde.RegisterEnum(AxisOrientation, "AxisOrientation");

    export enum AxisLocation {
        Auto,
        Left,
        Top,
        Right,
        Bottom
    }
    Fayde.RegisterEnum(AxisLocation, "AxisLocation");

    export enum Unit {
        Pixels,
        Degrees
    }
    Fayde.RegisterEnum(Unit, "Unit");

    export enum CategorySortOrder {
        None,
        Ascending,
        Descending
    }
    Fayde.RegisterEnum(CategorySortOrder, "CategorySortOrder");
} 