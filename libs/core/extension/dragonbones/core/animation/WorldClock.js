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
var dragonBones;
(function (dragonBones) {
    /**
     * @class dragonBones.WorldClock
     * @classdesc
     * WorldClock 提供时钟的支持，为控制每个加入时钟的 IAnimatable 对象正确的播放动画。
     * 一般来说，每当 Armature 被创建出来后，只需要将之加入 WorldClock,之后只需要控制 WorldClock 的前进，就可以实现所有 Armature 的动画前进了
     * @see dragonBones.IAnimatable
     * @see dragonBones.Armature
     */
    var WorldClock = (function () {
        /**
         * 创建一个新的 WorldClock 实例。
         * 一般来说，不需要单独创建 WorldClock 的实例，可以直接使用 WorldClock.clock 静态实例就可以了。
         * @param time {number} 开始时间
         * @param timeScale {number} 时间缩放系数
         */
        function WorldClock(time, timeScale) {
            if (time === void 0) { time = -1; }
            if (timeScale === void 0) { timeScale = 1; }
            this._time = time >= 0 ? time : new Date().getTime() * 0.001;
            this._timeScale = isNaN(timeScale) ? 1 : timeScale;
            this._animatableList = [];
        }
        var __egretProto__ = WorldClock.prototype;
        Object.defineProperty(__egretProto__, "time", {
            get: function () {
                return this._time;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(__egretProto__, "timeScale", {
            /**
             * 时间缩放系数。用于实现动画的变速播放
             * @member {number} dragonBones.WorldClock#timeScale
             */
            get: function () {
                return this._timeScale;
            },
            set: function (value) {
                if (isNaN(value) || value < 0) {
                    value = 1;
                }
                this._timeScale = value;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * 检查是否包含指定的 IAnimatable 实例
         * @param animatable {IAnimatable} IAnimatable 实例
         * @returns {boolean}
         */
        __egretProto__.contains = function (animatable) {
            return this._animatableList.indexOf(animatable) >= 0;
        };
        /**
         * 将一个 IAnimatable 实例加入到时钟
         * @param animatable {IAnimatable} IAnimatable 实例
         */
        __egretProto__.add = function (animatable) {
            if (animatable && this._animatableList.indexOf(animatable) == -1) {
                this._animatableList.push(animatable);
            }
        };
        /**
         * 将一个 IAnimatable 实例从时钟中移除
         * @param animatable {IAnimatable} IAnimatable 实例
         */
        __egretProto__.remove = function (animatable) {
            var index = this._animatableList.indexOf(animatable);
            if (index >= 0) {
                this._animatableList[index] = null;
            }
        };
        /**
         * 从时钟中移除所有的 IAnimatable 实例.
         */
        __egretProto__.clear = function () {
            this._animatableList.length = 0;
        };
        /**
         * 更新所有包含的 IAnimatable 实例，将他们的动画向前播放指定的时间。一般来说，这个方法需要在 ENTERFRAME 事件的响应函数中被调用
         * @param passedTime {number} 前进的时间
         */
        __egretProto__.advanceTime = function (passedTime) {
            if (passedTime === void 0) { passedTime = -1; }
            if (passedTime < 0) {
                passedTime = new Date().getTime() - this._time;
            }
            passedTime *= this._timeScale;
            this._time += passedTime;
            var length = this._animatableList.length;
            if (length == 0) {
                return;
            }
            var currentIndex = 0;
            for (var i = 0; i < length; i++) {
                var animatable = this._animatableList[i];
                if (animatable) {
                    if (currentIndex != i) {
                        this._animatableList[currentIndex] = animatable;
                        this._animatableList[i] = null;
                    }
                    animatable.advanceTime(passedTime);
                    currentIndex++;
                }
            }
            if (currentIndex != i) {
                length = this._animatableList.length;
                while (i < length) {
                    this._animatableList[currentIndex++] = this._animatableList[i++];
                }
                this._animatableList.length = currentIndex;
            }
        };
        /**
         * 可以直接使用的全局静态时钟实例.
         * @type dragonBones.WorldClock
         */
        WorldClock.clock = new WorldClock();
        return WorldClock;
    })();
    dragonBones.WorldClock = WorldClock;
    WorldClock.prototype.__class__ = "dragonBones.WorldClock";
})(dragonBones || (dragonBones = {}));
