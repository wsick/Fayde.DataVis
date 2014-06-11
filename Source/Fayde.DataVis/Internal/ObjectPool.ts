module Fayde.DataVis.Internal {
    export class ObjectPool<T>{
        private _Objects: T[];
        private _Traversing = false;
        private _CurrentIndex = 0;
        private _MinPoolSize: number;

        constructor(private _CreateObject: () => T, minPoolSize?: number) {
            this._MinPoolSize = minPoolSize || 0;
            this.Reset();
        }

        ForEachRemaining(action: (t: T) => void) {
            for (var i = 0, objs = this._Objects, len = objs.length; i++) {
                action(objs[i]);
            }
        }

        Next(): T {
            if (this._CurrentIndex === this._Objects.length)
                this._Objects.push(this._CreateObject());
            var obj: T = this._Objects[this._CurrentIndex];
            this._CurrentIndex++;
            return obj;
        }

        Reset() {
            this._Traversing = true;
            this._CurrentIndex = 0;
        }

        Done() {
            this._Traversing = false;
            if (this._CurrentIndex === 0 || this._Objects.length <= 0 || this._CurrentIndex < this._MinPoolSize || this._CurrentIndex >= this._Objects.length / 2)
                return;
            this._Objects.splice(this._CurrentIndex, this._Objects.length - this._CurrentIndex);
        }

        Clear() {
            this._Objects = new Array(this._MinPoolSize);
        }
    }
}