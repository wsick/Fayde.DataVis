module Fayde.DataVis {
    import ObservableCollection = Fayde.Collections.ObservableCollection;
    import Control = Fayde.Controls.Control;

    export interface IAxis {
        Orientation: AxisOrientation;
        RegisteredListeners: ObservableCollection<IAxisListener>;
        DependentAxes: ObservableCollection<IAxis>;
        OrientationChanged: Fayde.RoutedPropertyChangedEvent<AxisOrientation>;
        CanPlot(value: any): boolean;
        GetPlotAreaCoordinate(value: any): UnitValue;
    }
    export interface IAxisListener {
        AxisInvalidated(axis: IAxis);
    }

    export class Axis extends Control implements IAxis {
        static LocationProperty = DependencyProperty.Register("Location", () => new Enum(AxisLocation), Axis, AxisLocation.Auto, (d, args) => (<Axis>d).OnLocationChanged(args.OldValue, args.NewValue));
        static OrientationProperty = DependencyProperty.Register("Orientation", () => new Enum(AxisOrientation), Axis, AxisOrientation.None, (d, args) => (<Axis>d).OnOrientationChanged(args.OldValue, args.NewValue));
        Location: AxisLocation;
        Orientation: AxisOrientation;

        OnLocationChanged(oldLocation: AxisLocation, newLocation: AxisLocation) {
            this.LocationChanged.Raise(this, new RoutedPropertyChangedEventArgs<AxisLocation>(oldLocation, newLocation));
        }
        OnOrientationChanged(oldOrientation: AxisOrientation, newOrientation: AxisOrientation) {
            this.OrientationChanged.Raise(this, new RoutedPropertyChangedEventArgs<AxisOrientation>(oldOrientation, newOrientation));
        }

        RegisteredListeners: ObservableCollection<IAxisListener>;
        DependentAxes: ObservableCollection<IAxis>;

        constructor() {
            super();
            this.DefaultStyleKey = (<any>this).constructor;
            Object.defineProperty(this, "RegisteredListeners", { value: new ObservableCollection<IAxisListener>(), writable: false });
            Object.defineProperty(this, "DependentAxes", { value: new ObservableCollection<IAxis>(), writable: false });
            this.RegisteredListeners.CollectionChanged.Subscribe(this._ListenersCollectionChanged, this);
            this.DependentAxes.CollectionChanged.Subscribe(this._AxesCollectionChanged, this);
        }

        LocationChanged = new RoutedPropertyChangedEvent<AxisLocation>();
        OrientationChanged = new RoutedPropertyChangedEvent<AxisOrientation>();

        OnInvalidated(args:RoutedEventArgs) {
            for (var enumerator = this.RegisteredListeners.GetEnumerator(); enumerator.MoveNext();) {
                enumerator.Current.AxisInvalidated(this);
            }
        }

        CanPlot(value: any): boolean { return false; }
        GetPlotAreaCoordinate(value: any): UnitValue { return UnitValue.NaN; }

        private _ListenersCollectionChanged(sender: any, e: Collections.CollectionChangedEventArgs) {
            if (e.OldItems) {
                for (var i = 0; i < e.OldItems.length; i++) {
                    this.OnObjectUnregistered(e.OldItems[i]);
                }
            }
            if (e.NewItems) {
                for (var i = 0; i < e.NewItems.length; i++) {
                    this.OnObjectRegistered(e.NewItems[i]);
                }
            }
        }
        OnObjectRegistered(series: IAxisListener) {
        }
        OnObjectUnregistered(series: IAxisListener) {
        }

        private _AxesCollectionChanged(sender: any, e: Collections.CollectionChangedEventArgs) {
            this.OnDependentAxesCollectionChanged();
        }
        OnDependentAxesCollectionChanged() {
        }
    }
}