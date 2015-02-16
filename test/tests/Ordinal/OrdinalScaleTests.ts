export function load () {
    QUnit.module('Ordinal Scale Tests');

    QUnit.test("GetBand", (assert) => {
        var scale = new Fayde.DataVis.OrdinalScale();
        scale.RangeMin = 0;
        scale.RangeMax = 200;
        var band = scale.GetBand(10, null, 10);
        QUnit.strictEqual(band[0], 0);
        QUnit.strictEqual(band[1], 20);
    });
}