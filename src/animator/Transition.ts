/**
 * Created by Wonder Yue
 * Date 2015-04-02
 */
module animator{
    enum ConditionType {
        COMPLETE,
        BOOL,
        NUMBER,
        TRIGGER
    };

    enum LogicType {
        EQUAL,
        GREATER,
        LESS,
        NOTEQUAL
    };

    class Condition{
        private _id:string;
        private _type:ConditionType;
        private _value:any;
        private _logic:LogicType;
        public constructor(id:string,type:ConditionType,value:any,logic:LogicType){
            this._id = id;
            this._type = type;
            this._value = value;
            this._logic = logic;
        }

        public get id():string{
            return this._id;
        }

        public isSatisfied(value:any){
            if(this._type == ConditionType.TRIGGER || this._type == ConditionType.COMPLETE){
                return true;
            }
            switch (this._logic) {
                case LogicType.EQUAL:
                    return value == this._value;
                    break;
                case LogicType.GREATER:
                    return value > this._value;
                    break;
                case LogicType.LESS:
                    return value < this._value;
                    break;
                case LogicType.NOTEQUAL:
                    return value != this._value;
                    break;
                default :
                    return false;
                    break;
            }
        }
    }

    export class Transition{
        private _conditionArray:Array<Condition> = [];
        private _nextStateId:string;

        public constructor(nextState:string){
            this._nextStateId = nextState;
        }

        public get nextStateId():string{
            return this._nextStateId;
        }

        public addCondition(id:string,type:ConditionType,value:any,logic:LogicType){
            this._conditionArray.push(new Condition(id,type,value,logic));
        }

        public isSatisfied(id:string,value:any) {
            for (var i = 0; i < this._conditionArray.length; i++){
                var condition:Condition = this._conditionArray[i];
                if(condition.id == id){
                    return condition.isSatisfied(value);
                }
            }
            return false;
        }
    }
}