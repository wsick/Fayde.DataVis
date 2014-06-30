module Fayde.DataVis {
    export class ListenCollection<T extends XamlObject> extends XamlObjectCollection<T> {
        private _Listeners: ICollectionNotifier[] = [];

        Listen(onItemAdded: (item: T, index?: number) => void, onItemRemoved: (item: T, index?: number) => void): ICollectionListener {
            var l: ICollectionNotifier = {
                Unlisten: undefined,
                OnItemAdded: onItemAdded,
                OnItemRemoved: onItemRemoved
            };
            l.Unlisten = () => {
                var index = this._Listeners.indexOf(l);
                if (index > -1)
                    this._Listeners.splice(index, 1);
            };
            this._Listeners.push(l);
            return l;
        }

        _RaiseItemAdded(value: T, index: number) {
            this._NotifyAdded(value, index);
        }
        _RaiseItemRemoved(value: T, index: number) {
            this._NotifyRemoved(value, index);
        }
        _RaiseItemReplaced(removed: T, added: T, index: number) {
            this._NotifyRemoved(removed, index);
            this._NotifyAdded(added, index);
        }
        _RaiseCleared(old: T[]) {
            for (var i = 0; i < old.length; i++) {
                this._NotifyRemoved(old[i], i);
            }
        }

        private _NotifyAdded(item: T, index: number) {
            for (var i = 0, ls = this._Listeners.slice(0), len = ls.length; i < len; i++) {
                ls[i].OnItemAdded(item, index);
            }
        }
        private _NotifyRemoved(item: T, index: number) {
            for (var i = 0, ls = this._Listeners.slice(0), len = ls.length; i < len; i++) {
                ls[i].OnItemRemoved(item, index);
            }
        }
    }

    export interface ICollectionListener {
        Unlisten();
    }
    interface ICollectionNotifier extends ICollectionListener {
        OnItemAdded(item: any, index: number);
        OnItemRemoved(item: any, index: number);
    }
}