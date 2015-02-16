module runner {
    var libpath = "lib/fayde.datavis/dist/fayde.datavis";
    var testModules = [
        ".build/tests/Ordinal/OrdinalScaleTests",
        ".build/tests/Linear/LinearScaleTests",
    ];

    Fayde.LoadConfigJson((config, err) => {
        if (err)
            console.warn("Error loading configuration file.", err);

        require([libpath], () => {
            require(testModules, (...modules: any[]) => {
                for (var i = 0; i < modules.length; i++) {
                    modules[i].load();
                }
                QUnit.load();
                QUnit.start();
            });
        });
    });
}