module Fayde.DataVis {
    export class LinearScale extends DependencyObject implements IScale {
        Map(item: any, domain: IRange<any>): number {
            return item;
        }
    }
} 