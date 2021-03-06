(function ($e) {
    'use strict';

    //定义自己的功能,由于参数明不能带.所以使用的时候可以用_代替
    $e('common.page',function(){
        return function(child,data,controller){
            if(controller){
                controller(data);
            }
           return $e('binding')([
               '<div>',
               '   <div class="content-header">',
                        data.title || 'no title',
                '   </div>',
                '   <div class="content-content">',
                        child,
                '   </div>',
                '   <div class="content-footer">',
                        data.footer || '',
                '   </div>',
                '</div>'
            ].join(''),data);
        }
    });

})(window.$ehr);