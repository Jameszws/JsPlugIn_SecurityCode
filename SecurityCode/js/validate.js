define([],
function () {
    var ret = {
        PhoneNum: function (str) {
            var reg = /^0?1\d{10}$/;
            return reg.test(str);
        },
        
        //验证电话号码
        //验证规则：区号+号码，区号以0开头，3位或4位
        //号码由7位或8位数字组成
        //区号与号码之间可以无连接符，也可以“-”连接
        //如01088888888,010-88888888,0955-7777777 
        isPhone: function (str) {
            var re = /^0\d{2,3}-?\d{7,8}$/;
            return re.test(str);
        },
        
        IdNum: function (str) {
            var str = str.toString();
            var City = {
                11: "北京",
                12: "天津",
                13: "河北",
                14: "山西",
                15: "内蒙古",
                21: "辽宁",
                22: "吉林",
                23: "黑龙江 ",
                31: "上海",
                32: "江苏",
                33: "浙江",
                34: "安徽",
                35: "福建",
                36: "江西",
                37: "山东",
                41: "河南",
                42: "湖北 ",
                43: "湖南",
                44: "广东",
                45: "广西",
                46: "海南",
                50: "重庆",
                51: "四川",
                52: "贵州",
                53: "云南",
                54: "西藏 ",
                61: "陕西",
                62: "甘肃",
                63: "青海",
                64: "宁夏",
                65: "***",
                71: "台湾",
                81: "香港",
                82: "澳门",
                91: "国外 "
            }

            var iSum = 0
            var info = ""

            if (!/^\d{17}(\d|x)$/i.test(str)) return false;

            str = str.replace(/x$/i, "a");

            if (City[parseInt(str.substr(0, 2))] == null) return false;

            sBirthday = str.substr(6, 4) + "-" + Number(str.substr(10, 2)) + "-" + Number(str.substr(12, 2));

            var d = new Date(sBirthday.replace(/-/g, "/"))

            if (sBirthday != (d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate())) return false;

            for (var i = 17; i >= 0; i--)
                iSum += (Math.pow(2, i) % 11) * parseInt(str.charAt(17 - i), 11)

            if (iSum % 11 != 1) return false;

            return City[parseInt(str.substr(0, 2))] + "," + sBirthday + "," + (str.substr(16, 1) % 2 ? "男" : "女");
        },
        lengthCheck: function (str, minlen, maxlen) {
            return str.length >= minlen && (maxlen && typeof maxlen == "Number" ? str.length <= maxlen : true);
        },
        emptyCheck: function (str) {
            return str && str.length
        },
        EmailCheck: function (str) {
            var reg = /^[a-zA-Z0-9]+@[a-zA-Z0-9]+.[a-z][a-z.]{2,8}$/;
            return reg.test(str);
        },
        NumCheck: function (str) {
            var reg = /^\d+$/;
            return reg.test(str);
        },
        ChiCheck: function (str) {
            var reg = /^[\u4E00-\u9FA5\uF900-\uFA2D]+$/;
            return reg.test(str);
        },
        //判断字符串是否为空
        IsNull: function (str) {
            if (str !== null && str !== undefined && str.trim() !== '') {
                return false;
            }
            return true;
        },
        //判断是否是身份证号
        IsCardNo: function (str) {
            // var reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/; //简单检测
            var reg = /^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$|^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/;
            return reg.test(str);
        },

        //检测联系人
        checkContact: function (str) {
            var reg = /^[\u0391-\uFFE5A-Za-z]{1,20}$/;
            return reg.test(str);
        },

        IsFunction: function (callback) {
            if (callback != null && typeof callback == "function") {
                return true;
            }
            return false;
        },
        
        NumCheckByLength: function (length,str) {
            eval("var reg = /^[0-9]{"+length+"}$/;");
            return reg.test(str);
        },
        
        //护照验证
        isPassport: function (value) {
            var re1 = /^[a-zA-Z]{5,17}$/;
            var re2 = /^[a-zA-Z0-9]{5,17}$/;
            return re1.test(value) || re2.test(value);
        }
        

    };
    return ret;
});