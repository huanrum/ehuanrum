(function ($e) {
    'use strict';

    //定义自己的功能,由于参数明不能带.所以使用的时候可以用_代替
    $e('common.dialog',function(){
        return function(child,data){
            var thenlist = [];
            data = data || {};
            data.buttons = data.buttons || {};
            data.$close = function(){
                dialog.parentNode.removeChild(dialog);
                thenlist.forEach(function(fn){fn();});
            };
            var dialog = $e('binding')([
                ' <div class="common-dialog-back">',
                '   <div class="common-dialog" [style.background]="background">',
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
                '           <a [btn:buttons] [onclick]="btn" [innerHTML]="$index|capitalize"></a>',
                '       </div>',
                '   </div>',
                ' </div>'
                ].join(''),data,document.body);
                return then;

                function then(fn){
                    thenlist.push(fn);
                }
        }
    });

})(window.$ehr);