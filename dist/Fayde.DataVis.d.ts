declare module Fayde.DataVis {
    var Version: string;
}
declare module Fayde.DataVis {
    class Axis extends DependencyObject {
        static ScaleProperty: DependencyProperty;
        Scale: IScale;
        private _OnScaleChanged(args);
        private _Presenter;
        Presenter: AxisPresenter;
        CreatePresenter(): AxisPresenter;
        private _Parameterizer;
        Parameterizer: IParameterizer;
        CreateParameterizer(): IParameterizer;
        Interpolate(t: number): any;
        ScaleUpdated: nullstone.Event<{}>;
        OnScaleUpdated(): void;
    }
}
declare module Fayde.DataVis {
    import Canvas = Controls.Canvas;
    class AxisPresenter extends Canvas implements IPresenter {
        constructor();
        private _OnSizeChanged(sender, e);
        OnSizeChanged(newSize: minerva.Size): void;
        UpdateSize(newSize: minerva.Size): void;
        private _Scale;
        Scale: IScale;
        OnScaleUpdated(scale: IScale): void;
        UpdateScale(): void;
    }
}
declare module Fayde.DataVis {
    import Control = Controls.Control;
    interface IChartInfo {
    }
    class Chart extends Control {
        static SeriesProperty: ImmutableDependencyProperty<SeriesCollection>;
        Series: SeriesCollection;
        private _Presenter;
        private _ChartInfo;
        ChartInfo: IChartInfo;
        private _SeriesListener;
        constructor();
        OnApplyTemplate(): void;
    }
}
declare module Fayde.DataVis {
    import Canvas = Controls.Canvas;
    class ChartPresenter extends Canvas {
        Owner: Chart;
        private _SeriesListener;
        private _SeriesPresenters;
        ChartInfo: IChartInfo;
        constructor();
        Detach(): void;
        Attach(chart: Chart): void;
        private _OnSeriesAdded(series, index);
        private _OnSeriesRemoved(series, index);
        OnSizeChanged(sender: any, e: SizeChangedEventArgs): void;
    }
}
declare module Fayde.DataVis {
    enum CartesianOrientation {
        Normal = 0,
        Transposed = 1,
    }
}
declare module Fayde.DataVis {
    interface IParameterizer {
        Parameterize(vs: IValueSet, item: any): number;
    }
    var IParameterizer_: nullstone.Interface<IParameterizer>;
}
declare module Fayde.DataVis {
    interface IPresenter {
        UpdateSize(newSize: minerva.Size): any;
    }
}
declare module Fayde.DataVis {
    interface IRange<T> {
        Min: T;
        Max: T;
    }
}
declare module Fayde.DataVis {
    interface IScale {
        Evaluate(t: number): any;
    }
    var IScale_: nullstone.Interface<any>;
}
declare module Fayde.DataVis {
    interface IValueSet {
        Count: number;
        Min: any;
        Max: any;
        Values: any[];
    }
}
declare module Fayde.DataVis {
    class Series extends DependencyObject {
        static ItemsSourceProperty: DependencyProperty;
        ItemsSource: nullstone.IEnumerable<any>;
        private _OnItemsSourceChanged(args);
        private _OnItemsCollectionChanged(sender, e);
        ChartInfo: IChartInfo;
        constructor();
        private _Presenter;
        Presenter: SeriesPresenter;
        CreatePresenter(): SeriesPresenter;
        private _OnItemsAdded(items, index);
        private _OnItemsRemoved(items, index);
    }
}
declare module Fayde.DataVis.Internal {
    class ListenCollection<T extends XamlObject> extends XamlObjectCollection<T> {
        private _Listeners;
        Listen(onItemAdded: (item: T, index?: number) => void, onItemRemoved: (item: T, index?: number) => void): ICollectionListener;
        _RaiseItemAdded(value: T, index: number): void;
        _RaiseItemRemoved(value: T, index: number): void;
        _RaiseItemReplaced(removed: T, added: T, index: number): void;
        _RaiseCleared(old: T[]): void;
        private _NotifyAdded(item, index);
        private _NotifyRemoved(item, index);
    }
    interface ICollectionListener {
        Unlisten(): any;
    }
}
declare module Fayde.DataVis {
    class SeriesCollection extends Internal.ListenCollection<Series> {
    }
}
declare module Fayde.DataVis {
    import Canvas = Controls.Canvas;
    class SeriesPresenter extends Canvas implements IPresenter {
        private _Series;
        Series: Series;
        ChartInfo: IChartInfo;
        private _Items;
        Items: any[];
        constructor(series: Series);
        private _OnSizeChanged(sender, e);
        OnSizeChanged(newSize: minerva.Size): void;
        OnItemsAdded(items: any, index: number): void;
        OnItemsRemoved(items: any, index: number): void;
        UpdateSize(newSize: minerva.Size): void;
    }
}
declare module Fayde.DataVis {
    class ValueSet implements IValueSet {
        Walker: Data.PropertyPathWalker;
        Count: number;
        private _Min;
        Min: any;
        private _Max;
        Max: any;
        Values: any[];
        Insert(item: any, index: number): void;
        RemoveAt(index: number): void;
        UpdateWalker(items: any[]): void;
        Update(): void;
    }
}
declare module Fayde.DataVis {
    var Library: nullstone.ILibrary;
}
declare module Fayde.DataVis {
    interface ICartesianChartInfo extends IChartInfo {
        Orientation: CartesianOrientation;
        XAxis: Axis;
        YAxis: Axis;
    }
    class CartesianChart extends Chart {
        static OrientationProperty: DependencyProperty;
        static XAxisProperty: DependencyProperty;
        static YAxisProperty: DependencyProperty;
        Orientation: CartesianOrientation;
        XAxis: Axis;
        YAxis: Axis;
        private _OnOrientationChanged(args);
        private _OnXAxisChanged(args);
        private _OnYAxisChanged(args);
        ChartInfo: ICartesianChartInfo;
        constructor();
    }
}
declare module Fayde.DataVis {
    class CartesianChartPresenter extends ChartPresenter {
        Owner: CartesianChart;
        private _yap;
        private _YListener;
        private _xap;
        private _XListener;
        Detach(): void;
        Attach(chart: CartesianChart): void;
        private _OnYChanged(axis);
        private _OnXChanged(axis);
        OnSizeChanged(sender: any, e: SizeChangedEventArgs): void;
    }
}
declare module Fayde.DataVis {
    class BiSeries extends Series {
        static DependentValuePathProperty: DependencyProperty;
        static IndependentValuePathProperty: DependencyProperty;
        DependentValuePath: string;
        IndependentValuePath: string;
        Presenter: BiSeriesPresenter;
        CreatePresenter(): SeriesPresenter;
        private _OnDependentValuePathChanged(args);
        private _OnIndependentValuePathChanged(args);
    }
}
declare module Fayde.DataVis {
    class BiSeriesPresenter extends SeriesPresenter {
        private _DepValueSet;
        private _IndValueSet;
        Series: BiSeries;
        ChartInfo: IChartInfo;
        constructor(series: BiSeries);
        OnItemsAdded(items: any, index: number): void;
        OnItemsRemoved(items: any, index: number): void;
        OnDependentValuePathChanged(path: string): void;
        OnIndependentValuePathChanged(path: string): void;
        GetIndependentValue(index: number): any;
        InterpolateIndependent(axis: Axis, index: number): any;
        GetDependentValue(index: number): any;
        InterpolateDependent(axis: Axis, index: number): any;
    }
}
declare module Fayde.DataVis {
    class LineSeries extends BiSeries {
        Presenter: LineSeriesPresenter;
        CreatePresenter(): SeriesPresenter;
        ChartInfo: ICartesianChartInfo;
    }
}
declare module Fayde.DataVis {
    class LineSeriesPresenter extends BiSeriesPresenter {
        static LineStyleProperty: DependencyProperty;
        LineStyle: Style;
        private _OnLineStyleChanged(args);
        private _Line;
        Series: LineSeries;
        ChartInfo: ICartesianChartInfo;
        constructor(series: LineSeries);
        OnSizeChanged(newSize: minerva.Size): void;
        OnItemsAdded(items: any, index: number): void;
        OnItemsRemoved(items: any, index: number): void;
        GetCoordinate(index: number): Point;
        Update(): void;
    }
}
declare module Fayde.DataVis {
    class LinearAxis extends Axis {
        static MinimumProperty: DependencyProperty;
        static MaximumProperty: DependencyProperty;
        Minimum: number;
        Maximum: number;
        OnMinimumChanged(oldValue: number, newValue: number): void;
        OnMaximumChanged(oldValue: number, newValue: number): void;
        IsVertical: boolean;
        Presenter: LinearAxisPresenter;
        CreatePresenter(): LinearAxisPresenter;
        Parameterizer: LinearParameterizer;
        CreateParameterizer(): LinearParameterizer;
        constructor();
    }
}
declare module Fayde.DataVis {
    class LinearAxisPresenter extends AxisPresenter {
        IsVertical: boolean;
        constructor();
        UpdateScale(): void;
    }
}
declare module Fayde.DataVis {
    class LinearParameterizer implements IParameterizer {
        Minimum: number;
        Maximum: number;
        Parameterize(vs: IValueSet, item: any): number;
    }
}
declare module Fayde.DataVis {
    class LinearScale extends DependencyObject implements IScale {
        RangeMin: number;
        RangeMax: number;
        Evaluate(t: number): any;
    }
}
