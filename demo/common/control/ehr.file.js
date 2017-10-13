(function ($e) {
    'use strict';

    //定义自己的指令,必须以control.开头,使用的时候[ehr.input]="field",定义的时候有三个参数,第一个参数是指令所在的元素,第二个参数是元素关联的数据,第三个参数是field(调用时候传的参数名)

    $e('control.ehr.file', ['value','binding','common_file',function (value,binding,common_file) {
        return function (element, data, field) {
            binding('<input type="file" [onchange]="onchange">', {
                onchange: function (e) {
                    if (e.target.files.length > 0) {
                        var reader = new FileReader();
                        var file = e.target.files[0];
                        reader.onload = function () {
                           value(data,field,common_file(file)(reader.result));
                           element.$emit('changefile',value(data,field));
                        };
                        reader.readAsText(file,'UTF-8');
                    }
                }
            }, element);
        }
    }]);

})(window.$ehr);