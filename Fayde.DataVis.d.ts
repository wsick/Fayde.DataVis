declare module Fayde.DataVis {
    var Version: string;
}
declare module Fayde.DataVis {
    class Axis extends DependencyObject {
        static ScaleProperty: DependencyProperty;
        public Scale: IScale;
        private _OnScaleChanged(args);
        private _Presenter;
        public Presenter : AxisPresenter;
        public CreatePresenter(): AxisPresenter;
        private _Parameterizer;
        public Parameterizer : IParameterizer;
        public CreateParameterizer(): IParameterizer;
        public Interpolate(t: number): any;
        public ScaleUpdated: MulticastEvent<EventArgs>;
        public OnScaleUpdated(): void;
    }
}
declare module Fayde.DataVis {
    class AxisPresenter extends Canvas implements IPresenter {
        constructor();
        private _OnSizeChanged(sender, e);
        public OnSizeChanged(newSize: size): void;
        public UpdateSize(newSize: size): void;
        private _Scale;
        public Scale : IScale;
        public OnScaleUpdated(scale: IScale): void;
        public UpdateScale(): void;
    }
}
declare module Fayde.DataVis {
    interface IChartInfo {
    }
    class Chart extends Controls.Control {
        static SeriesProperty: ImmutableDependencyProperty<SeriesCollection>;
        public Series: SeriesCollection;
        private _Presenter;
        private _ChartInfo;
        public ChartInfo : IChartInfo;
        private _SeriesListener;
        constructor();
        public OnApplyTemplate(): void;
    }
}
declare module Fayde.DataVis {
    class ChartPresenter extends Canvas {
        public Owner: Chart;
        private _SeriesListener;
        private _SeriesPresenters;
        public ChartInfo : IChartInfo;
        constructor();
        public Detach(): void;
        public Attach(chart: Chart): void;
        private _OnSeriesAdded(series, index);
        private _OnSeriesRemoved(series, index);
        public OnSizeChanged(sender: any, e: SizeChangedEventArgs): void;
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
    var IParameterizer_: IInterfaceDeclaration<IParameterizer>;
}
declare module Fayde.DataVis {
    interface IPresenter {
        UpdateSize(newSize: size): any;
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
    var IScale_: IInterfaceDeclaration<any>;
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
        public ItemsSource: IEnumerable<any>;
        private _OnItemsSourceChanged(args);
        private _OnItemsCollectionChanged(sender, e);
        public ChartInfo: IChartInfo;
        constructor();
        private _Presenter;
        public Presenter : SeriesPresenter;
        public CreatePresenter(): SeriesPresenter;
        private _OnItemsAdded(items, index);
        private _OnItemsRemoved(items, index);
    }
}
declare module Fayde.DataVis.Internal {
    class ListenCollection<T extends XamlObject> extends XamlObjectCollection<T> {
        private _Listeners;
        public Listen(onItemAdded: (item: T, index?: number) => void, onItemRemoved: (item: T, index?: number) => void): ICollectionListener;
        public _RaiseItemAdded(value: T, index: number): void;
        public _RaiseItemRemoved(value: T, index: number): void;
        public _RaiseItemReplaced(removed: T, added: T, index: number): void;
        public _RaiseCleared(old: T[]): void;
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
    class SeriesPresenter extends Canvas implements IPresenter {
        private _Series;
        public Series : Series;
        public ChartInfo : IChartInfo;
        private _Items;
        public Items : any[];
        constructor(series: Series);
        private _OnSizeChanged(sender, e);
        public OnSizeChanged(newSize: size): void;
        public OnItemsAdded(items: any, index: number): void;
        public OnItemsRemoved(items: any, index: number): void;
        public UpdateSize(newSize: size): void;
    }
}
declare module Fayde.DataVis {
    class ValueSet implements IValueSet {
        public Walker: Data.PropertyPathWalker;
        public Count : number;
        private _Min;
        public Min : any;
        private _Max;
        public Max : any;
        public Values: any[];
        public Insert(item: any, index: number): void;
        public RemoveAt(index: number): void;
        public UpdateWalker(items: any[]): void;
        public Update(): void;
    }
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
        public Orientation: CartesianOrientation;
        public XAxis: Axis;
        public YAxis: Axis;
        private _OnOrientationChanged(args);
        private _OnXAxisChanged(args);
        private _OnYAxisChanged(args);
        public ChartInfo: ICartesianChartInfo;
        constructor();
    }
}
declare module Fayde.DataVis {
    class CartesianChartPresenter extends ChartPresenter {
        public Owner: CartesianChart;
        private _yap;
        private _YListener;
        private _xap;
        private _XListener;
        public Detach(): void;
        public Attach(chart: CartesianChart): void;
        private _OnYChanged(axis);
        private _OnXChanged(axis);
        public OnSizeChanged(sender: any, e: SizeChangedEventArgs): void;
    }
}
declare module Fayde.DataVis {
    class BiSeries extends Series {
        static DependentValuePathProperty: DependencyProperty;
        static IndependentValuePathProperty: DependencyProperty;
        public DependentValuePath: string;
        public IndependentValuePath: string;
        public Presenter: BiSeriesPresenter;
        public CreatePresenter(): SeriesPresenter;
        private _OnDependentValuePathChanged(args);
        private _OnIndependentValuePathChanged(args);
    }
}
declare module Fayde.DataVis {
    class BiSeriesPresenter extends SeriesPresenter {
        private _DepValueSet;
        private _IndValueSet;
        public Series: BiSeries;
        public ChartInfo: IChartInfo;
        constructor(series: BiSeries);
        public OnItemsAdded(items: any, index: number): void;
        public OnItemsRemoved(items: any, index: number): void;
        public OnDependentValuePathChanged(path: string): void;
        public OnIndependentValuePathChanged(path: string): void;
        public GetIndependentValue(index: number): any;
        public InterpolateIndependent(axis: Axis, index: number): any;
        public GetDependentValue(index: number): any;
        public InterpolateDependent(axis: Axis, index: number): any;
    }
}
declare module Fayde.DataVis {
    class LineSeries extends BiSeries {
        public Presenter: LineSeriesPresenter;
        public CreatePresenter(): SeriesPresenter;
        public ChartInfo: ICartesianChartInfo;
    }
}
declare module Fayde.DataVis {
    class LineSeriesPresenter extends BiSeriesPresenter {
        static LineStyleProperty: DependencyProperty;
        public LineStyle: Style;
        private _OnLineStyleChanged(args);
        private _Line;
        public Series: LineSeries;
        public ChartInfo: ICartesianChartInfo;
        constructor(series: LineSeries);
        public OnSizeChanged(newSize: size): void;
        public OnItemsAdded(items: any, index: number): void;
        public OnItemsRemoved(items: any, index: number): void;
        public GetCoordinate(index: number): Point;
        public Update(): void;
    }
}
declare module Fayde.DataVis {
    class LinearAxis extends Axis {
        static MinimumProperty: DependencyProperty;
        static MaximumProperty: DependencyProperty;
        public Minimum: number;
        public Maximum: number;
        public OnMinimumChanged(oldValue: number, newValue: number): void;
        public OnMaximumChanged(oldValue: number, newValue: number): void;
        public IsVertical : boolean;
        public Presenter: LinearAxisPresenter;
        public CreatePresenter(): LinearAxisPresenter;
        public Parameterizer: LinearParameterizer;
        public CreateParameterizer(): LinearParameterizer;
        constructor();
    }
}
declare module Fayde.DataVis {
    class LinearAxisPresenter extends AxisPresenter {
        public IsVertical: boolean;
        constructor();
        public UpdateScale(): void;
    }
}
declare module Fayde.DataVis {
    class LinearParameterizer implements IParameterizer {
        public Minimum: number;
        public Maximum: number;
        public Parameterize(vs: IValueSet, item: any): number;
    }
}
declare module Fayde.DataVis {
    class LinearScale extends DependencyObject implements IScale {
        public RangeMin: number;
        public RangeMax: number;
        public Evaluate(t: number): any;
    }
}
