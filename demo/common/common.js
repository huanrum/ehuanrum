(function ($e) {
    'use strict';

    //定义自己的功能,由于参数明不能带.所以使用的时候可以用_代替
    $e('common.page',function(binding){
        return function(child,data){
           return binding([
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

    $e('common.dialog',function(binding){
        return function(child,data){
            data.buttons = data.buttons || [];
            data.$close = function(){
                dialog.parentNode.removeChild(dialog);
            };
            var dialog = binding([
                ' <div class="common-dialog-back">',
                '   <div class="common-dialog">',
                '       <div class="common-dialog-header">',
                '           <label>',
                            data.title || 'no title',
                '           </label>',
                '           <a [onclick]="$close">&times;</a>',
                '       </div>',
                '       <div class="common-dialog-content">',
                            child,
                '       </div>',
                '       <div class="common-dialog-footer">',
                '           <a [btn:buttons] [onclick]="btn" [innerHTML]="btn.name"></a>',
                '       </div>',
                '   </div>',
                ' </div>'
                ].join(''),data).appendTo(document.body);
        }
    });

})(window.$ehr);