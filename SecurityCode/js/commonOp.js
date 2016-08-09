

define([], function () {
    
    var commonOp = {
        coverObject: function (obj1, obj2) {

            var o = this.cloneObject(obj1, false);
            var name;
            for (name in obj2) {
                if (obj2.hasOwnProperty(name)) {
                    o[name] = obj2[name];
                }
            }
            return o;
        },

        cloneObject: function (obj, deep) {
            if (obj === null) {
                return null;
            }
            var con = new obj.constructor();
            var name;
            for (name in obj) {
                if (!deep) {
                    con[name] = obj[name];
                } else {
                    if (typeof (obj[name]) == "object") {
                        con[name] = commonOp.cloneObject(obj[name], deep);
                    } else {
                        con[name] = obj[name];
                    }
                }
            }
            return con;
        }
    };

    return commonOp;

});