(function ($e) {
    'use strict';

    //定义自己的指令,必须以control.开头,使用的时候[ehr.input]="field",定义的时候有三个参数,第一个参数是指令所在的元素,第二个参数是元素关联的数据,第三个参数是field(调用时候传的参数名)

    $e('control.ehr.checkbox',function(){
        return function(element,data,field){
            $e('binding')('<input type="checkbox" [checked]="'+field+'">',data,element);
        }
    });

})(window.$ehr);