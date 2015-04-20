/**
 * Created by Wonder Yue
 * Date 2015-04-02
 */
module animator{
    export class Animator{
        private _fsm:Fsm;
        private _armature:dragonBones.Armature;
        private _animationState:dragonBones.AnimationState;
        public static COMPLETE_TRIGGER:string = "complete";

        public constructor(armature:dragonBones.Armature, fsmFileName:string){
            this._armature = armature;
            var obj:Object = RES.getRes(fsmFileName);
            this._fsm = Fsm.create(obj["state"]);
            this._armature.userData = this;
            this._animationState = this._armature.animation.gotoAndPlay(this._fsm.curState.animation);
            this._armature.animation._advanceTime(0);
            this._armature.addEventListener(dragonBones.AnimationEvent.COMPLETE, this.onComplete);
            dragonBones.WorldClock.clock.add(this._armature);
            egret.Ticker.getInstance().register(function (advancedTime) {
                dragonBones.WorldClock.clock.advanceTime(advancedTime / 1000);
            }, this);
        }

        public setParam(id:string, value:any):string{
            var stateId = this._fsm.setParam(id,value);
            if(stateId){
                this._fsm.curStateId = stateId;
                this._animationState = this._armature.animation.gotoAndPlay(this._fsm.curState.animation);
                return stateId;
            }
            return null;
        }

        public setTrigger(id:string){
            this.setParam(id,null);
        }

        public onComplete(e:dragonBones.AnimationEvent){
            console.log(e.animationName);
            var animator:animator.Animator = <animator.Animator>e.armature.userData;
            animator.setTrigger(Animator.COMPLETE_TRIGGER);
        }
    }
}