(function ($e) {
    'use strict';

    //定义自己的指令,必须以control.开头,使用的时候[ehr.input]="field",定义的时候有三个参数,第一个参数是指令所在的元素,第二个参数是元素关联的数据,第三个参数是field(调用时候传的参数名)

    $e('control.my.form', ['binding', 'value', 'common_dialog', function (binding, value, common_dialog) {
        return function (element, data, field) {
            var newData = data.$extend({}, [field]);
            Object.defineProperty(newData, 'fields', {
                configurable: true,
                enumerable: false,
                get: function () {
                    return  Object.keys(value(data, field));
                }
            });

            binding([
                '   <div class="form-body">',
                '       <div [field:fields] class="form-row" [my.label.value]="'+field+':field">',
                '       </div>',
                '   </div>',
            ].join(''), newData, element);
        }
    }]);

})(window.$ehr);