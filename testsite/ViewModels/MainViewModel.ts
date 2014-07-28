/// <reference path="../lib/Fayde/Fayde.d.ts" />

import WeatherItem = require("../Models/WeatherItem");

class MainViewModel extends Fayde.MVVM.ViewModelBase {
    LineTestData = [
        new WeatherItem(new DateTime(2014, 1, 1), 7.0),
        new WeatherItem(new DateTime(2014, 2, 1), 6.9),
        new WeatherItem(new DateTime(2014, 3, 1), 9.5),
        new WeatherItem(new DateTime(2014, 4, 1), 14.5),
        new WeatherItem(new DateTime(2014, 5, 1), 18.2),
        new WeatherItem(new DateTime(2014, 6, 1), 21.5),
        new WeatherItem(new DateTime(2014, 7, 1), 25.2),
        new WeatherItem(new DateTime(2014, 8, 1), 26.5),
        new WeatherItem(new DateTime(2014, 9, 1), 23.3),
        new WeatherItem(new DateTime(2014, 10, 1), 18.3),
        new WeatherItem(new DateTime(2014, 11, 1), 13.9),
        new WeatherItem(new DateTime(2014, 12, 1), 9.6)
    ];
}
export = MainViewModel;