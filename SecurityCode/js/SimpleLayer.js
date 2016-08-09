
define(["UILayer"], function (UILayer) {
    var SimpleLayer = _.inherit(UILayer, {
        propertys: function ($super) {
            $super();
            this.datamodel = {
                title: '0',
                content: '1'
            };
            //每个组件都需要一个template模板字符串
            this.template = '<div class="self-layer" style="border: 1px solid gray; background: white; color: black ; ">' +
                                '<div class="self-title"><%=title%></div>' +
                                '<div class="self-content"><%=content%></div>' +
                            '</div>';
        },
        setDatamodel: function (title, content) {
            this.datamodel = {
                title: title,
                content: content
            };
            this.refresh();
        },
        initialize: function ($super, opts) {
            $super(opts);
        }
    });
    return SimpleLayer;
});
