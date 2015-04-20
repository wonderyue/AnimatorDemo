/**
 * Created by Wonder Yue
 * Date 2015-04-19
 */
class ControlButton extends egret.gui.SkinnableComponent{
    public attackBtn:egret.gui.Button;
    public runBtn:egret.gui.Button;
    public hitBtn:egret.gui.Button;
    private _fsm:animator.Animator;

    public constructor(animator:animator.Animator){
        super();
        this._fsm = animator;
        this.skinName = "skins.custom.ControlButtonSkin";
        this.addEventListener(egret.gui.UIEvent.CREATION_COMPLETE,this.onComplete,this);
    }

    private onComplete(e:egret.gui.UIEvent){
        this.attackBtn.addEventListener(egret.TouchEvent.TOUCH_TAP,this.buttonTouchEventHandler,this);
        this.runBtn.addEventListener(egret.TouchEvent.TOUCH_BEGIN,this.buttonTouchEventHandler,this);
        this.runBtn.addEventListener(egret.TouchEvent.TOUCH_END,this.buttonTouchEventHandler,this);
        this.hitBtn.addEventListener(egret.TouchEvent.TOUCH_TAP,this.buttonTouchEventHandler,this);
    }

    private buttonTouchEventHandler(e:egret.TouchEvent):void{
        if(e.target == this.attackBtn)
        {
            this._fsm.setTrigger("attack");
        }else if(e.target == this.runBtn)
        {
            if(e.type == egret.TouchEvent.TOUCH_BEGIN){
                this._fsm.setParam("walk",true);
            }else if(e.type == egret.TouchEvent.TOUCH_END){
                this._fsm.setParam("walk",false);
            }
        }else if(e.target == this.hitBtn)
        {
            this._fsm.setTrigger("hit");
        }
    }
}