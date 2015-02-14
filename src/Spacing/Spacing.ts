module Fayde.DataVis {
    export class Spacing extends DependencyObject {
        static LengthProperty = DependencyProperty.Register("Length", () => Number, Spacing, 0);
        static TypeProperty = DependencyProperty.Register("Type", () => new Enum(SpacingType), Spacing, SpacingType.Pixel);
        Length: number;
        Type: SpacingType;

        Evaluate (bandSize: number): number {
            switch (this.Type) {
                case SpacingType.Percent:
                    return bandSize * this.Length;
                    break;
                default:
                case SpacingType.Pixel:
                    return this.Length;
            }
        }
    }
    nullstone.registerTypeConverter(Spacing, (o: any): Spacing => {
        if (o == null || o instanceof Spacing)
            return o;
        if (typeof o === "string") {
            var spacing = new Spacing();
            if (o[o.length - 1] === "%") {
                spacing.Type = SpacingType.Percent;
                spacing.Length = parseFloat(o);
            } else {
                spacing.Type = SpacingType.Pixel;
                spacing.Length = parseFloat(o);
            }
            return spacing;
        }
        return undefined;
    });
}