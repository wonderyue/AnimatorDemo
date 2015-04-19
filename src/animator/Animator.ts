/**
 * Created by Wonder Yue
 * Date 2015-04-02
 */
module animator{
    export class Animator{
        private _exitTime:number = 0.6; //���ζ����Ŀ��л�ʱ�䣬������ʱ����һ������ʱ��δ�ﵽ��ʱ��0.6ʱ�޷����ӵڶ���
        private _fsm:Fsm;
        private _armature:dragonBones.Armature;
        private _animationState:dragonBones.AnimationState;
        public static COMPLETE_TRIGGER:string = "complete";

        public constructor(armature:dragonBones.Armature, fsmFileName:string){
            this._armature = armature;
            var obj:Object = RES.getRes(fsmFileName);
            this._fsm = Fsm.create(obj["state"]);
            this._armature.userData = this;
            this._armature.addEventListener(dragonBones.AnimationEvent.COMPLETE, this.onComplete);
            this._animationState = this._armature.animation.gotoAndPlay(this._fsm.curState.animation);
        }

        public setParam(id:string, value:any):string{
            var stateId = this._fsm.setParam(id,value);
            if(stateId){
                if((this._animationState.playTimes > 0) && (this._animationState.currentTime / this._animationState.totalTime < this._exitTime)){

                } else {
                    this._fsm.curStateId = stateId;
                    this._animationState = this._armature.animation.gotoAndPlay(this._fsm.curState.animation);
                    return stateId;
                }
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