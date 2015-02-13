## Axis Notes

An axis is composed of a `IParameterizer`, `IScale`, and `AxisPresenter`.

Mathematically, let `p(x)` be a parameterizer and `f(t)` be a scale. `v(x) = f(p(x)` where `v(x)` is a vector application of the axis.

* `IParameterizer` is responsible for taking input data sets, `IValueSet`, and mapping a particular item at `index` into a normalized range.
    * `Parameterize(vs: IValueSet, index: number): number` - maps datum at `index` to normalized range.
    * Ranges
        * Linear: [0, 1]
        * Ordinal: [0, 1)
        * Polar: [0, 2 * PI)
* `IScale` is responsible for taking a normalized range and mapping to screen.
    * `Evaluate(t: number): number[]` - maps normalized `t` to output vector `[x, y]`.
    * Ranges
        * Linear: If horizontal, x-range: [0, ActualWidth]; if vertical, y-range: [ActualHeight, 0]
        * Polar: x-range: [0, ActualWidth]; y-range: [ActualHeight, 0]

Some scales may have extra functionality.  As an example, Ordinal has `GetBandSize`.

* `AxisPresenter` is responsible for presenting the visuals for an axis.  For a horizontal linear axis, this may include tick marks and a horizontal line.  Each `AxisPresenter` can be styled in a theme or through a style.
