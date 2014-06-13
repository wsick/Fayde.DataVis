module Fayde.DataVis {
    export interface ICategoryAxis extends IAxis, IDataConsumer {
        GetPlotAreaCoordinateRange(category: any): Range<UnitValue>;
        GetCategoryAtPosition(position: UnitValue): any;
    }

    import Grid = Fayde.Controls.Grid;
    import Range = Internal.Range;

    export class CategoryAxis extends DisplayAxis implements ICategoryAxis, IAxis, IDataConsumer {
        static SortOrderProperty = DependencyProperty.Register("SortOrder", () => new Enum(CategorySortOrder), CategoryAxis, CategorySortOrder.None, (d, args) => (<CategoryAxis>d)._OnSortOrderChanged(args));
        SortOrder: CategorySortOrder;
        private _OnSortOrderChanged(args: IDependencyPropertyChangedEventArgs) {
            this.Invalidate();
        }

        private _Categories: any[] = [];
        private _GridLineCoordinatesToDisplay: UnitValue[] = [];
        private _LabelPool: Internal.ObjectPool<Controls.Control>;
        private _MajorTickMarkPool: Internal.ObjectPool<Shapes.Line>;

        constructor() {
            super();
            this._LabelPool = new Internal.ObjectPool<Controls.Control>(() => this.CreateAxisLabel());
            this._MajorTickMarkPool = new Internal.ObjectPool<Shapes.Line>(() => this.CreateMajorTickMark());
        }

        DataChanged(dataProvider: IDataProvider, data: IEnumerable<any>) {
            this._UpdateCategories();
        }

        CanPlot(value: any): boolean {
            return true;
        }

        Render(availableSize: size) {
            this._RenderOriented(availableSize);
        }
        private _RenderOriented(availableSize: size) {
            var addLine = (pos: number) => {
                var line = this._MajorTickMarkPool.Next();
                OrientedPanel.SetCenterCoordinate(line, pos);
                OrientedPanel.SetPriority(line, 0);
                this._GridLineCoordinatesToDisplay.push(new UnitValue(pos, Unit.Pixels));
                this.OrientedPanel.Children.Add(line);
            };
            this._LabelPool.Reset();
            this._MajorTickMarkPool.Reset();
            try {
                this.OrientedPanel.Children.Clear();
                this._GridLineCoordinatesToDisplay.length = 0;
                if (this._Categories.length <= 0)
                    return;
                var num1 = Math.max(this.GetLength(availableSize) - 1.0, 0.0);
                var num2 = 0;
                var num3 = 0;
                for (var i = 0, cat = this._Categories, len = cat.length; i < len; i++) {
                    var axisLabel = this.CreateAndPrepareAxisLabel(cat[i]);
                    var num4 = num2 * num1 / this._Categories.length + 0.5;
                    var num5 = (num2 + 1) * num1 / this._Categories.length + 0.5;
                    addLine(num4);
                    OrientedPanel.SetCenterCoordinate(axisLabel, (num4 + num5) / 2.0);
                    OrientedPanel.SetPriority(axisLabel, num3 + 1);
                    this.OrientedPanel.Children.Add(axisLabel);
                    ++num2;
                    num3 = (num3 + 1) % 2;
                }
                addLine(num1 + 0.5);
            } finally {
                this._LabelPool.Done();
                this._MajorTickMarkPool.Done();
            }
        }

        OnObjectRegistered(series: IAxisListener) {
            super.OnObjectRegistered(series);
            if (!IDataProvider_.Is(series))
                return;
            this._UpdateCategories();
        }
        OnObjectUnregistered(series: IAxisListener) {
            super.OnObjectUnregistered(series);
            if (!IDataProvider_.Is(series))
                return;
            this._UpdateCategories();
        }

        GetPlotAreaCoordinateRange(category: any): Range<UnitValue> {
            if (category == null)
                throw new ArgumentNullException("category");
            var num1 = this._Categories.indexOf(category);
            if (num1 === -1)
                return new Range<UnitValue>();
            if (this.Orientation === AxisOrientation.X || this.Orientation === AxisOrientation.Y) {
                var num2 = Math.max(this.ActualLength - 1.0, 0.0);
                var num3 = num1 * num2 / this._Categories.length;
                var num4 = (num1 + 1) * num2 / this._Categories.length;
                if (this.Orientation === AxisOrientation.X)
                    return new Range<UnitValue>(new UnitValue(num3, Unit.Pixels), new UnitValue(num4, Unit.Pixels));
                if (this.Orientation === AxisOrientation.Y)
                    return new Range<UnitValue>(new UnitValue(num2 - num4, Unit.Pixels), new UnitValue(num2 - num3, Unit.Pixels));
                return new Range<UnitValue>();
            } else {
                var num3 = (360 / this._Categories.length);
                var num4 = num3 / 2.0;
                var num6 = 270.0 + this._Categories.indexOf(category) * num3;
                return new Range<UnitValue>(new UnitValue(num6 - num4, Unit.Degrees), new UnitValue(num6 + num4, Unit.Degrees));
            }
        }

        GetMajorGridLineCoordinates(availableSize: size): IEnumerable<UnitValue> {
            return ArrayEx.AsEnumerable(this._GridLineCoordinatesToDisplay);
        }

        GetPlotAreaCoordinate(value: any): UnitValue {
            if (value == null)
                throw new ArgumentNullException("value");
            var range = this.GetPlotAreaCoordinateRange(value);
            if (!range.HasData)
                return UnitValue.NaN;
            var num = range.Minimum.Value;
            return new UnitValue((range.Maximum.Value - num) / 2.0 + num, range.Minimum.Unit);
        }

        CreateAndPrepareAxisLabel(value: any): Controls.Control {
            var label = this._LabelPool.Next();
            this.PrepareAxisLabel(label, value);
            return label;
        }

        GetCategoryAtPosition(position: UnitValue): any {
            if (this.ActualLength === 0.0 || this._Categories.length === 0)
                return null;
            if (position.Unit !== Unit.Pixels)
                throw new NotSupportedException("Pixels Category");
            var index = Math.floor(position.Value / (this.ActualLength / this._Categories.length));
            if (index < 0 || index >= this._Categories.length)
                return null;
            if (this.Orientation === AxisOrientation.X)
                return this._Categories[index];
            return this._Categories[this._Categories.length - 1 - index];
        }

        private _UpdateCategories() {
            var categories = this._Categories = [];
            for (var enumerator = this.RegisteredListeners.GetEnumerator(); enumerator.MoveNext();) {
                var dp = IDataProvider_.As(enumerator.Current);
                for (var e2 = dp.GetData(this).GetEnumerator(); e2.MoveNext();) {
                    if (categories.indexOf(e2) < 0)
                        categories.push(e2);
                }
            }

            var sortOrder = this.SortOrder;
            if (this.SortOrder === CategorySortOrder.Ascending) {
                this._Categories.sort();
            } else if (this.SortOrder === CategorySortOrder.Descending) {
                this._Categories.sort();
                this._Categories = this._Categories.reverse();
            }
            this.Invalidate();
        }
    }
    Fayde.Controls.TemplateParts(CategoryAxis,
        { Name: "AxisGrid", Type: Grid },
        { Name: "AxisTitle", Type: Title });

    //[StyleTypedProperty(Property = "TitleStyle", StyleTargetType = typeof (Title))]
    //[StyleTypedProperty(Property = "GridLineStyle", StyleTargetType = typeof (Line))]
    //[StyleTypedProperty(Property = "MajorTickMarkStyle", StyleTargetType = typeof (Line))]
    //[StyleTypedProperty(Property = "AxisLabelStyle", StyleTargetType = typeof (AxisLabel))]
}