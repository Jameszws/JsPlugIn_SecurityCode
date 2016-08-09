/*
*安全码插件（6位）
*auth：张文书
*date：2016-07-04
*instruction: 在IOS中存在focus兼容性问题，属于IOS的设计漏洞，该问题在SecurityCode_New插件中已经得到变向处理
*/
define(['validate', 'text!SecurityCodeTeml', 'commonOp'], function (validate, template, commonOp) {

    var securityCodePlugIn = function () {
        this.defaultParams = {
            containerId: "",    //容器ID
            securityCodePlugInAreaId: "", //安全码插件ID
            fillInCompleteCallBack: null, //填写完成回调函数
            //是否需要确认密码
            needConfirmPassword: {
                referencePasswordId: "",//参考密码插件ID
                callback: null   //回调函数
            }
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

        renderTempl: function () {
            var containerId = this.options.containerId;
            var securityCodePlugInAreaId = this.options.securityCodePlugInAreaId;
            var tplFun = _.template(template);
            var tpl = tplFun({ "SecurityCodePlugInAreaId": securityCodePlugInAreaId });
            var t = this;
            $('#' + containerId).html(tpl);
            this.getElements();
            //批量绑定事件
            eval("var events = {" +
                    "\"keyup #" + securityCodePlugInAreaId + ">input[type=password]\": \"txtSecurityCodeKeyup\"," +
                    "\"keydown #" + securityCodePlugInAreaId + ">input[type=password]\": \"txtSecurityCodeKeydown\"," +
                    "\"focus #" + securityCodePlugInAreaId + ">input[type=password]\": \"txtSecurityCodeFocus\"" +
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

        getElements: function () {
            var securityCodePlugInAreaId = this.options.securityCodePlugInAreaId;
            this.txtSecurityCode_Input = $("#" + securityCodePlugInAreaId).find("input[type=password]");
        },

        txtSecurityCodeKeyup: function (currentEl) {
            this.txtSecurityCodeKeyupHandler(currentEl);
        },

        txtSecurityCodeKeydown: function (currentEl) {
            this.txtSecurityCodeKeydownHandler(currentEl);
        },

        txtSecurityCodeFocus: function (currentEl) {
            this.txtSecurityCodeFocusHandler(currentEl);
        },

        txtSecurityCodeKeyupHandler: function (currentEl) {
            var currentTarget = $(currentEl.currentTarget);
            var nextTarget = currentTarget.next("input[type=password]");
            var currentIndex = parseInt(currentTarget.attr("index"));
            var currentVal = currentTarget.val();

            if (validate.NumCheckByLength(1, currentVal)) {

                if (nextTarget.length > 0) {
                    this.txtSecurityCode_Input.removeClass("current");
                    nextTarget.focus();
                    nextTarget.addClass("current");
                }

            } else {
                currentTarget.val("");
            }

            //当输入到最后一个框时候
            if (currentIndex == 5) {
                var pwd = "";
                this.txtSecurityCode_Input.each(function (index, el) {
                    pwd += $(el).val();
                });
                pwd = pwd.trim();
                
                //判断输入完成后是否需要回调函数
                if (validate.IsFunction(this.options.fillInCompleteCallBack)) {
                    pwd.length == 6 && this.options.fillInCompleteCallBack(pwd);
                }
                
                //判断是否需要确认密码
                if (!validate.IsNull(this.options.needConfirmPassword.referencePasswordId)) {
                    var refPwd = "";
                    $("#" + this.options.needConfirmPassword.referencePasswordId).find("input[type=password]").each(function (index, el) {
                        refPwd += $(el).val();
                    });
                    refPwd = refPwd.trim();
                    if (refPwd.length == 6 && pwd.length == 6 && refPwd == pwd) {
                        validate.IsFunction(this.options.needConfirmPassword.callback) && this.options.needConfirmPassword.callback(true, refPwd);
                        return;
                    }
                    validate.IsFunction(this.options.needConfirmPassword.callback) && this.options.needConfirmPassword.callback(false);
                }
            }
        },

        txtSecurityCodeKeydownHandler: function (currentEl) {
            var currentTarget = $(currentEl.currentTarget);
            var currentIndex = parseInt(currentTarget.attr("index"));
            var currentVal = currentTarget.val();

            var prevTarget = currentTarget.prev("input[type=password]");
            var e = window.event || arguments.callee.caller.arguments[0]; // 获取event对象(解决火狐兼容性问题)
            if (e.keyCode == 8) {
                if (currentIndex == 5 && validate.IsNull(currentVal)) {
                    prevTarget.val("");
                    prevTarget.focus();
                    this.txtSecurityCode_Input.removeClass("current");
                    prevTarget.addClass("current");
                }
                if (currentIndex != 5) {
                    prevTarget.val("");
                    prevTarget.focus();
                    this.txtSecurityCode_Input.removeClass("current");
                    prevTarget.addClass("current");
                }
            }
        },

        txtSecurityCodeFocusHandler: function (currentEl) {
            //遍历最后一个没有值的文本框
            var currentTarget = $(currentEl.currentTarget);
            var currentVal = currentTarget.val();
            var currentIndex = parseInt(currentTarget.attr("index"));
            var ret = false;

            this.txtSecurityCode_Input.each(function (index, el) {
                var elVal = $(el).val();
                //当都为空，且为当前选中的是第一个框时
                if (validate.IsNull(elVal) && index == 0 && currentIndex == 0) {
                    ret = true;
                    return false;
                }
                //前面都非空，当前为空
                if (!validate.IsNull(elVal) && validate.IsNull(currentVal) && (index == currentIndex - 1)) {
                    ret = true;
                    return false;
                }
                //当前是最后一个密码框的时候
                if (!validate.IsNull(currentVal) && currentIndex == 5) {
                    ret = true;
                    return false;
                }
                return true;
            });

            if (!ret) {
                currentTarget.blur();
                return;
            }
            return;
        }
    };


    return securityCodePlugIn;

});