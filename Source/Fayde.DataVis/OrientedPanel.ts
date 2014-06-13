module Fayde.DataVis {
    export class OrientedPanel extends Fayde.Controls.Panel {
        static CenterCoordinateProperty = DependencyProperty.RegisterAttached("CenterCoordinate", () => Number, OrientedPanel);
        static GetCenterCoordinate(element: UIElement): number { return element.GetValue(OrientedPanel.CenterCoordinateProperty); }
        static SetCenterCoordinate(element: UIElement, value: number) { element.SetValue(OrientedPanel.CenterCoordinateProperty, value); }

        static PriorityProperty = DependencyProperty.RegisterAttached("Priority", () => Number, OrientedPanel);
        static GetPriority(element: UIElement): number { return element.GetValue(OrientedPanel.PriorityProperty); }
        static SetPriority(element: UIElement, value: number) { element.SetValue(OrientedPanel.PriorityProperty, value); }

        Orientation;
        IsInverted: boolean;
        IsReversed: boolean;
    }
}