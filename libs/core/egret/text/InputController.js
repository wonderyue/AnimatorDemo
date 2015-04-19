/**
 * Copyright (c) 2014,Egret-Labs.org
 * All rights reserved.
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 *     * Redistributions of source code must retain the above copyright
 *       notice, this list of conditions and the following disclaimer.
 *     * Redistributions in binary form must reproduce the above copyright
 *       notice, this list of conditions and the following disclaimer in the
 *       documentation and/or other materials provided with the distribution.
 *     * Neither the name of the Egret-Labs.org nor the
 *       names of its contributors may be used to endorse or promote products
 *       derived from this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY EGRET-LABS.ORG AND CONTRIBUTORS "AS IS" AND ANY
 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL EGRET-LABS.ORG AND CONTRIBUTORS BE LIABLE FOR ANY
 * DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 * SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */
var egret;
(function (egret) {
    /**
     * @private
     */
    var InputController = (function (_super) {
        __extends(InputController, _super);
        function InputController() {
            _super.call(this);
            this._isFocus = false;
            this._text = null;
            this._isFirst = true;
            this._isFirst = true;
        }
        var __egretProto__ = InputController.prototype;
        __egretProto__.init = function (text) {
            this._text = text;
            this.stageText = egret.StageText.create();
            var point = this._text.localToGlobal();
            this.stageText._open(point.x, point.y, this._text._explicitWidth, this._text._explicitHeight);
        };
        __egretProto__._addStageText = function () {
            if (!this._text._inputEnabled) {
                this._text._touchEnabled = true;
            }
            this.stageText._add();
            this.stageText._addListeners();
            this.stageText.addEventListener("blur", this.onBlurHandler, this);
            this.stageText.addEventListener("focus", this.onFocusHandler, this);
            this.stageText.addEventListener("updateText", this.updateTextHandler, this);
            this._text.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onMouseDownHandler, this);
            egret.MainContext.instance.stage.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onStageDownHandler, this);
            egret.MainContext.instance.stage.addEventListener(egret.Event.RESIZE, this.onResize, this);
        };
        __egretProto__._removeStageText = function () {
            this.stageText._remove();
            this.stageText._removeListeners();
            if (!this._text._inputEnabled) {
                this._text._touchEnabled = false;
            }
            this.stageText.removeEventListener("blur", this.onBlurHandler, this);
            this.stageText.removeEventListener("focus", this.onFocusHandler, this);
            this.stageText.removeEventListener("updateText", this.updateTextHandler, this);
            this._text.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onMouseDownHandler, this);
            egret.MainContext.instance.stage.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onStageDownHandler, this);
            egret.MainContext.instance.stage.removeEventListener(egret.Event.RESIZE, this.onResize, this);
        };
        __egretProto__.onResize = function () {
            this._isFirst = true;
        };
        __egretProto__._getText = function () {
            return this.stageText._getText();
        };
        __egretProto__._setText = function (value) {
            this.stageText._setText(value);
        };
        __egretProto__.onFocusHandler = function (event) {
            this.hideText();
        };
        //显示文本
        __egretProto__.onBlurHandler = function (event) {
            this.showText();
        };
        //点中文本
        __egretProto__.onMouseDownHandler = function (event) {
            event.stopPropagation();
            if (!this._text._visible) {
                return;
            }
            //强制更新输入框位置
            this._isFirst = true;
            this._updateTransform();
            this.stageText._show();
        };
        //未点中文本
        __egretProto__.onStageDownHandler = function (event) {
            this.stageText._hide();
            this.showText();
        };
        __egretProto__.showText = function () {
            if (this._isFocus) {
                this._isFocus = false;
                this.resetText();
            }
        };
        __egretProto__.hideText = function () {
            if (!this._isFocus) {
                this._text._setBaseText("");
                this._isFocus = true;
            }
        };
        __egretProto__.updateTextHandler = function (event) {
            this.resetText();
            //抛出change事件
            this._text.dispatchEvent(new egret.Event(egret.Event.CHANGE));
        };
        __egretProto__.resetText = function () {
            this._text._setBaseText(this.stageText._getText());
        };
        __egretProto__._updateTransform = function () {
            //todo 等待worldTransform的性能优化完成，合并这块代码
            var oldTransFormA = this._text._worldTransform.a;
            var oldTransFormB = this._text._worldTransform.b;
            var oldTransFormC = this._text._worldTransform.c;
            var oldTransFormD = this._text._worldTransform.d;
            var oldTransFormTx = this._text._worldTransform.tx;
            var oldTransFormTy = this._text._worldTransform.ty;
            this._text._updateBaseTransform();
            var newTransForm = this._text._worldTransform;
            if (this._isFirst || oldTransFormA != newTransForm.a || oldTransFormB != newTransForm.b || oldTransFormC != newTransForm.c || oldTransFormD != newTransForm.d || oldTransFormTx != newTransForm.tx || oldTransFormTy != newTransForm.ty) {
                this._isFirst = false;
                var point = this._text.localToGlobal();
                this.stageText.changePosition(point.x, point.y);
                var self = this;
                egret.callLater(function () {
                    self.stageText._setScale(self._text._worldTransform.a, self._text._worldTransform.d);
                }, this);
            }
        };
        __egretProto__._updateProperties = function () {
            var stage = this._text._stage;
            if (stage == null) {
                this.stageText._setVisible(false);
            }
            else {
                var item = this._text;
                var visible = item._visible;
                while (true) {
                    if (!visible) {
                        break;
                    }
                    item = item.parent;
                    if (item == stage) {
                        break;
                    }
                    visible = item._visible;
                }
                this.stageText._setVisible(visible);
            }
            this.stageText._setMultiline(this._text._multiline);
            this.stageText._setMaxChars(this._text._maxChars);
            this.stageText._setSize(this._text._size);
            this.stageText._setTextColor(this._text._textColorString);
            this.stageText._setTextFontFamily(this._text._fontFamily);
            this.stageText._setBold(this._text._bold);
            this.stageText._setItalic(this._text._italic);
            this.stageText._setTextAlign(this._text._textAlign);
            this.stageText._setWidth(this._text._getSize(egret.Rectangle.identity).width);
            this.stageText._setHeight(this._text._getSize(egret.Rectangle.identity).height);
            this.stageText._setTextType(this._text._displayAsPassword ? "password" : "text");
            this.stageText._setText(this._text._text);
            //整体修改
            this.stageText._resetStageText();
            this._updateTransform();
        };
        return InputController;
    })(egret.HashObject);
    egret.InputController = InputController;
    InputController.prototype.__class__ = "egret.InputController";
})(egret || (egret = {}));
