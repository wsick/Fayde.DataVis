export function load () {
    QUnit.module('Test 1');

    QUnit.test("Basic test", (assert) => {
        assert.ok(true);
    });
}