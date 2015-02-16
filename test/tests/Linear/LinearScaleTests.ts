import LinearScale = Fayde.DataVis.LinearScale;

export function load () {
    QUnit.module('Linear Scale Tests');

    QUnit.test("Evaluate", (assert) => {
        var scale = new LinearScale();
        scale.RangeMin = 0;
        scale.RangeMax = 200;
        QUnit.strictEqual(scale.Evaluate(0), 0);
        QUnit.strictEqual(scale.Evaluate(0.5), 100);
        QUnit.strictEqual(scale.Evaluate(1), 200);
    });
}