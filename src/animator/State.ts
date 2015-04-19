/**
 * Created by Wonder Yue
 * Date 2015-04-02
 */
module animator{
    export class State{
        private _transitionArray:Array<Transition> = [];
        private _id:string;
        private _animation:string;

        public constructor(id:string, animation:string){
            this._id = id;
            this._animation = animation;
        }

        public get id():string{
            return this._id;
        }

        public get animation():string{
            return this._animation;
        }

        public addTransition(transtion:Transition){
            this._transitionArray.push(transtion);
        }

        public tryTransition(id:string,value:any):string {
            for (var i = 0; i < this._transitionArray.length; i++){
                var transtion:Transition = this._transitionArray[i];
                if(transtion.isSatisfied(id,value)){
                    return transtion.nextStateId;
                }
            }
            return null;
        }
    }
}