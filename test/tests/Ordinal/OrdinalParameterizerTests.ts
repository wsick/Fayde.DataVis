import OrdinalParameterizer = Fayde.DataVis.OrdinalParameterizer;
import ValueSet = Fayde.DataVis.ValueSet;

export function load () {
    QUnit.module('Ordinal Parameterizer Tests');

    QUnit.test("Parameterize", (assert) => {
        var para = new OrdinalParameterizer();

        var vs = new ValueSet();
        vs.Insert(24, 0);
        vs.Insert(1, 1);
        vs.Insert(25, 2);
        vs.Insert(16, 3);
        vs.Insert(8, 4);

        QUnit.strictEqual(para.Parameterize(vs, 0), 0.1);
        QUnit.strictEqual(para.Parameterize(vs, 1), 0.3);
        QUnit.strictEqual(para.Parameterize(vs, 2), 0.5);
        QUnit.strictEqual(para.Parameterize(vs, 3), 0.7);
        QUnit.strictEqual(para.Parameterize(vs, 4), 0.9);
    });
}