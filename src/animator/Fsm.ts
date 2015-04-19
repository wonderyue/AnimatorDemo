/**
 * Created by Wonder Yue
 * Date 2015-04-02
 */
module animator{
    /**
     * 状态机
     */
    export var ANYSTATE_ID:string = "anyState";
    export class Fsm{
        private _stateArray:Array<State> = [];
        private _curState:State = null;
        private _anyState:State = null;

        public constructor(){

        }

        public addState(state:State){
            if(state.id == ANYSTATE_ID){
                this._anyState = state;
            }else{
                this._stateArray.push(state);
            }
        }

        public set curState(state:State){
            this._curState = state;
        }

        public set curStateId(stateId:string){
            if(stateId) {
                var state = this.getStateById(stateId);
                this._curState = state;
            }
        }

        public get curState():State{
            return this._curState;
        }

        private getStateById(id:String):State{
            for (var i = 0; i < this._stateArray.length; i++) {
                var state:State = this._stateArray[i];
                if(state.id == id){
                    return state;
                }
            }
            return null;
        }
        //anyState判断优先级最低
        public setParam(id:string,value:any):string{
            var nextStateId:string = this._curState.tryTransition(id,value);
            if(!nextStateId && this._anyState){
                nextStateId = this._anyState.tryTransition(id,value);
            }
            if(nextStateId){
                return nextStateId;
            }
            return null;
        }

        public static create(stateObj:Object):Fsm{
            var fsm:Fsm = new Fsm();
            for(var stateKey in stateObj){
                var oneState = stateObj[stateKey];
                var state:State = new State(oneState["state"], oneState["animation"]);
                for(var transitionKey in oneState["transition"]){
                    var oneTransition = oneState["transition"][transitionKey];
                    var transition:Transition = new Transition(oneTransition["nextState"]);
                    for(var conditionKey in oneTransition["condition"]){
                        var oneCondition = oneTransition["condition"][conditionKey];
                        transition.addCondition(oneCondition["id"],oneCondition["type"],oneCondition["value"],oneCondition["logic"]);
                    }
                    state.addTransition(transition);
                }
                fsm.addState(state);
                if(oneState["default"]){
                    fsm.curState = state;
                }
            }
            return fsm;
        }
    }
}