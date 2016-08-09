/*
* 虚拟键
*auth：张文书
*date：2016-07-29
*/
define(['validate', 'commonOp', 'text!VirtualKeyTempl', "SimpleLayer"],
    function (validate, commonOp, VirtualKeyTempl, SimpleLayer) {
        var virtualKeyPlugIn = function () {
            this.defaultParams = {
                containerId: "",    //容器ID
                isPopShow: true,    //是否弹出
                showWidth: "240px", //虚拟键盘宽度
                virtualkeyClickCallback: null    //点击虚拟键回调函数
            };
        };

        virtualKeyPlugIn.prototype = {
            constructor: virtualKeyPlugIn,

            init: function (params) {
                this.options = commonOp.coverObject(this.defaultParams, params);
                this._init();
            },

            _init: function () {
                this.renderTempl();
            },

            ///TODO 渲染模板
            renderTempl: function () {
                var tplFun = _.template(VirtualKeyTempl);
                var tmpHtml = tplFun();
                if (this.options.isPopShow) {
                    //然后这里就可以调用了
                    if (!this.simpleLayer) {
                        this.simpleLayer = new SimpleLayer({
                            datamodel: {
                                title: "",
                                content: tmpHtml
                            }
                        });
                    }
                    this.simpleLayer.show();
                } else {
                    $("#" + this.options.containerId).html(tmpHtml);
                }
                $("#virtualKeyboard").css("width", this.options.showWidth);
                this.registerEvent();
            },

            /// TODO 注册事件
            registerEvent: function () {
                var t = this;
                eval("var events = {" +
                       "\"click #virtualKeyboard>ul>li.vk_item\": \"click_number\"" +
                   "};");
                for (var e in events) {
                    var typeTarget = e.split(" ");
                    if (typeTarget && typeTarget.length == 2) {
                        var type = typeTarget[0];
                        var target = typeTarget[1];
                        $(target).on(type, $.proxy(t[events[e]], this));
                    }
                }

            },

            click_number: function (currentEl) {
                currentEl.stopPropagation();
                var currentTarget = $(currentEl.currentTarget);
                var attrid = currentTarget.attr("attrId");
                validate.IsFunction(this.options.virtualkeyClickCallback) && this.options.virtualkeyClickCallback(attrid);
            }

        };

        return virtualKeyPlugIn;

    });