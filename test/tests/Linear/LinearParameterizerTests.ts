import LinearParameterizer = Fayde.DataVis.LinearParameterizer;
import ValueSet = Fayde.DataVis.ValueSet;

export function load () {
    QUnit.module('Linear Parameterizer Tests');

    QUnit.test("Parameterize", (assert) => {
        var para = new LinearParameterizer();

        var vs = new ValueSet();
        vs.Insert(24, 0);
        vs.Insert(1, 1);
        vs.Insert(25, 2);
        vs.Insert(16, 3);
        vs.Insert(9, 4);

        QUnit.strictEqual(para.Parameterize(vs, 0), 23 / 24);
        QUnit.strictEqual(para.Parameterize(vs, 1), 0);
        QUnit.strictEqual(para.Parameterize(vs, 2), 1);
        QUnit.strictEqual(para.Parameterize(vs, 3), 0.625);
        QUnit.strictEqual(para.Parameterize(vs, 4), 1 / 3);
    });
}