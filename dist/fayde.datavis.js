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
                _super.call(this);
                this._Scale = null;
                this.SizeChanged.on(this._OnSizeChanged, this);
            }
            AxisPresenter.prototype._OnSizeChanged = function (sender, e) {
                this.OnSizeChanged(e.NewSize);
                this.UpdateScale();
            };
            AxisPresenter.prototype.OnSizeChanged = function (newSize) {
            };
            AxisPresenter.prototype.UpdateSize = function (newSize) {
                this.Width = newSize.width;
                this.Height = newSize.height;
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
                this.UpdateScale();
            };
            AxisPresenter.prototype.UpdateScale = function () {
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
                this._SeriesListener = series.Listen(function (item, index) { return item.ChartInfo = _this.ChartInfo; }, function (item, index) { return item.ChartInfo = null; });
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
                        return cur;
                    return cur < prev ? cur : prev;
                }, null);
                this._Max = this.Values.reduce(function (prev, cur) {
                    if (prev == null)
                        return cur;
                    return cur > prev ? cur : prev;
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
            CartesianChart.prototype._OnOrientationChanged = function (args) {
                this.ChartInfo.Orientation = args.NewValue;
            };
            CartesianChart.prototype._OnXAxisChanged = function (args) {
                var axis = args.NewValue;
                this.ChartInfo.XAxis = axis;
                if (axis)
                    axis.IsVertical = false;
            };
            CartesianChart.prototype._OnYAxisChanged = function (args) {
                var axis = args.NewValue;
                this.ChartInfo.YAxis = axis;
                if (axis)
                    axis.IsVertical = true;
            };
            CartesianChart.OrientationProperty = DependencyProperty.Register("Orientation", function () { return DataVis.Axis; }, CartesianChart, undefined, function (d, args) { return d._OnOrientationChanged(args); });
            CartesianChart.XAxisProperty = DependencyProperty.Register("XAxis", function () { return DataVis.Axis; }, CartesianChart, undefined, function (d, args) { return d._OnXAxisChanged(args); });
            CartesianChart.YAxisProperty = DependencyProperty.Register("YAxis", function () { return DataVis.Axis; }, CartesianChart, undefined, function (d, args) { return d._OnYAxisChanged(args); });
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
                _super.prototype.OnSizeChanged.call(this, sender, e);
                if (this._xap)
                    this._xap.UpdateSize(e.NewSize);
                if (this._yap)
                    this._yap.UpdateSize(e.NewSize);
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
                _super.apply(this, arguments);
            }
            BiSeries.prototype.CreatePresenter = function () {
                return new DataVis.BiSeriesPresenter(this);
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
/// <reference path="../../SeriesPresenter.ts" />
var Fayde;
(function (Fayde) {
    var DataVis;
    (function (DataVis) {
        var BiSeriesPresenter = (function (_super) {
            __extends(BiSeriesPresenter, _super);
            function BiSeriesPresenter(series) {
                _super.call(this, series);
                this._DepValueSet = new DataVis.ValueSet();
                this._IndValueSet = new DataVis.ValueSet();
            }
            BiSeriesPresenter.prototype.OnItemsAdded = function (items, index) {
                _super.prototype.OnItemsAdded.call(this, items, index);
                var dvs = this._DepValueSet;
                var ivs = this._IndValueSet;
                for (var i = 0, len = items.length; i < len; i++) {
                    dvs.Insert(items[i], i + index);
                    ivs.Insert(items[i], i + index);
                }
            };
            BiSeriesPresenter.prototype.OnItemsRemoved = function (items, index) {
                _super.prototype.OnItemsRemoved.call(this, items, index);
                var dvs = this._DepValueSet;
                var ivs = this._IndValueSet;
                for (var i = 0, len = items.length; i < len; i++) {
                    dvs.RemoveAt(i + index);
                    ivs.RemoveAt(i + index);
                }
            };
            BiSeriesPresenter.prototype.OnDependentValuePathChanged = function (path) {
                this._DepValueSet.Walker = new Fayde.Data.PropertyPathWalker(path, true, false, false);
                this._DepValueSet.UpdateWalker(this.Items);
            };
            BiSeriesPresenter.prototype.OnIndependentValuePathChanged = function (path) {
                this._IndValueSet.Walker = new Fayde.Data.PropertyPathWalker(path, true, false, false);
                this._IndValueSet.UpdateWalker(this.Items);
            };
            BiSeriesPresenter.prototype.GetIndependentValue = function (index) {
                return this._IndValueSet.Values[index];
            };
            BiSeriesPresenter.prototype.InterpolateIndependent = function (axis, index) {
                var vs = this._IndValueSet;
                var t = axis.Parameterizer.Parameterize(vs, vs.Values[index]);
                var i = axis.Interpolate(t);
                return i;
            };
            BiSeriesPresenter.prototype.GetDependentValue = function (index) {
                return this._DepValueSet.Values[index];
            };
            BiSeriesPresenter.prototype.InterpolateDependent = function (axis, index) {
                var vs = this._DepValueSet;
                var t = axis.Parameterizer.Parameterize(vs, vs.Values[index]);
                var d = axis.Interpolate(t);
                return d;
            };
            return BiSeriesPresenter;
        })(DataVis.SeriesPresenter);
        DataVis.BiSeriesPresenter = BiSeriesPresenter;
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
        var LineSeriesPresenter = (function (_super) {
            __extends(LineSeriesPresenter, _super);
            function LineSeriesPresenter(series) {
                _super.call(this, series);
                this._Line = new Fayde.Shapes.Polyline();
                this.DefaultStyleKey = LineSeriesPresenter;
                this.Children.Add(this._Line);
            }
            LineSeriesPresenter.prototype._OnLineStyleChanged = function (args) {
                this._Line.Style = args.NewValue;
            };
            LineSeriesPresenter.prototype.OnSizeChanged = function (newSize) {
                var ci = this.ChartInfo;
                if (ci) {
                    ci.XAxis.Presenter.UpdateScale();
                    ci.YAxis.Presenter.UpdateScale();
                }
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
                if (ci.Orientation === 1 /* Transposed */) {
                    return new Point(this.InterpolateDependent(ci.XAxis, index), this.InterpolateIndependent(ci.YAxis, index));
                }
                else {
                    return new Point(this.InterpolateIndependent(ci.XAxis, index), this.InterpolateDependent(ci.YAxis, index));
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
            LinearAxis.prototype.OnMinimumChanged = function (oldValue, newValue) {
                this.Parameterizer.Minimum = newValue;
            };
            LinearAxis.prototype.OnMaximumChanged = function (oldValue, newValue) {
                this.Parameterizer.Maximum = newValue;
            };
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
            LinearAxis.prototype.CreatePresenter = function () {
                return new DataVis.LinearAxisPresenter();
            };
            LinearAxis.prototype.CreateParameterizer = function () {
                return new DataVis.LinearParameterizer();
            };
            LinearAxis.MinimumProperty = DependencyProperty.Register("Minimum", function () { return Number; }, LinearAxis, undefined, function (d, args) { return d.OnMinimumChanged(args.OldValue, args.NewValue); });
            LinearAxis.MaximumProperty = DependencyProperty.Register("Maximum", function () { return Number; }, LinearAxis, undefined, function (d, args) { return d.OnMaximumChanged(args.OldValue, args.NewValue); });
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
            LinearAxisPresenter.prototype.UpdateScale = function () {
                var ls = this.Scale;
                if (ls instanceof DataVis.LinearScale) {
                    if (this.IsVertical) {
                        ls.RangeMin = this.ActualHeight;
                        ls.RangeMax = 0;
                    }
                    else {
                        ls.RangeMin = 0;
                        ls.RangeMax = this.ActualWidth;
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
            LinearParameterizer.prototype.Parameterize = function (vs, item) {
                var n = (item || 0).valueOf();
                var min = this.Minimum;
                if (min == null || isNaN(min))
                    min = vs.Min;
                var max = this.Maximum;
                if (max == null || isNaN(max))
                    max = vs.Max;
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
        var LinearScale = (function (_super) {
            __extends(LinearScale, _super);
            function LinearScale() {
                _super.apply(this, arguments);
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
        })(Fayde.DependencyObject);
        DataVis.LinearScale = LinearScale;
    })(DataVis = Fayde.DataVis || (Fayde.DataVis = {}));
})(Fayde || (Fayde = {}));
//# sourceMappingURL=fayde.datavis.js.map