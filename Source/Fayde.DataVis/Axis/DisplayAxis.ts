module Fayde.DataVis {
    import Grid = Fayde.Controls.Grid;
    import RotateTransform = Fayde.Media.RotateTransform;
    import RowDefinition = Fayde.Controls.RowDefinition;
    import ColumnDefinition = Fayde.Controls.ColumnDefinition;

    export class DisplayAxis extends Axis implements IRequireSeriesHost {
        static AxisLabelStyleProperty = DependencyProperty.Register("AxisLabelStyle", () => Style, DisplayAxis, undefined, (d, args) => (<DisplayAxis>d).OnAxisLabelStyleChanged(args.OldValue, args.NewValue));
        static MajorTickMarkStyleProperty = DependencyProperty.Register("MajorTickMarkStyle", () => Style, DisplayAxis, undefined, (d, args) => (<DisplayAxis>d).OnMajorTickMarkStyleChanged(args.OldValue, args.NewValue));
        static TitleProperty = DependencyProperty.Register("Title", () => Object, DisplayAxis, undefined, (d, args) => (<DisplayAxis>d).OnTitleChanged(args.OldValue, args.NewValue));
        static TitleStyleProperty = DependencyProperty.Register("TitleStyle", () => Style, DisplayAxis);
        static ShowGridLinesProperty = DependencyProperty.Register("ShowGridLines", () => Boolean, DisplayAxis, false, (d, args) => (<DisplayAxis>d).OnShowGridLinesChanged(args.OldValue, args.NewValue));
        static GridLineStyleProperty = DependencyProperty.Register("GridLineStyle", () => Style, DisplayAxis);
        AxisLabelStyle: Style;
        MajorTickMarkStyle: Style;
        Title: any;
        TitleStyle: Style;
        ShowGridLines: boolean;
        GridLineStyle: Style;

        OnAxisLabelStyleChanged(oldValue: Style, newValue: Style) { }
        OnMajorTickMarkStyleChanged(oldValue: Style, newValue: Style) { }
        OnTitleChanged(oldValue: any, newValue: any) {
            if (this._AxisTitle)
                this._AxisTitle.Content = newValue;
        }
        OnShowGridLinesChanged(oldValue: boolean, newValue: boolean) {
            this._ShowGridLines(newValue);
        }

        get ActualLength(): number {
            return this.GetLength(size.fromRaw(this.ActualWidth, this.ActualHeight));
        }

        private _GridLines: DisplayAxisGridLines = null;
        get GridLines() { return this._GridLines; }
        set GridLines(value: DisplayAxisGridLines) {
            if (value === this._GridLines)
                return;
            var old = this._GridLines;
            this._GridLines = value;
            this.OnGridLinesChanged(old, this._GridLines);
        }
        OnGridLinesChanged(oldValue: DisplayAxisGridLines, newValue: DisplayAxisGridLines) {
            var sh = this.SeriesHost;
            if (sh != null && oldValue != null)
                sh.BackgroundElements.Remove(oldValue);
            if (sh == null || newValue == null)
                return;
            sh.BackgroundElements.Add(newValue);
        }

        private _SeriesHost: ISeriesHost = null;
        get SeriesHost(): ISeriesHost { return this._SeriesHost; }
        set SeriesHost(value: ISeriesHost) {
            var old = this._SeriesHost;
            this._SeriesHost = value;
            if (this._SeriesHost !== old)
                this.OnSeriesHostChanged(old, this._SeriesHost);
        }
        OnSeriesHostChanged(oldValue: ISeriesHost, newValue: ISeriesHost) {
            if (oldValue != null && this.GridLines != null)
                oldValue.BackgroundElements.Remove(this.GridLines);
            if (newValue == null || this.GridLines == null)
                return;
            newValue.BackgroundElements.Add(this.GridLines);
        }

        private _AxisGrid: Grid = null;
        private get AxisGrid(): Grid { return this._AxisGrid; }
        private set AxisGrid(value: Grid) {
            if (value === this._AxisGrid)
                return;
            if (this._AxisGrid)
                this._AxisGrid.Children.Clear();
            this._AxisGrid = value;
            if (this._AxisGrid) {
                this._AxisGrid.Children.Add(this.OrientedPanel);
                if (this._AxisTitle)
                    this._AxisGrid.Children.Add(this._AxisTitle);
            }
        }

        private _AxisTitle: Title = null;
        private get AxisTitle(): Title { return this._AxisTitle; }
        private set AxisTitle(value: Title) {
            if (this._AxisTitle === value)
                return;
            if (this._AxisTitle)
                this._AxisTitle.Content = null;
            this._AxisTitle = value;
            if (this.Title)
                this._AxisTitle.Content = this.Title;
        }

        private _TitleLayoutTransformControl: Internal.LayoutTransformControl = null;
        private _DependentAxisGrid: Grid = null;

        OrientedPanel: OrientedPanel;

        constructor() {
            super();
            this.DefaultStyleKey = (<any>this).constructor;

            Object.defineProperty(this, "OrientedPanel", { value: new OrientedPanel(), writable: false });
            this.OrientedPanel.UseLayoutRounding = true;
            this._DependentAxisGrid = new Grid();
            this._TitleLayoutTransformControl = new Internal.LayoutTransformControl();
            this._TitleLayoutTransformControl.HorizontalAlignment = HorizontalAlignment.Center;
            this._TitleLayoutTransformControl.VerticalAlignment = VerticalAlignment.Center;
            this.SizeChanged.Subscribe(this._OnSizeChanged, this);
        }

        OnApplyTemplate() {
            super.OnApplyTemplate();
            this.AxisGrid = <Grid>this.GetTemplateChild("AxisGrid", Grid);
            this.AxisTitle = <Title>this.GetTemplateChild("AxisTitle", Title);
            if (this._AxisTitle && this._AxisGrid.Children.Contains(this._AxisTitle)) {
                this._AxisGrid.Children.Remove(this._AxisTitle);
                this._TitleLayoutTransformControl.Child = this._AxisTitle;
                this._AxisGrid.Children.Add(this._TitleLayoutTransformControl);
            }
            this.ArrangeAxisGrid();
        }

        private _OnSizeChanged(sender: any, e: SizeChangedEventArgs) {
            if (e.PreviousSize.Width !== 0.0 || e.PreviousSize.Height !== 0.0)
                return;
            this.Invalidate();
        }

        MeasureOverride(availableSize: size) {
            this.RenderAxis(availableSize);
            return super.MeasureOverride(availableSize);
        }

        OnLocationChanged(oldLocation: AxisLocation, newLocation: AxisLocation) {
            this.ArrangeAxisGrid();
            super.OnLocationChanged(oldLocation, newLocation);
        }
        OnOrientationChanged(oldOrientation: AxisOrientation, newOrientation: AxisOrientation) {
            this.ArrangeAxisGrid();
            super.OnOrientationChanged(oldOrientation, newOrientation);
        }
        OnDependentAxesCollectionChanged() {
            this._ShowGridLines(this.ShowGridLines);
            super.OnDependentAxesCollectionChanged();
        }

        GetLength(availableSize: size): number {
            if (this.ActualHeight === 0.0 && this.ActualWidth === 0.0)
                return 0.0;
            if (this.Orientation === AxisOrientation.X)
                return availableSize.Width;
            if (this.Orientation === AxisOrientation.Y)
                return availableSize.Height;
            throw new InvalidOperationException("Cannot determine length with no orientation.");
        }

        GetMajorGridLinePositions(): IEnumerable<UnitValue> {
            return this.GetMajorGridLineCoordinates(size.fromRaw(this.ActualWidth, this.ActualHeight));
        }
        GetMajorGridLineCoordinates(availableSize: size): IEnumerable<UnitValue> {
            return ArrayEx.AsEnumerable(<UnitValue[]>[]);
        }

        private _ShowGridLines(isShown: boolean) {
            this.GridLines = (isShown) ? new OrientedAxisGridLines(this) : null;
        }

        CreateMajorTickMark(): Shapes.Line {
            return this.CreateTickMark(this.MajorTickMarkStyle);
        }
        CreateTickMark(style: Style): Shapes.Line {
            var line = new Shapes.Line();
            line.Style = style;
            if (this.Orientation === AxisOrientation.Y) {
                line.Y1 = 0.5;
                line.Y2 = 0.5;
            } else if (this.Orientation === AxisOrientation.X) {
                line.X1 = 0.5;
                line.X2 = 0.5;
            }
            return line;
        }

        CreateAxisLabel(): Fayde.Controls.Control {
            return new AxisLabel();
        }
        PrepareAxisLabel(label: Fayde.Controls.Control, dataContext: any) {
            label.DataContext = dataContext;
            label.Style = this.AxisLabelStyle;
        }

        ArrangeAxisGrid() {
            var ag = this._AxisGrid;
            if (ag == null)
                return;
            var at = this._AxisTitle;
            var location = this.Location;
            var op = this.OrientedPanel;
            var titleXformCtrl = this._TitleLayoutTransformControl;

            ag.ColumnDefinitions.Clear();
            ag.RowDefinitions.Clear();
            ag.Children.Clear();
            if (this.Orientation === AxisOrientation.Y) {
                op.Orientation = Orientation.Vertical;
                op.IsReversed = true;
                if (location === AxisLocation.Left || location === AxisLocation.Right) {
                    var rotateTransform1 = new RotateTransform();
                    rotateTransform1.Angle = -90.0;
                    var rotateTransform2 = rotateTransform1;
                    titleXformCtrl.Transform = rotateTransform2;
                    op.IsInverted = location !== AxisLocation.Right;
                    ag.ColumnDefinitions.Add(new ColumnDefinition());
                    ag.RowDefinitions.Add(new RowDefinition());
                    var num = 0;
                    if (at != null) {
                        ag.ColumnDefinitions.Add(new ColumnDefinition());
                        Grid.SetRow(titleXformCtrl, 0);
                        Grid.SetColumn(titleXformCtrl, 0);
                        ++num;
                    }
                    Grid.SetRow(op, 0);
                    Grid.SetColumn(op, num);
                    ag.Children.Add(titleXformCtrl);
                    ag.Children.Add(op);
                    if (location === AxisLocation.Right) {
                        mirror(ag, Orientation.Vertical);
                        var rotateTransform3 = new RotateTransform();
                        rotateTransform3.Angle = 90.0;
                        titleXformCtrl.Transform = rotateTransform3;
                    }
                }
            } else if (this.Orientation === AxisOrientation.X) {
                op.Orientation = Orientation.Horizontal;
                op.IsReversed = false;
                if (location === AxisLocation.Top || location === AxisLocation.Bottom) {
                    op.IsInverted = location === AxisLocation.Top;
                    var rotateTransform1 = new RotateTransform();
                    rotateTransform1.Angle = 0.0;
                    titleXformCtrl.Transform = rotateTransform1;
                    ag.ColumnDefinitions.Add(new ColumnDefinition());
                    ag.RowDefinitions.Add(new RowDefinition());
                    if (at != null) {
                        ag.RowDefinitions.Add(new RowDefinition());
                        Grid.SetColumn(titleXformCtrl, 0);
                        Grid.SetRow(titleXformCtrl, 1);
                    }
                    Grid.SetColumn(op, 0);
                    Grid.SetRow(op, 0);
                    ag.Children.Add(titleXformCtrl);
                    ag.Children.Add(op);
                    if (location === AxisLocation.Top)
                        mirror(ag, Orientation.Horizontal);
                }
            }
            this.Invalidate();
        }

        Invalidate() {
            this.OnInvalidated(new RoutedEventArgs());
        }
        OnInvalidated(args: RoutedEventArgs) {
            this.InvalidateMeasure();
            super.OnInvalidated(args);
        }
        RenderAxis(availableSize: size) {
            if (this.Orientation === AxisOrientation.None || this.Location === AxisLocation.Auto)
                return;
            this.Render(availableSize);
        }
        Render(availableSize: size) { }
    }

    function mirror(grid: Grid, orientation: Orientation) {
        if (orientation === Orientation.Horizontal) {
            var rowdefs = grid.RowDefinitions.ToArray().reverse();
            grid.RowDefinitions.Clear();
            for (var enumerator = grid.Children.GetEnumerator(); enumerator.MoveNext();) {
                Grid.SetRow(enumerator.Current, rowdefs.length - 1 - Grid.GetRow(enumerator.Current));
            }
            for (var i = 0, len = rowdefs.length; i < len; i++) {
                grid.RowDefinitions.Add(rowdefs[i]);
            }
        } else if (orientation === Orientation.Vertical) {
            var coldefs = grid.ColumnDefinitions.ToArray().reverse();
            grid.ColumnDefinitions.Clear();
            for (var enumerator = grid.Children.GetEnumerator(); enumerator.MoveNext();) {
                Grid.SetColumn(enumerator.Current, coldefs.length - 1 - Grid.GetColumn(enumerator.Current));
            }
            for (var i = 0, len = coldefs.length; i < len; i++) {
                grid.ColumnDefinitions.Add(coldefs[i]);
            }
        }
    }
}