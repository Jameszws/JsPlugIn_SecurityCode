/*
*安全码插件 + 虚拟键（6位）
*auth：张文书
*date：2016-07-04
*/
define(['validate', 'text!SecurityCode_New_Templ', 'commonOp', "SimpleLayer", 'text!VirtualKeyTempl', "virtualKey"],
    function (validate, template, commonOp, SimpleLayer, VirtualKeyTempl, virtualKey) {

        var securityCodePlugIn = function () {
            this.defaultParams = {
                containerId: "",    //容器ID
                securityCodePlugInAreaId: "", //安全码插件ID
                fillInCompleteCallBack: null, //填写完成回调函数
                //是否需要确认密码
                needConfirmPassword: {
                    referencePasswordId: "",//参考密码插件SCID
                    callback: null   //回调函数
                },

                isNeedClickSCShowVirtualKey: false,  //是否需要点击显示
                clickSCCallback: null,    //点击安全码框回调函数

                isHasFixedPosition: false,     //是否有固定的位置显示虚拟键
                fixedPositionAreaId: "",     //固定位置区域id
                virtualkeyClickCallback: null    //虚拟键点击回调事件
            };
        };

        securityCodePlugIn.prototype = {

            constructor: securityCodePlugIn,

            init: function (params) {
                this.options = commonOp.coverObject(this.defaultParams, params);
                this._init();
            },

            _init: function () {
                this.renderTempl();
            },

            pwdStyle: {
                spanLeft: "0px"
            },

            ///TODO 渲染模板
            renderTempl: function () {
                var containerId = this.options.containerId;
                var securityCodePlugInAreaId = this.options.securityCodePlugInAreaId;
                var virtualKeyContainerId = securityCodePlugInAreaId + "_virtualKey";
                var tplFun = _.template(template);
                var totalWidth = $("#" + containerId).css("width"); //总长
                this.pwdStyle.spanLeft = (parseInt(totalWidth) / 12 - 5) + "px";
                var tpl = tplFun({
                    "securityCodePlugInAreaId": securityCodePlugInAreaId,
                    "virtualKeyContainerId": virtualKeyContainerId
                });
                var t = this;
                $('#' + containerId).html(tpl);
                $("#" + securityCodePlugInAreaId).css("width", totalWidth);

                this.getElements();

                if (!this.options.isNeedClickSCShowVirtualKey) {

                    if (this.options.isHasFixedPosition) {
                        //有固定地方
                        virtualKeyContainerId = this.options.fixedPositionAreaId;
                        this.isPopVirtualKeyShowFlase_isHasFixedPositionTrue(virtualKeyContainerId);
                    } else {
                        //没有固定显示地方，就放在安全码框的下面显示
                        $("#" + virtualKeyContainerId).show();
                        this.isPopVirtualKeyShow_Flase(virtualKeyContainerId);
                    }
                    return;
                }
                //批量绑定事件
                eval("var events = {" +
                        "\"click #" + securityCodePlugInAreaId + ">div.secutitycodeBg\": \"click_secutitycode\"" +
                    "};");
                for (var e in events) {
                    var typeTarget = e.split(" ");
                    if (typeTarget && typeTarget.length == 2) {
                        var type = typeTarget[0];
                        var target = typeTarget[1];
                        $('#' + containerId).find(target).on(type, $.proxy(t[events[e]], this));
                    }
                }
            },

            isPopVirtualKeyShow_Flase: function (virtualKeyContainerId) {
                var totalWidth = $("#" + this.options.containerId).css("width"); //总长
                var showWidth = (parseInt(totalWidth) + 2) + "px";
                this.virtualKeyInit(virtualKeyContainerId, showWidth, false);
            },

            isPopVirtualKeyShowFlase_isHasFixedPositionTrue: function (virtualKeyContainerId) {
                this.virtualKeyInit(virtualKeyContainerId, "100%", false);
            },

            virtualKeyInit: function (virtualKeyContainerId, showWidth, isPopShow) {
                var scope = this;
                new virtualKey().init({
                    containerId: virtualKeyContainerId,    //容器ID
                    showWidth: showWidth,  //虚拟键盘宽度
                    isPopShow: isPopShow,
                    virtualkeyClickCallback: function (currentOp) {
                        scope.virtualkeyClickCallbackHandler(currentOp);
                    }
                });
            },

            /// TODO 安全码点击事件
            click_secutitycode: function () {
                validate.IsFunction(this.options.clickSCCallback) && this.options.clickSCCallback();
                if (this.options.isHasFixedPosition) {
                    this.click_secutitycode_isHasFixedPositionTrue();
                    return;
                }
                this.click_secutitycode_isHasFixedPositionFlase();
            },

            click_secutitycode_isHasFixedPositionTrue: function () {
                $("#" + this.options.fixedPositionAreaId).html("");
                this.virtualKeyInit(this.options.fixedPositionAreaId, "100%", false);
            },

            click_secutitycode_isHasFixedPositionFlase: function () {
                var totalWidth = $("#" + this.options.containerId).css("width"); //总长
                var showWidth = parseInt(totalWidth) * 0.8 + "px";
                this.virtualKeyInit("", showWidth, true);
            },

            /// TODO 虚拟键按键回调函数
            virtualkeyClickCallbackHandler: function (currentOp) {
                var pwdEl = $("#" + this.options.securityCodePlugInAreaId + ">div.secutitycodeBg>input[type=password]");
                var scope = this;
                if (currentOp != "delete") {
                    //添加黑点span
                    scope.SecurityCodeContent.each(function (index, el) {
                        if ($(el).find("span").length == 0) {
                            $(el).html("<span style='left:" + scope.pwdStyle.spanLeft + "'></span>");
                            pwdEl.val(pwdEl.val() + currentOp);
                            if (pwdEl.val().trim().length == 6) {
                                scope.fillInCompleteCallBackHandler(pwdEl.val());
                                scope.needConfirmPasswordHandler(pwdEl.val());
                            }
                            return false;
                        }
                        return true;
                    });
                    validate.IsFunction(this.options.virtualkeyClickCallback) && this.options.virtualkeyClickCallback();
                    return true;
                }
                //获取倒序
                var reverseSecurityCodeContentArray = new Array(6);
                scope.SecurityCodeContent.each(function (index, el) {
                    reverseSecurityCodeContentArray[5 - index] = el;
                });
                for (var i = 0; i < 6; i++) {
                    var scEl = $(reverseSecurityCodeContentArray[i]);
                    if ($(scEl).find("span").length == 1) {
                        $(scEl).html("");
                        var value = pwdEl.val();
                        pwdEl.val(value.substring(0, value.length - 1));
                        if (pwdEl.val().trim().length == 5) {
                            scope.fillInCompleteCallBackHandler(pwdEl.val());
                            scope.needConfirmPasswordHandler(pwdEl.val());
                        }
                        break;
                    }
                }
                validate.IsFunction(this.options.virtualkeyClickCallback) && this.options.virtualkeyClickCallback();
            },

            /// TODO 输入完成后，回调函数
            fillInCompleteCallBackHandler: function (pwd) {
                //判断输入完成后是否需要回调函数
                validate.IsFunction(this.options.fillInCompleteCallBack) && pwd.length == 6 && this.options.fillInCompleteCallBack(pwd);
            },

            /// TODO 确认密码
            needConfirmPasswordHandler: function (pwd) {
                //判断是否需要确认密码
                if (!validate.IsNull(this.options.needConfirmPassword.referencePasswordId)) {
                    var refPwdEl = $("#" + this.options.needConfirmPassword.referencePasswordId + ">div.secutitycodeBg>input[type=password]");
                    var refPwd = refPwdEl.val().trim();
                    if (refPwd.length == 6 && pwd.length == 6 && refPwd == pwd) {
                        validate.IsFunction(this.options.needConfirmPassword.callback) && this.options.needConfirmPassword.callback(true, refPwd);
                        return;
                    }
                    validate.IsFunction(this.options.needConfirmPassword.callback) && this.options.needConfirmPassword.callback(false);
                }
            },

            getElements: function () {
                var securityCodePlugInAreaId = this.options.securityCodePlugInAreaId;
                this.SecurityCodeContent = $("#" + securityCodePlugInAreaId).find("div[class=secutitycodeBg]>div");
            }

        };


        return securityCodePlugIn;

    });