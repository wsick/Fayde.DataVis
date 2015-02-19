declare module Fayde.DataVis {
    var Version: string;
}
declare module Fayde.DataVis {
    var Library: nullstone.ILibrary;
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
        UpdateSize(newSize: minerva.Size): void;
        private _Scale;
        Scale: IScale;
        OnScaleUpdated(scale: IScale): void;
        UpdateScale(width: number, height: number): void;
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
    interface IValueOfable {
        valueOf(): number;
    }
    var IValueOfable_: nullstone.Interface<IValueOfable>;
}
declare module Fayde.DataVis {
    interface IValueSet {
        Count: number;
        Min: IValueOfable;
        Max: IValueOfable;
        Values: IValueOfable[];
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
        Attach(chart: Chart): void;
        Detach(): void;
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
        OnAttached(): void;
        OnSizeChanged(newSize: minerva.Size): void;
        OnItemsAdded(items: any[], index: number): void;
        OnItemsRemoved(items: any[], index: number): void;
        UpdateSize(newSize: minerva.Size): void;
    }
}
interface Number extends Fayde.DataVis.IValueOfable {
}
declare module Fayde.DataVis {
    class ValueSet implements IValueSet {
        Walker: Data.PropertyPathWalker;
        Count: number;
        private _Min;
        Min: IValueOfable;
        private _Max;
        Max: IValueOfable;
        Values: IValueOfable[];
        Insert(item: IValueOfable, index: number): void;
        RemoveAt(index: number): void;
        UpdateWalker(items: IValueOfable[]): void;
        Update(): void;
    }
}
declare module Fayde.DataVis {
    interface ICartesianChartInfo extends IChartInfo {
        XAxis: Axis;
        YAxis: Axis;
    }
    class CartesianChart extends Chart {
        static XAxisProperty: DependencyProperty;
        static YAxisProperty: DependencyProperty;
        static OrientationProperty: DependencyProperty;
        XAxis: Axis;
        YAxis: Axis;
        static GetOrientation(dobj: DependencyObject): CartesianOrientation;
        static SetOrientation(dobj: DependencyObject, value: CartesianOrientation): void;
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
        constructor();
        private _OnOrientationChanged(sender, args);
        private _OnDependentValuePathChanged(args);
        private _OnIndependentValuePathChanged(args);
    }
}
declare module Fayde.DataVis {
    class BarSeries extends BiSeries {
        Presenter: BarSeriesPresenter;
        CreatePresenter(): SeriesPresenter;
        ChartInfo: ICartesianChartInfo;
    }
}
declare module Fayde.DataVis {
    class BiSeriesPresenter extends SeriesPresenter {
        DepValueSet: ValueSet;
        IndValueSet: ValueSet;
        Series: BiSeries;
        ChartInfo: IChartInfo;
        constructor(series: BiSeries);
        OnItemsAdded(items: any[], index: number): void;
        OnItemsRemoved(items: any[], index: number): void;
        OnTransposed(): void;
        OnDependentValuePathChanged(path: string): void;
        OnIndependentValuePathChanged(path: string): void;
        GetIndependentValue(index: number): IValueOfable;
        InterpolateIndependent(axis: Axis, index: number): any;
        GetDependentValue(index: number): IValueOfable;
        InterpolateDependent(axis: Axis, index: number): any;
        OnXAxisChanged(axis: Axis): void;
        OnYAxisChanged(axis: Axis): void;
    }
}
declare module Fayde.DataVis.Shapes {
    import Canvas = Fayde.Controls.Canvas;
    import Rectangle = Fayde.Shapes.Rectangle;
    class BarGroup extends Canvas {
        private _getInd;
        private _getDep;
        private _FreezeSize;
        private _BarStyle;
        private _BarSpacing;
        private _IsVertical;
        private _XAxis;
        private _YAxis;
        BarStyle: Style;
        BarSpacing: Spacing;
        IsVertical: boolean;
        XAxis: Axis;
        YAxis: Axis;
        constructor();
        Init(getInd: (axis: Axis, index: number) => number, getDep: (axis: Axis, index: number) => number): void;
        private _OnWidthChanged(sender, args);
        private _OnHeightChanged(sender, args);
        InsertMany(index: number, count?: number): void;
        RemoveManyAt(index: number, count?: number): void;
        UpdateSize(newSize: minerva.Size): void;
        Update(): void;
        private UpdateHorizontal();
        private UpdateVertical();
        UpdateBar(bar: Rectangle, left: number, top: number, width: number, height: number): void;
    }
}
declare module Fayde.DataVis {
    class BarSeriesPresenter extends BiSeriesPresenter {
        static BarStyleProperty: DependencyProperty;
        static BarSpacing: DependencyProperty;
        BarStyle: Style;
        BarSpacing: Spacing;
        private _OnBarStyleChanged(args);
        private _OnBarSpacingChanged(args);
        private _Group;
        Series: BarSeries;
        ChartInfo: ICartesianChartInfo;
        constructor(series: BarSeries);
        OnSizeChanged(newSize: minerva.Size): void;
        OnItemsAdded(items: any[], index: number): void;
        OnItemsRemoved(items: any[], index: number): void;
        OnTransposed(): void;
        OnAttached(): void;
        OnXAxisChanged(axis: Axis): void;
        OnYAxisChanged(axis: Axis): void;
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
        OnItemsAdded(items: any[], index: number): void;
        OnItemsRemoved(items: any[], index: number): void;
        GetCoordinate(index: number): Point;
        Update(): void;
    }
}
declare module Fayde.DataVis {
    class PointSeries extends BiSeries {
        Presenter: PointSeriesPresenter;
        CreatePresenter(): SeriesPresenter;
        ChartInfo: ICartesianChartInfo;
    }
}
declare module Fayde.DataVis {
    import Ellipse = Fayde.Shapes.Ellipse;
    class PointSeriesPresenter extends BiSeriesPresenter {
        static PointStyleProperty: DependencyProperty;
        PointStyle: Style;
        private _OnPointStyleChanged(args);
        Series: PointSeries;
        ChartInfo: ICartesianChartInfo;
        constructor(series: PointSeries);
        OnSizeChanged(newSize: minerva.Size): void;
        OnItemsAdded(items: any[], index: number): void;
        OnItemsRemoved(items: any[], index: number): void;
        GetCoordinate(index: number): Point;
        Update(): void;
        UpdatePoint(point: Ellipse, left: number, top: number, width: number, height: number): void;
    }
}
declare module Fayde.DataVis {
    class LinearAxis extends Axis {
        IsVertical: boolean;
        static MinimumProperty: DependencyProperty;
        static MaximumProperty: DependencyProperty;
        Minimum: IValueOfable;
        Maximum: IValueOfable;
        OnMinimumChanged(oldValue: IValueOfable, newValue: IValueOfable): void;
        OnMaximumChanged(oldValue: IValueOfable, newValue: IValueOfable): void;
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
        UpdateScale(width: number, height: number): void;
    }
}
declare module Fayde.DataVis {
    class LinearParameterizer implements IParameterizer {
        Minimum: IValueOfable;
        Maximum: IValueOfable;
        Parameterize(vs: IValueSet, index: number): number;
    }
}
declare module Fayde.DataVis {
    class LinearScale implements IScale {
        RangeMin: number;
        RangeMax: number;
        Evaluate(t: number): any;
    }
}
declare module Fayde.DataVis {
    class OrdinalAxis extends Axis {
        IsVertical: boolean;
        Presenter: OrdinalAxisPresenter;
        CreatePresenter(): OrdinalAxisPresenter;
        Parameterizer: OrdinalParameterizer;
        CreateParameterizer(): OrdinalParameterizer;
        Scale: OrdinalScale;
        constructor();
    }
}
declare module Fayde.DataVis {
    class OrdinalAxisPresenter extends AxisPresenter {
        IsVertical: boolean;
        constructor();
        UpdateScale(width: number, height: number): void;
    }
}
declare module Fayde.DataVis {
    class OrdinalParameterizer implements IParameterizer {
        Parameterize(vs: IValueSet, index: number): number;
    }
}
declare module Fayde.DataVis {
    class OrdinalScale extends LinearScale {
        GetBand(center: number, spacing: Spacing, count: number): number[];
    }
}
declare module Fayde.DataVis.Parameterize {
    function ValidMinimum(vo: IValueOfable, fallback: IValueOfable): number;
    function ValidMaximum(vo: IValueOfable, fallback: IValueOfable): number;
}
declare module Fayde.DataVis {
    interface IParameterizer {
        Parameterize(vs: IValueSet, index: number): number;
    }
    var IParameterizer_: nullstone.Interface<IParameterizer>;
}
declare module Fayde.DataVis {
    class Spacing extends DependencyObject {
        static LengthProperty: DependencyProperty;
        static TypeProperty: DependencyProperty;
        Length: number;
        Type: SpacingType;
        Evaluate(bandSize: number): number;
    }
}
declare module Fayde.DataVis {
    enum SpacingType {
        Pixel = 0,
        Percent = 1,
    }
}
