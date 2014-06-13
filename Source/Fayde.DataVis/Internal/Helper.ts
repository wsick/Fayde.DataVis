module Fayde.DataVis.Internal {
    export function Equals(obj1: any, obj2: any): boolean {
        if (obj1 === obj2)
            return true;
        if (obj1 == null || obj2 == null)
            return obj1 == null && obj2 == null;
        return obj1.valueOf() === obj2.valueOf();
    }

    export function OfInterface<T, TInterface>(enumerable: IEnumerable<T>, t: IInterfaceDeclaration<any>): IEnumerable<TInterface> {
        var arr = [];
        for (var enumerator = enumerable.GetEnumerator(); enumerator.MoveNext();) {
            if (t.Is(enumerator.Current))
                arr.push(enumerator.Current);
        }
        return ArrayEx.AsEnumerable(arr);
    }

    export function CanGraph(value: number): boolean {
        return !isNaN(value) && isFinite(value);
    }
} 