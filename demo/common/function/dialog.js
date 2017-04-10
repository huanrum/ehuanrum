(function ($e) {
    'use strict';

    //定义自己的功能,由于参数明不能带.所以使用的时候可以用_代替
    $e('common.dialog',['functions_event',function(functions_event){
        return function(child,data){
            data = data || {};
            var event = functions_event(data);
            data.buttons = data.buttons || {};
            data.$close = function(){
                dialog.parentNode.removeChild(dialog);
                event.fire();
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
                    event.in(fn);
                }
        }
    }]);

})(window.$ehr);