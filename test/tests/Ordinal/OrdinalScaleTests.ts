import OrdinalScale = Fayde.DataVis.OrdinalScale;
import Spacing = Fayde.DataVis.Spacing;
import SpacingType = Fayde.DataVis.SpacingType;

export function load () {
    QUnit.module('Ordinal Scale Tests');

    QUnit.test("GetBand", (assert) => {
        var scale = new OrdinalScale();
        scale.RangeMin = 0;
        scale.RangeMax = 200;
        var band = scale.GetBand(10, null, 10);
        QUnit.deepEqual(band, [0, 20]);

        band = scale.GetBand(123, nullstone.convertAnyToType("10%", Spacing), 10);
        QUnit.deepEqual(band, [114, 18]);
    });
}