var Fayde;
(function (Fayde) {
    var DataVis;
    (function (DataVis) {
        DataVis.Version = '0.3.1';
    })(DataVis = Fayde.DataVis || (Fayde.DataVis = {}));
})(Fayde || (Fayde = {}));
var Fayde;
(function (Fayde) {
    var DataVis;
    (function (DataVis) {
        DataVis.Library = Fayde.TypeManager.resolveLibrary("lib://fayde.datavis");
    })(DataVis = Fayde.DataVis || (Fayde.DataVis = {}));
})(Fayde || (Fayde = {}));
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Fayde;
(function (Fayde) {
    var DataVis;
    (function (DataVis) {
        var Axis = (function (_super) {
            __extends(Axis, _super);
            function Axis() {
                _super.apply(this, arguments);
                this.ScaleUpdated = new nullstone.Event();
            }
            Axis.prototype._OnScaleChanged = function (args) {
                this.OnScaleUpdated();
            };
            Object.defineProperty(Axis.prototype, "Presenter", {
                get: function () {
                    return this._Presenter = this._Presenter || this.CreatePresenter();
                },
                enumerable: true,
                configurable: true
            });
            Axis.prototype.CreatePresenter = function () {
                throw new Error("Abstract");
            };
            Object.defineProperty(Axis.prototype, "Parameterizer", {
                get: function () {
                    return this._Parameterizer = this._Parameterizer || this.CreateParameterizer();
                },
                enumerable: true,
                configurable: true
            });
            Axis.prototype.CreateParameterizer = function () {
                throw new Error("Abstract");
            };
            Axis.prototype.Interpolate = function (t) {
                var scale = this.Scale;
                if (!scale)
                    return t;
                return scale.Evaluate(t);
            };
            Axis.prototype.OnScaleUpdated = function () {
                this.ScaleUpdated.raise(this, null);
                this.Presenter.OnScaleUpdated(this.Scale);
            };
            Axis.ScaleProperty = DependencyProperty.Register("Scale", function () { return DataVis.IScale_; }, Axis, undefined, function (d, args) { return d._OnScaleChanged(args); });
            return Axis;
        })(Fayde.DependencyObject);
        DataVis.Axis = Axis;
    })(DataVis = Fayde.DataVis || (Fayde.DataVis = {}));
})(Fayde || (Fayde = {}));
var Fayde;
(function (Fayde) {
    var DataVis;
    (function (DataVis) {
        var Canvas = Fayde.Controls.Canvas;
        var AxisPresenter = (function (_super) {
            __extends(AxisPresenter, _super);
            function AxisPresenter() {
                _super.apply(this, arguments);
                this._Scale = null;
            }
            AxisPresenter.prototype.UpdateSize = function (newSize) {
                this.Width = newSize.width;
                this.Height = newSize.height;
                this.UpdateScale(newSize.width, newSize.height);
            };
            Object.defineProperty(AxisPresenter.prototype, "Scale", {
                get: function () {
                    return this._Scale;
                },
                enumerable: true,
                configurable: true
            });
            AxisPresenter.prototype.OnScaleUpdated = function (scale) {
                this._Scale = scale;
                this.UpdateScale(this.Width, this.Height);
            };
            AxisPresenter.prototype.UpdateScale = function (width, height) {
            };
            return AxisPresenter;
        })(Canvas);
        DataVis.AxisPresenter = AxisPresenter;
    })(DataVis = Fayde.DataVis || (Fayde.DataVis = {}));
})(Fayde || (Fayde = {}));
var Fayde;
(function (Fayde) {
    var DataVis;
    (function (DataVis) {
        var Control = Fayde.Controls.Control;
        var Chart = (function (_super) {
            __extends(Chart, _super);
            function Chart() {
                var _this = this;
                _super.call(this);
                this._Presenter = null;
                this._ChartInfo = {};
                this._SeriesListener = null;
                this.DefaultStyleKey = Chart;
                var series = Chart.SeriesProperty.Initialize(this);
                series.AttachTo(this);
                this._SeriesListener = series.Listen(function (series, index) { return series.Attach(_this); }, function (series, index) { return series.Detach(); });
            }
            Object.defineProperty(Chart.prototype, "ChartInfo", {
                get: function () {
                    return this._ChartInfo;
                },
                enumerable: true,
                configurable: true
            });
            Chart.prototype.OnApplyTemplate = function () {
                _super.prototype.OnApplyTemplate.call(this);
                if (this._Presenter)
                    this._Presenter.Detach();
                this._Presenter = this.GetTemplateChild("Presenter", DataVis.ChartPresenter);
                if (this._Presenter)
                    this._Presenter.Attach(this);
            };
            Chart.SeriesProperty = DependencyProperty.RegisterImmutable("Series", function () { return DataVis.SeriesCollection; }, Chart);
            return Chart;
        })(Control);
        DataVis.Chart = Chart;
        Fayde.Markup.Content(Chart, Chart.SeriesProperty);
        Fayde.Controls.TemplateParts(Chart, { Name: "Presenter", Type: DataVis.ChartPresenter });
    })(DataVis = Fayde.DataVis || (Fayde.DataVis = {}));
})(Fayde || (Fayde = {}));
var Fayde;
(function (Fayde) {
    var DataVis;
    (function (DataVis) {
        var Canvas = Fayde.Controls.Canvas;
        var ChartPresenter = (function (_super) {
            __extends(ChartPresenter, _super);
            function ChartPresenter() {
                _super.call(this);
                this.Owner = null;
                this._SeriesListener = null;
                this._SeriesPresenters = [];
                this.SizeChanged.on(this.OnSizeChanged, this);
            }
            Object.defineProperty(ChartPresenter.prototype, "ChartInfo", {
                get: function () {
                    return this.Owner ? this.Owner.ChartInfo : null;
                },
                enumerable: true,
                configurable: true
            });
            ChartPresenter.prototype.Detach = function () {
                if (this._SeriesListener) {
                    this._SeriesListener.Unlisten();
                    this._SeriesListener = null;
                }
                if (this.Owner) {
                    var arr = this.Owner.Series.ToArray();
                    for (var arr = this.Owner.Series.ToArray(), i = arr.length - 1; i >= 0; i--) {
                        this._OnSeriesRemoved(arr[i], i);
                    }
                }
                this.Owner = null;
            };
            ChartPresenter.prototype.Attach = function (chart) {
                var _this = this;
                this.Owner = chart;
                if (chart) {
                    for (var en = chart.Series.getEnumerator(), i = 0; en.moveNext(); i++) {
                        this._OnSeriesAdded(en.current, i);
                    }
                    this._SeriesListener = chart.Series.Listen(function (item, index) { return _this._OnSeriesAdded(item, index); }, function (item, index) { return _this._OnSeriesRemoved(item, index); });
                }
            };
            ChartPresenter.prototype._OnSeriesAdded = function (series, index) {
                series.ChartInfo = this.ChartInfo;
                var presenter = series.Presenter;
                this._SeriesPresenters.splice(index, 0, presenter);
                this.Children.Add(presenter);
            };
            ChartPresenter.prototype._OnSeriesRemoved = function (series, index) {
                series.ChartInfo = null;
                var presenter = this._SeriesPresenters.splice(index, 1)[0];
                this.Children.Remove(presenter);
            };
            ChartPresenter.prototype.OnSizeChanged = function (sender, e) {
                for (var i = 0, ps = this._SeriesPresenters, len = ps.length; i < len; i++) {
                    ps[i].UpdateSize(e.NewSize);
                }
            };
            return ChartPresenter;
        })(Canvas);
        DataVis.ChartPresenter = ChartPresenter;
    })(DataVis = Fayde.DataVis || (Fayde.DataVis = {}));
})(Fayde || (Fayde = {}));
var Fayde;
(function (Fayde) {
    var DataVis;
    (function (DataVis) {
        (function (CartesianOrientation) {
            CartesianOrientation[CartesianOrientation["Normal"] = 0] = "Normal";
            CartesianOrientation[CartesianOrientation["Transposed"] = 1] = "Transposed";
        })(DataVis.CartesianOrientation || (DataVis.CartesianOrientation = {}));
        var CartesianOrientation = DataVis.CartesianOrientation;
        DataVis.Library.addEnum(CartesianOrientation, "CartesianOrientation");
    })(DataVis = Fayde.DataVis || (Fayde.DataVis = {}));
})(Fayde || (Fayde = {}));
var Fayde;
(function (Fayde) {
    var DataVis;
    (function (DataVis) {
        DataVis.IScale_ = new nullstone.Interface("IScale");
        DataVis.IScale_.is = function (o) {
            return o && o.Evaluate instanceof Function;
        };
    })(DataVis = Fayde.DataVis || (Fayde.DataVis = {}));
})(Fayde || (Fayde = {}));
var Fayde;
(function (Fayde) {
    var DataVis;
    (function (DataVis) {
        DataVis.IValueOfable_ = new nullstone.Interface('IValueOfable');
        DataVis.IValueOfable_.is = function (o) {
            return o != null && typeof o.valueOf === "function";
        };
    })(DataVis = Fayde.DataVis || (Fayde.DataVis = {}));
})(Fayde || (Fayde = {}));
var Fayde;
(function (Fayde) {
    var DataVis;
    (function (DataVis) {
        var Series = (function (_super) {
            __extends(Series, _super);
            function Series() {
                _super.call(this);
                this.ChartInfo = null;
                this._Presenter = null;
            }
            Series.prototype._OnItemsSourceChanged = function (args) {
                var oldCC = Fayde.Collections.INotifyCollectionChanged_.as(args.OldValue);
                if (oldCC)
                    oldCC.CollectionChanged.off(this._OnItemsCollectionChanged, this);
                this._OnItemsRemoved(args.OldValue, 0);
                this._OnItemsAdded(args.NewValue, 0);
                var newCC = Fayde.Collections.INotifyCollectionChanged_.as(args.NewValue);
                if (newCC)
                    newCC.CollectionChanged.on(this._OnItemsCollectionChanged, this);
            };
            Series.prototype._OnItemsCollectionChanged = function (sender, e) {
                this._OnItemsRemoved(e.OldItems, e.OldStartingIndex);
                this._OnItemsAdded(e.NewItems, e.NewStartingIndex);
            };
            Series.prototype.Attach = function (chart) {
                this.ChartInfo = chart.ChartInfo;
                this.Presenter.OnAttached();
            };
            Series.prototype.Detach = function () {
                this.ChartInfo = null;
            };
            Object.defineProperty(Series.prototype, "Presenter", {
                get: function () {
                    return this._Presenter = this._Presenter || this.CreatePresenter();
                },
                enumerable: true,
                configurable: true
            });
            Series.prototype.CreatePresenter = function () {
                return new DataVis.SeriesPresenter(this);
            };
            Series.prototype._OnItemsAdded = function (items, index) {
                if (items)
                    this.Presenter.OnItemsAdded(items, index);
            };
            Series.prototype._OnItemsRemoved = function (items, index) {
                if (items)
                    this.Presenter.OnItemsRemoved(items, index);
            };
            Series.ItemsSourceProperty = DependencyProperty.Register("ItemsSource", function () { return nullstone.IEnumerable_; }, Series, undefined, function (d, args) { return d._OnItemsSourceChanged(args); });
            return Series;
        })(Fayde.DependencyObject);
        DataVis.Series = Series;
    })(DataVis = Fayde.DataVis || (Fayde.DataVis = {}));
})(Fayde || (Fayde = {}));
var Fayde;
(function (Fayde) {
    var DataVis;
    (function (DataVis) {
        var Internal;
        (function (Internal) {
            var ListenCollection = (function (_super) {
                __extends(ListenCollection, _super);
                function ListenCollection() {
                    _super.apply(this, arguments);
                    this._Listeners = [];
                }
                ListenCollection.prototype.Listen = function (onItemAdded, onItemRemoved) {
                    var _this = this;
                    var l = {
                        Unlisten: undefined,
                        OnItemAdded: onItemAdded,
                        OnItemRemoved: onItemRemoved
                    };
                    l.Unlisten = function () {
                        var index = _this._Listeners.indexOf(l);
                        if (index > -1)
                            _this._Listeners.splice(index, 1);
                    };
                    this._Listeners.push(l);
                    return l;
                };
                ListenCollection.prototype._RaiseItemAdded = function (value, index) {
                    this._NotifyAdded(value, index);
                };
                ListenCollection.prototype._RaiseItemRemoved = function (value, index) {
                    this._NotifyRemoved(value, index);
                };
                ListenCollection.prototype._RaiseItemReplaced = function (removed, added, index) {
                    this._NotifyRemoved(removed, index);
                    this._NotifyAdded(added, index);
                };
                ListenCollection.prototype._RaiseCleared = function (old) {
                    for (var i = 0; i < old.length; i++) {
                        this._NotifyRemoved(old[i], i);
                    }
                };
                ListenCollection.prototype._NotifyAdded = function (item, index) {
                    for (var i = 0, ls = this._Listeners.slice(0), len = ls.length; i < len; i++) {
                        ls[i].OnItemAdded(item, index);
                    }
                };
                ListenCollection.prototype._NotifyRemoved = function (item, index) {
                    for (var i = 0, ls = this._Listeners.slice(0), len = ls.length; i < len; i++) {
                        ls[i].OnItemRemoved(item, index);
                    }
                };
                return ListenCollection;
            })(Fayde.XamlObjectCollection);
            Internal.ListenCollection = ListenCollection;
        })(Internal = DataVis.Internal || (DataVis.Internal = {}));
    })(DataVis = Fayde.DataVis || (Fayde.DataVis = {}));
})(Fayde || (Fayde = {}));
/// <reference path="Internal/ListenCollection.ts" />
var Fayde;
(function (Fayde) {
    var DataVis;
    (function (DataVis) {
        var SeriesCollection = (function (_super) {
            __extends(SeriesCollection, _super);
            function SeriesCollection() {
                _super.apply(this, arguments);
            }
            return SeriesCollection;
        })(DataVis.Internal.ListenCollection);
        DataVis.SeriesCollection = SeriesCollection;
    })(DataVis = Fayde.DataVis || (Fayde.DataVis = {}));
})(Fayde || (Fayde = {}));
var Fayde;
(function (Fayde) {
    var DataVis;
    (function (DataVis) {
        var Canvas = Fayde.Controls.Canvas;
        var SeriesPresenter = (function (_super) {
            __extends(SeriesPresenter, _super);
            function SeriesPresenter(series) {
                _super.call(this);
                this._Items = [];
                this._Series = series;
                this.SizeChanged.on(this._OnSizeChanged, this);
            }
            Object.defineProperty(SeriesPresenter.prototype, "Series", {
                get: function () {
                    return this._Series;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(SeriesPresenter.prototype, "ChartInfo", {
                get: function () {
                    return this._Series ? this._Series.ChartInfo : null;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(SeriesPresenter.prototype, "Items", {
                get: function () {
                    return this._Items;
                },
                enumerable: true,
                configurable: true
            });
            SeriesPresenter.prototype._OnSizeChanged = function (sender, e) {
                this.OnSizeChanged(e.NewSize);
            };
            SeriesPresenter.prototype.OnAttached = function () {
            };
            SeriesPresenter.prototype.OnSizeChanged = function (newSize) {
            };
            SeriesPresenter.prototype.OnItemsAdded = function (items, index) {
                this._Items = this._Items.slice(0, index - 1).concat(items).concat(this._Items.slice(index));
            };
            SeriesPresenter.prototype.OnItemsRemoved = function (items, index) {
                this._Items.splice(index, items.length);
            };
            SeriesPresenter.prototype.UpdateSize = function (newSize) {
                this.Width = newSize.width;
                this.Height = newSize.height;
            };
            return SeriesPresenter;
        })(Canvas);
        DataVis.SeriesPresenter = SeriesPresenter;
    })(DataVis = Fayde.DataVis || (Fayde.DataVis = {}));
})(Fayde || (Fayde = {}));
var Fayde;
(function (Fayde) {
    var DataVis;
    (function (DataVis) {
        var ValueSet = (function () {
            function ValueSet() {
                this.Walker = new Fayde.Data.PropertyPathWalker("");
                this._Min = null;
                this._Max = null;
                this.Values = [];
            }
            Object.defineProperty(ValueSet.prototype, "Count", {
                get: function () {
                    return this.Values.length;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(ValueSet.prototype, "Min", {
                get: function () {
                    return this._Min;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(ValueSet.prototype, "Max", {
                get: function () {
                    return this._Max;
                },
                enumerable: true,
                configurable: true
            });
            ValueSet.prototype.Insert = function (item, index) {
                this.Values.splice(index, 0, this.Walker.GetValue(item));
                this.Update();
            };
            ValueSet.prototype.RemoveAt = function (index) {
                this.Values.splice(index, 1);
                this.Update();
            };
            ValueSet.prototype.UpdateWalker = function (items) {
                for (var i = 0, vals = this.Values, walker = this.Walker, len = items.length; i < len; i++) {
                    vals[i] = walker.GetValue(items[i]);
                }
            };
            ValueSet.prototype.Update = function () {
                this._Min = this.Values.reduce(function (prev, cur) {
                    if (prev == null)
                        return cur == null ? null : cur;
                    if (cur == null)
                        return prev;
                    return cur.valueOf() < prev.valueOf() ? cur : prev;
                }, null);
                this._Max = this.Values.reduce(function (prev, cur) {
                    if (prev == null)
                        return cur == null ? null : cur;
                    if (cur == null)
                        return prev;
                    return cur.valueOf() > prev.valueOf() ? cur : prev;
                }, null);
            };
            return ValueSet;
        })();
        DataVis.ValueSet = ValueSet;
    })(DataVis = Fayde.DataVis || (Fayde.DataVis = {}));
})(Fayde || (Fayde = {}));
/// <reference path="../Chart.ts" />
var Fayde;
(function (Fayde) {
    var DataVis;
    (function (DataVis) {
        var CartesianChart = (function (_super) {
            __extends(CartesianChart, _super);
            function CartesianChart() {
                _super.call(this);
                this.DefaultStyleKey = CartesianChart;
            }
            CartesianChart.GetOrientation = function (dobj) {
                return dobj.GetValue(CartesianChart.OrientationProperty);
            };
            CartesianChart.SetOrientation = function (dobj, value) {
                dobj.SetValue(CartesianChart.OrientationProperty, value);
            };
            CartesianChart.prototype._OnXAxisChanged = function (args) {
                var axis = args.NewValue;
                this.ChartInfo.XAxis = axis;
                if (axis)
                    axis.IsVertical = false;
                for (var en = this.Series.getEnumerator(); en.moveNext();) {
                    var presenter = en.current.Presenter;
                    if (presenter instanceof DataVis.BiSeriesPresenter)
                        presenter.OnXAxisChanged(axis);
                }
            };
            CartesianChart.prototype._OnYAxisChanged = function (args) {
                var axis = args.NewValue;
                this.ChartInfo.YAxis = axis;
                if (axis)
                    axis.IsVertical = true;
                for (var en = this.Series.getEnumerator(); en.moveNext();) {
                    var presenter = en.current.Presenter;
                    if (presenter instanceof DataVis.BiSeriesPresenter)
                        presenter.OnYAxisChanged(axis);
                }
            };
            CartesianChart.XAxisProperty = DependencyProperty.Register("XAxis", function () { return DataVis.Axis; }, CartesianChart, undefined, function (d, args) { return d._OnXAxisChanged(args); });
            CartesianChart.YAxisProperty = DependencyProperty.Register("YAxis", function () { return DataVis.Axis; }, CartesianChart, undefined, function (d, args) { return d._OnYAxisChanged(args); });
            CartesianChart.OrientationProperty = DependencyProperty.RegisterAttached("Orientation", function () { return new Fayde.Enum(DataVis.CartesianOrientation); }, CartesianChart, 0 /* Normal */);
            return CartesianChart;
        })(DataVis.Chart);
        DataVis.CartesianChart = CartesianChart;
        Fayde.Controls.TemplateParts(CartesianChart, { Name: "Presenter", Type: DataVis.CartesianChartPresenter });
    })(DataVis = Fayde.DataVis || (Fayde.DataVis = {}));
})(Fayde || (Fayde = {}));
/// <reference path="../ChartPresenter.ts" />
var Fayde;
(function (Fayde) {
    var DataVis;
    (function (DataVis) {
        var CartesianChartPresenter = (function (_super) {
            __extends(CartesianChartPresenter, _super);
            function CartesianChartPresenter() {
                _super.apply(this, arguments);
                this._yap = null;
                this._YListener = null;
                this._xap = null;
                this._XListener = null;
            }
            CartesianChartPresenter.prototype.Detach = function () {
                _super.prototype.Detach.call(this);
                if (this._XListener)
                    this._XListener.Detach();
                this._OnXChanged(null);
                if (this._YListener)
                    this._YListener.Detach();
                this._OnYChanged(null);
            };
            CartesianChartPresenter.prototype.Attach = function (chart) {
                var _this = this;
                _super.prototype.Attach.call(this, chart);
                if (chart) {
                    this._OnXChanged(chart.XAxis);
                    var propd = DataVis.CartesianChart.XAxisProperty;
                    this._XListener = propd.Store.ListenToChanged(chart, propd, function (sender, args) { return _this._OnXChanged(args.NewValue); }, this);
                    this._OnYChanged(chart.YAxis);
                    var propd = DataVis.CartesianChart.YAxisProperty;
                    this._YListener = propd.Store.ListenToChanged(chart, propd, function (sender, args) { return _this._OnYChanged(args.NewValue); }, this);
                }
            };
            CartesianChartPresenter.prototype._OnYChanged = function (axis) {
                if (this._yap) {
                    this.Children.Remove(this._yap);
                    this._yap = null;
                }
                if (axis) {
                    this._yap = axis.Presenter;
                    this.Children.Add(this._yap);
                }
            };
            CartesianChartPresenter.prototype._OnXChanged = function (axis) {
                if (this._xap) {
                    this.Children.Remove(this._xap);
                    this._xap = null;
                }
                if (axis) {
                    this._xap = axis.Presenter;
                    this.Children.Add(this._xap);
                }
            };
            CartesianChartPresenter.prototype.OnSizeChanged = function (sender, e) {
                if (this._xap)
                    this._xap.UpdateSize(e.NewSize);
                if (this._yap)
                    this._yap.UpdateSize(e.NewSize);
                _super.prototype.OnSizeChanged.call(this, sender, e);
            };
            return CartesianChartPresenter;
        })(DataVis.ChartPresenter);
        DataVis.CartesianChartPresenter = CartesianChartPresenter;
    })(DataVis = Fayde.DataVis || (Fayde.DataVis = {}));
})(Fayde || (Fayde = {}));
/// <reference path="../../Series.ts" />
var Fayde;
(function (Fayde) {
    var DataVis;
    (function (DataVis) {
        var BiSeries = (function (_super) {
            __extends(BiSeries, _super);
            function BiSeries() {
                _super.call(this);
                DataVis.CartesianChart.OrientationProperty.Store.ListenToChanged(this, DataVis.CartesianChart.OrientationProperty, this._OnOrientationChanged, this);
            }
            BiSeries.prototype.CreatePresenter = function () {
                return new DataVis.BiSeriesPresenter(this);
            };
            BiSeries.prototype._OnOrientationChanged = function (sender, args) {
                this.Presenter.OnTransposed();
            };
            BiSeries.prototype._OnDependentValuePathChanged = function (args) {
                this.Presenter.OnDependentValuePathChanged(args.NewValue);
            };
            BiSeries.prototype._OnIndependentValuePathChanged = function (args) {
                this.Presenter.OnIndependentValuePathChanged(args.NewValue);
            };
            BiSeries.DependentValuePathProperty = DependencyProperty.Register("DependentValuePath", function () { return String; }, BiSeries, undefined, function (d, args) { return d._OnDependentValuePathChanged(args); });
            BiSeries.IndependentValuePathProperty = DependencyProperty.Register("IndependentValuePath", function () { return String; }, BiSeries, undefined, function (d, args) { return d._OnIndependentValuePathChanged(args); });
            return BiSeries;
        })(DataVis.Series);
        DataVis.BiSeries = BiSeries;
    })(DataVis = Fayde.DataVis || (Fayde.DataVis = {}));
})(Fayde || (Fayde = {}));
/// <reference path="BiSeries.ts" />
var Fayde;
(function (Fayde) {
    var DataVis;
    (function (DataVis) {
        var BarSeries = (function (_super) {
            __extends(BarSeries, _super);
            function BarSeries() {
                _super.apply(this, arguments);
            }
            BarSeries.prototype.CreatePresenter = function () {
                return new DataVis.BarSeriesPresenter(this);
            };
            return BarSeries;
        })(DataVis.BiSeries);
        DataVis.BarSeries = BarSeries;
    })(DataVis = Fayde.DataVis || (Fayde.DataVis = {}));
})(Fayde || (Fayde = {}));
/// <reference path="../../SeriesPresenter.ts" />
var Fayde;
(function (Fayde) {
    var DataVis;
    (function (DataVis) {
        var BiSeriesPresenter = (function (_super) {
            __extends(BiSeriesPresenter, _super);
            function BiSeriesPresenter(series) {
                _super.call(this, series);
                this.DepValueSet = new DataVis.ValueSet();
                this.IndValueSet = new DataVis.ValueSet();
            }
            BiSeriesPresenter.prototype.OnItemsAdded = function (items, index) {
                _super.prototype.OnItemsAdded.call(this, items, index);
                var dvs = this.DepValueSet;
                var ivs = this.IndValueSet;
                for (var i = 0, len = items.length; i < len; i++) {
                    dvs.Insert(items[i], i + index);
                    ivs.Insert(items[i], i + index);
                }
            };
            BiSeriesPresenter.prototype.OnItemsRemoved = function (items, index) {
                _super.prototype.OnItemsRemoved.call(this, items, index);
                var dvs = this.DepValueSet;
                var ivs = this.IndValueSet;
                for (var i = 0, len = items.length; i < len; i++) {
                    dvs.RemoveAt(i + index);
                    ivs.RemoveAt(i + index);
                }
            };
            BiSeriesPresenter.prototype.OnTransposed = function () {
            };
            BiSeriesPresenter.prototype.OnDependentValuePathChanged = function (path) {
                this.DepValueSet.Walker = new Fayde.Data.PropertyPathWalker(path, true, false, false);
                this.DepValueSet.UpdateWalker(this.Items);
            };
            BiSeriesPresenter.prototype.OnIndependentValuePathChanged = function (path) {
                this.IndValueSet.Walker = new Fayde.Data.PropertyPathWalker(path, true, false, false);
                this.IndValueSet.UpdateWalker(this.Items);
            };
            BiSeriesPresenter.prototype.GetIndependentValue = function (index) {
                return this.IndValueSet.Values[index];
            };
            BiSeriesPresenter.prototype.InterpolateIndependent = function (axis, index) {
                var vs = this.IndValueSet;
                var t = axis.Parameterizer.Parameterize(vs, index);
                var i = axis.Interpolate(t);
                return i;
            };
            BiSeriesPresenter.prototype.GetDependentValue = function (index) {
                return this.DepValueSet.Values[index];
            };
            BiSeriesPresenter.prototype.InterpolateDependent = function (axis, index) {
                var vs = this.DepValueSet;
                var t = axis.Parameterizer.Parameterize(vs, index);
                var d = axis.Interpolate(t);
                return d;
            };
            BiSeriesPresenter.prototype.OnXAxisChanged = function (axis) {
            };
            BiSeriesPresenter.prototype.OnYAxisChanged = function (axis) {
            };
            return BiSeriesPresenter;
        })(DataVis.SeriesPresenter);
        DataVis.BiSeriesPresenter = BiSeriesPresenter;
    })(DataVis = Fayde.DataVis || (Fayde.DataVis = {}));
})(Fayde || (Fayde = {}));
var Fayde;
(function (Fayde) {
    var DataVis;
    (function (DataVis) {
        var Shapes;
        (function (Shapes) {
            var Canvas = Fayde.Controls.Canvas;
            var Rectangle = Fayde.Shapes.Rectangle;
            var BarGroup = (function (_super) {
                __extends(BarGroup, _super);
                function BarGroup() {
                    _super.call(this);
                    this._getInd = null;
                    this._getDep = null;
                    this._FreezeSize = false;
                    this._BarStyle = null;
                    this._BarSpacing = null;
                    this._IsVertical = false;
                    this._XAxis = null;
                    this._YAxis = null;
                    var wbinding = new Fayde.Data.Binding("Width");
                    var rs = wbinding.RelativeSource = new Fayde.Data.RelativeSource();
                    rs.Mode = 2 /* FindAncestor */;
                    rs.AncestorType = Canvas;
                    rs.AncestorLevel = 1;
                    this.SetBinding(Fayde.FrameworkElement.WidthProperty, wbinding);
                    var hbinding = new Fayde.Data.Binding("Height");
                    var rs = hbinding.RelativeSource = new Fayde.Data.RelativeSource();
                    rs.Mode = 2 /* FindAncestor */;
                    rs.AncestorType = Canvas;
                    rs.AncestorLevel = 1;
                    this.SetBinding(Fayde.FrameworkElement.HeightProperty, hbinding);
                    Fayde.FrameworkElement.WidthProperty.Store.ListenToChanged(this, Fayde.FrameworkElement.WidthProperty, this._OnWidthChanged, this);
                    Fayde.FrameworkElement.WidthProperty.Store.ListenToChanged(this, Fayde.FrameworkElement.WidthProperty, this._OnHeightChanged, this);
                }
                Object.defineProperty(BarGroup.prototype, "BarStyle", {
                    get: function () {
                        return this._BarStyle;
                    },
                    set: function (value) {
                        this._BarStyle = value;
                        for (var en = this.Children.getEnumerator(); en.moveNext();) {
                            en.current.Style = value;
                        }
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(BarGroup.prototype, "BarSpacing", {
                    get: function () {
                        return this._BarSpacing;
                    },
                    set: function (value) {
                        this._BarSpacing = value;
                        this.Update();
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(BarGroup.prototype, "IsVertical", {
                    get: function () {
                        return this._IsVertical;
                    },
                    set: function (value) {
                        this._IsVertical = value;
                        this.Update();
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(BarGroup.prototype, "XAxis", {
                    get: function () {
                        return this._XAxis;
                    },
                    set: function (value) {
                        this._XAxis = value;
                        this.Update();
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(BarGroup.prototype, "YAxis", {
                    get: function () {
                        return this._YAxis;
                    },
                    set: function (value) {
                        this._YAxis = value;
                        this.Update();
                    },
                    enumerable: true,
                    configurable: true
                });
                BarGroup.prototype.Init = function (getInd, getDep) {
                    this._getInd = getInd;
                    this._getDep = getDep;
                };
                BarGroup.prototype._OnWidthChanged = function (sender, args) {
                    if (!this._FreezeSize)
                        this.Update();
                };
                BarGroup.prototype._OnHeightChanged = function (sender, args) {
                    if (!this._FreezeSize)
                        this.Update();
                };
                BarGroup.prototype.InsertMany = function (index, count) {
                    if (count === void 0) { count = 1; }
                    var children = this.Children;
                    for (var i = 0; i < count; i++) {
                        var newBar = new Rectangle();
                        newBar.Style = this.BarStyle;
                        children.Insert(index, newBar);
                    }
                    this.Update();
                };
                BarGroup.prototype.RemoveManyAt = function (index, count) {
                    if (count === void 0) { count = 1; }
                    var children = this.Children;
                    for (var i = 0; i < count; i++) {
                        children.RemoveAt(index);
                    }
                    this.Update();
                };
                BarGroup.prototype.UpdateSize = function (newSize) {
                    this._FreezeSize = true;
                    try {
                        this.Width = newSize.width;
                        this.Height = newSize.height;
                    }
                    finally {
                        this._FreezeSize = false;
                    }
                    this.Update();
                };
                BarGroup.prototype.Update = function () {
                    (!this._IsVertical) ? this.UpdateHorizontal() : this.UpdateVertical();
                };
                BarGroup.prototype.UpdateHorizontal = function () {
                    var ind = this.XAxis;
                    var dep = this.YAxis;
                    if (!ind || !dep || isNaN(this.Width) || isNaN(this.Height))
                        return;
                    var getBand = createGetBand(ind, this.BarSpacing, this.Children.Count, this.Width);
                    var fullHeight = this.Height;
                    for (var i = 0, en = this.Children.getEnumerator(); en.moveNext(); i++) {
                        var bar = en.current;
                        var band = getBand(this._getInd(ind, i));
                        var height = this._getDep(dep, i);
                        this.UpdateBar(bar, band[0], fullHeight - height, band[1], height);
                    }
                };
                BarGroup.prototype.UpdateVertical = function () {
                    var ind = this.YAxis;
                    var dep = this.XAxis;
                    if (!ind || !dep || isNaN(this.Width) || isNaN(this.Height))
                        return;
                    var getBand = createGetBand(ind, this.BarSpacing, this.Children.Count, this.Height);
                    for (var i = 0, en = this.Children.getEnumerator(); en.moveNext(); i++) {
                        var bar = en.current;
                        var band = getBand(this._getInd(ind, i));
                        var width = this._getDep(dep, i);
                        this.UpdateBar(bar, 0, band[0], width, band[1]);
                    }
                };
                BarGroup.prototype.UpdateBar = function (bar, left, top, width, height) {
                    Canvas.SetLeft(bar, left);
                    Canvas.SetTop(bar, top);
                    bar.Width = width;
                    bar.Height = height;
                };
                return BarGroup;
            })(Canvas);
            Shapes.BarGroup = BarGroup;
            function createGetBand(indAxis, spacing, count, full) {
                var scale = indAxis.Scale;
                if (scale instanceof DataVis.OrdinalScale) {
                    return function (c) { return scale.GetBand(c, spacing, count); };
                }
                var band = full / count;
                return function (c) { return [c - (band / 2), band]; };
            }
        })(Shapes = DataVis.Shapes || (DataVis.Shapes = {}));
    })(DataVis = Fayde.DataVis || (Fayde.DataVis = {}));
})(Fayde || (Fayde = {}));
/// <reference path="BiSeriesPresenter" />
/// <reference path="../../Shapes/BarGroup" />
var Fayde;
(function (Fayde) {
    var DataVis;
    (function (DataVis) {
        var BarGroup = Fayde.DataVis.Shapes.BarGroup;
        var BarSeriesPresenter = (function (_super) {
            __extends(BarSeriesPresenter, _super);
            function BarSeriesPresenter(series) {
                var _this = this;
                _super.call(this, series);
                this.DefaultStyleKey = BarSeriesPresenter;
                var grp = this._Group = new BarGroup();
                grp.Init(function (axis, index) { return _this.InterpolateIndependent(axis, index); }, function (axis, index) { return _this.InterpolateDependent(axis, index); });
                var ci = series.ChartInfo;
                if (ci) {
                    grp.XAxis = ci.XAxis;
                    grp.YAxis = ci.YAxis;
                }
                this.Children.Add(grp);
            }
            BarSeriesPresenter.prototype._OnBarStyleChanged = function (args) {
                this._Group.BarStyle = args.NewValue;
            };
            BarSeriesPresenter.prototype._OnBarSpacingChanged = function (args) {
                this._Group.BarSpacing = args.NewValue;
            };
            BarSeriesPresenter.prototype.OnSizeChanged = function (newSize) {
                this._Group.UpdateSize(newSize);
            };
            BarSeriesPresenter.prototype.OnItemsAdded = function (items, index) {
                _super.prototype.OnItemsAdded.call(this, items, index);
                this._Group.InsertMany(index, items.length);
            };
            BarSeriesPresenter.prototype.OnItemsRemoved = function (items, index) {
                _super.prototype.OnItemsRemoved.call(this, items, index);
                this._Group.RemoveManyAt(index, items.length);
            };
            BarSeriesPresenter.prototype.OnTransposed = function () {
                _super.prototype.OnTransposed.call(this);
                this._Group.IsVertical = DataVis.CartesianChart.GetOrientation(this.Series) === 1 /* Transposed */;
            };
            BarSeriesPresenter.prototype.OnAttached = function () {
                _super.prototype.OnAttached.call(this);
                var grp = this._Group;
                var ci = this.ChartInfo;
                grp.XAxis = ci.XAxis;
                grp.YAxis = ci.YAxis;
            };
            BarSeriesPresenter.prototype.OnXAxisChanged = function (axis) {
                _super.prototype.OnXAxisChanged.call(this, axis);
                this._Group.XAxis = axis;
            };
            BarSeriesPresenter.prototype.OnYAxisChanged = function (axis) {
                _super.prototype.OnYAxisChanged.call(this, axis);
                this._Group.YAxis = axis;
            };
            BarSeriesPresenter.BarStyleProperty = DependencyProperty.Register("BarStyle", function () { return Fayde.Style; }, BarSeriesPresenter, undefined, function (d, args) { return d._OnBarStyleChanged(args); });
            BarSeriesPresenter.BarSpacing = DependencyProperty.Register("BarSpacing", function () { return DataVis.Spacing; }, BarSeriesPresenter, undefined, function (d, args) { return d._OnBarSpacingChanged(args); });
            return BarSeriesPresenter;
        })(DataVis.BiSeriesPresenter);
        DataVis.BarSeriesPresenter = BarSeriesPresenter;
    })(DataVis = Fayde.DataVis || (Fayde.DataVis = {}));
})(Fayde || (Fayde = {}));
/// <reference path="BiSeries.ts" />
var Fayde;
(function (Fayde) {
    var DataVis;
    (function (DataVis) {
        var LineSeries = (function (_super) {
            __extends(LineSeries, _super);
            function LineSeries() {
                _super.apply(this, arguments);
            }
            LineSeries.prototype.CreatePresenter = function () {
                return new DataVis.LineSeriesPresenter(this);
            };
            return LineSeries;
        })(DataVis.BiSeries);
        DataVis.LineSeries = LineSeries;
    })(DataVis = Fayde.DataVis || (Fayde.DataVis = {}));
})(Fayde || (Fayde = {}));
/// <reference path="BiSeriesPresenter.ts" />
var Fayde;
(function (Fayde) {
    var DataVis;
    (function (DataVis) {
        var Polyline = Fayde.Shapes.Polyline;
        var LineSeriesPresenter = (function (_super) {
            __extends(LineSeriesPresenter, _super);
            function LineSeriesPresenter(series) {
                _super.call(this, series);
                this._Line = new Polyline();
                this.DefaultStyleKey = LineSeriesPresenter;
                this.Children.Add(this._Line);
            }
            LineSeriesPresenter.prototype._OnLineStyleChanged = function (args) {
                this._Line.Style = args.NewValue;
            };
            LineSeriesPresenter.prototype.OnSizeChanged = function (newSize) {
                this.Update();
            };
            LineSeriesPresenter.prototype.OnItemsAdded = function (items, index) {
                _super.prototype.OnItemsAdded.call(this, items, index);
                this.Update();
            };
            LineSeriesPresenter.prototype.OnItemsRemoved = function (items, index) {
                _super.prototype.OnItemsRemoved.call(this, items, index);
                this.Update();
            };
            LineSeriesPresenter.prototype.GetCoordinate = function (index) {
                var ci = this.ChartInfo;
                var fullHeight = this.Height;
                if (DataVis.CartesianChart.GetOrientation(this.Series) === 1 /* Transposed */) {
                    return new Point(this.InterpolateDependent(ci.XAxis, index), fullHeight - this.InterpolateIndependent(ci.YAxis, index));
                }
                else {
                    return new Point(this.InterpolateIndependent(ci.XAxis, index), fullHeight - this.InterpolateDependent(ci.YAxis, index));
                }
            };
            LineSeriesPresenter.prototype.Update = function () {
                var _this = this;
                this._Line.Points.Clear();
                this._Line.Points.AddRange(this.Items.map(function (item, index) { return _this.GetCoordinate(index); }));
            };
            LineSeriesPresenter.LineStyleProperty = DependencyProperty.Register("LineStyle", function () { return Fayde.Style; }, LineSeriesPresenter, undefined, function (d, args) { return d._OnLineStyleChanged(args); });
            return LineSeriesPresenter;
        })(DataVis.BiSeriesPresenter);
        DataVis.LineSeriesPresenter = LineSeriesPresenter;
    })(DataVis = Fayde.DataVis || (Fayde.DataVis = {}));
})(Fayde || (Fayde = {}));
/// <reference path="../Axis.ts" />
var Fayde;
(function (Fayde) {
    var DataVis;
    (function (DataVis) {
        var LinearAxis = (function (_super) {
            __extends(LinearAxis, _super);
            function LinearAxis() {
                _super.call(this);
                if (!this.Scale)
                    this.Scale = new DataVis.LinearScale();
            }
            Object.defineProperty(LinearAxis.prototype, "IsVertical", {
                get: function () {
                    return this.Presenter.IsVertical === true;
                },
                set: function (value) {
                    this.Presenter.IsVertical = value === true;
                },
                enumerable: true,
                configurable: true
            });
            LinearAxis.prototype.OnMinimumChanged = function (oldValue, newValue) {
                this.Parameterizer.Minimum = newValue;
            };
            LinearAxis.prototype.OnMaximumChanged = function (oldValue, newValue) {
                this.Parameterizer.Maximum = newValue;
            };
            LinearAxis.prototype.CreatePresenter = function () {
                return new DataVis.LinearAxisPresenter();
            };
            LinearAxis.prototype.CreateParameterizer = function () {
                return new DataVis.LinearParameterizer();
            };
            LinearAxis.MinimumProperty = DependencyProperty.Register("Minimum", function () { return DataVis.IValueOfable_; }, DataVis.Axis, undefined, function (d, args) { return d.OnMinimumChanged(args.OldValue, args.NewValue); });
            LinearAxis.MaximumProperty = DependencyProperty.Register("Maximum", function () { return DataVis.IValueOfable_; }, DataVis.Axis, undefined, function (d, args) { return d.OnMaximumChanged(args.OldValue, args.NewValue); });
            return LinearAxis;
        })(DataVis.Axis);
        DataVis.LinearAxis = LinearAxis;
    })(DataVis = Fayde.DataVis || (Fayde.DataVis = {}));
})(Fayde || (Fayde = {}));
/// <reference path="../AxisPresenter.ts" />
var Fayde;
(function (Fayde) {
    var DataVis;
    (function (DataVis) {
        var LinearAxisPresenter = (function (_super) {
            __extends(LinearAxisPresenter, _super);
            function LinearAxisPresenter() {
                _super.call(this);
                this.IsVertical = false;
                this.DefaultStyleKey = LinearAxisPresenter;
            }
            LinearAxisPresenter.prototype.UpdateScale = function (width, height) {
                var ls = this.Scale;
                if (ls instanceof DataVis.LinearScale) {
                    if (this.IsVertical) {
                        ls.RangeMin = 0;
                        ls.RangeMax = height;
                    }
                    else {
                        ls.RangeMin = 0;
                        ls.RangeMax = width;
                    }
                }
            };
            return LinearAxisPresenter;
        })(DataVis.AxisPresenter);
        DataVis.LinearAxisPresenter = LinearAxisPresenter;
    })(DataVis = Fayde.DataVis || (Fayde.DataVis = {}));
})(Fayde || (Fayde = {}));
var Fayde;
(function (Fayde) {
    var DataVis;
    (function (DataVis) {
        var LinearParameterizer = (function () {
            function LinearParameterizer() {
                this.Minimum = null;
                this.Maximum = null;
            }
            LinearParameterizer.prototype.Parameterize = function (vs, index) {
                var n = (vs.Values[index] || 0).valueOf();
                var min = DataVis.Parameterize.ValidMinimum(this.Minimum, vs.Min);
                var max = DataVis.Parameterize.ValidMaximum(this.Maximum, vs.Max);
                return (n - min) / (max - min);
            };
            return LinearParameterizer;
        })();
        DataVis.LinearParameterizer = LinearParameterizer;
    })(DataVis = Fayde.DataVis || (Fayde.DataVis = {}));
})(Fayde || (Fayde = {}));
var Fayde;
(function (Fayde) {
    var DataVis;
    (function (DataVis) {
        var LinearScale = (function () {
            function LinearScale() {
                this.RangeMin = 0;
                this.RangeMax = 1;
            }
            LinearScale.prototype.Evaluate = function (t) {
                var min = this.RangeMin || 0;
                var max = this.RangeMax;
                if (max == null)
                    max = 1;
                return t * (max - min) + min;
            };
            return LinearScale;
        })();
        DataVis.LinearScale = LinearScale;
    })(DataVis = Fayde.DataVis || (Fayde.DataVis = {}));
})(Fayde || (Fayde = {}));
var Fayde;
(function (Fayde) {
    var DataVis;
    (function (DataVis) {
        var OrdinalAxis = (function (_super) {
            __extends(OrdinalAxis, _super);
            function OrdinalAxis() {
                _super.call(this);
                if (!this.Scale)
                    this.Scale = new DataVis.OrdinalScale();
            }
            Object.defineProperty(OrdinalAxis.prototype, "IsVertical", {
                get: function () {
                    return this.Presenter.IsVertical === true;
                },
                set: function (value) {
                    this.Presenter.IsVertical = value === true;
                },
                enumerable: true,
                configurable: true
            });
            OrdinalAxis.prototype.CreatePresenter = function () {
                return new DataVis.OrdinalAxisPresenter();
            };
            OrdinalAxis.prototype.CreateParameterizer = function () {
                return new DataVis.OrdinalParameterizer();
            };
            return OrdinalAxis;
        })(DataVis.Axis);
        DataVis.OrdinalAxis = OrdinalAxis;
    })(DataVis = Fayde.DataVis || (Fayde.DataVis = {}));
})(Fayde || (Fayde = {}));
/// <reference path="../AxisPresenter.ts" />
var Fayde;
(function (Fayde) {
    var DataVis;
    (function (DataVis) {
        var OrdinalAxisPresenter = (function (_super) {
            __extends(OrdinalAxisPresenter, _super);
            function OrdinalAxisPresenter() {
                _super.call(this);
                this.IsVertical = false;
                this.DefaultStyleKey = OrdinalAxisPresenter;
            }
            OrdinalAxisPresenter.prototype.UpdateScale = function (width, height) {
                var ls = this.Scale;
                if (ls instanceof DataVis.LinearScale) {
                    if (this.IsVertical) {
                        ls.RangeMin = height;
                        ls.RangeMax = 0;
                    }
                    else {
                        ls.RangeMin = 0;
                        ls.RangeMax = width;
                    }
                }
            };
            return OrdinalAxisPresenter;
        })(DataVis.AxisPresenter);
        DataVis.OrdinalAxisPresenter = OrdinalAxisPresenter;
    })(DataVis = Fayde.DataVis || (Fayde.DataVis = {}));
})(Fayde || (Fayde = {}));
var Fayde;
(function (Fayde) {
    var DataVis;
    (function (DataVis) {
        var OrdinalParameterizer = (function () {
            function OrdinalParameterizer() {
            }
            OrdinalParameterizer.prototype.Parameterize = function (vs, index) {
                //Domain: [0, n - 1]
                //padding: 1 / (2 * n)
                //Range: [padding, 1 - padding]
                return (index + 0.5) / vs.Count;
            };
            return OrdinalParameterizer;
        })();
        DataVis.OrdinalParameterizer = OrdinalParameterizer;
    })(DataVis = Fayde.DataVis || (Fayde.DataVis = {}));
})(Fayde || (Fayde = {}));
var Fayde;
(function (Fayde) {
    var DataVis;
    (function (DataVis) {
        var OrdinalScale = (function (_super) {
            __extends(OrdinalScale, _super);
            function OrdinalScale() {
                _super.apply(this, arguments);
            }
            OrdinalScale.prototype.GetBand = function (center, spacing, count) {
                var rmin = this.RangeMin || 0;
                var rmax = this.RangeMax;
                if (rmax == null)
                    rmax = 1;
                var band = (rmax - rmin) / count;
                var padding = (!spacing) ? 0 : spacing.Evaluate(band);
                if (padding > band)
                    return [center, 0];
                if (padding > 0)
                    band -= padding;
                return [center - (band / 2), band];
            };
            return OrdinalScale;
        })(DataVis.LinearScale);
        DataVis.OrdinalScale = OrdinalScale;
    })(DataVis = Fayde.DataVis || (Fayde.DataVis = {}));
})(Fayde || (Fayde = {}));
var Fayde;
(function (Fayde) {
    var DataVis;
    (function (DataVis) {
        var Parameterize;
        (function (Parameterize) {
            function ValidMinimum(vo, fallback) {
                var val = getValidValue(vo, fallback);
                return val == null ? 0 : val;
            }
            Parameterize.ValidMinimum = ValidMinimum;
            function ValidMaximum(vo, fallback) {
                var val = getValidValue(vo, fallback);
                return val == null ? 1 : val;
            }
            Parameterize.ValidMaximum = ValidMaximum;
            function getValidValue(vo, fallback) {
                var val = vo.valueOf();
                if (vo == null || isNaN(val))
                    return fallback == null ? null : fallback.valueOf();
                return val;
            }
        })(Parameterize = DataVis.Parameterize || (DataVis.Parameterize = {}));
    })(DataVis = Fayde.DataVis || (Fayde.DataVis = {}));
})(Fayde || (Fayde = {}));
var Fayde;
(function (Fayde) {
    var DataVis;
    (function (DataVis) {
        DataVis.IParameterizer_ = new nullstone.Interface("IParameterizer");
        DataVis.IParameterizer_.is = function (o) {
            return o && o.Parameterize instanceof Function;
        };
    })(DataVis = Fayde.DataVis || (Fayde.DataVis = {}));
})(Fayde || (Fayde = {}));
var Fayde;
(function (Fayde) {
    var DataVis;
    (function (DataVis) {
        var Spacing = (function (_super) {
            __extends(Spacing, _super);
            function Spacing() {
                _super.apply(this, arguments);
            }
            Spacing.prototype.Evaluate = function (bandSize) {
                switch (this.Type) {
                    case 1 /* Percent */:
                        return bandSize * this.Length;
                        break;
                    default:
                    case 0 /* Pixel */:
                        return this.Length;
                }
            };
            Spacing.LengthProperty = DependencyProperty.Register("Length", function () { return Number; }, Spacing, 0);
            Spacing.TypeProperty = DependencyProperty.Register("Type", function () { return new Fayde.Enum(DataVis.SpacingType); }, Spacing, 0 /* Pixel */);
            return Spacing;
        })(Fayde.DependencyObject);
        DataVis.Spacing = Spacing;
        nullstone.registerTypeConverter(Spacing, function (o) {
            if (o == null || o instanceof Spacing)
                return o;
            if (typeof o === "string") {
                var spacing = new Spacing();
                if (o[o.length - 1] === "%") {
                    spacing.Type = 1 /* Percent */;
                    spacing.Length = parseFloat(o) / 100;
                }
                else {
                    spacing.Type = 0 /* Pixel */;
                    spacing.Length = parseFloat(o);
                }
                return spacing;
            }
            return undefined;
        });
    })(DataVis = Fayde.DataVis || (Fayde.DataVis = {}));
})(Fayde || (Fayde = {}));
var Fayde;
(function (Fayde) {
    var DataVis;
    (function (DataVis) {
        (function (SpacingType) {
            SpacingType[SpacingType["Pixel"] = 0] = "Pixel";
            SpacingType[SpacingType["Percent"] = 1] = "Percent";
        })(DataVis.SpacingType || (DataVis.SpacingType = {}));
        var SpacingType = DataVis.SpacingType;
        DataVis.Library.addEnum(SpacingType, "SpacingType");
    })(DataVis = Fayde.DataVis || (Fayde.DataVis = {}));
})(Fayde || (Fayde = {}));
//# sourceMappingURL=fayde.datavis.js.map