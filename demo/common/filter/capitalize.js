(function ($e) {
    'use strict';

    //定义自己的功能,由于参数明不能带.所以使用的时候可以用_代替
    $e('filter.capitalize',function(){
        return function(value,index){
            index = index % value.length || 0;
            return value.slice(0,index) + value[index].toLocaleUpperCase() + value.slice(index+1);
        };
    });

})(window.$ehr);