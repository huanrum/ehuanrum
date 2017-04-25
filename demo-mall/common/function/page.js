(function ($e) {
    'use strict';

    //定义自己的功能,由于参数明不能带.所以使用的时候可以用_代替
    $e('common.page', ['global', 'binding', function (global, binding) {

        var template = [
            '<div>',
            '   <div class="content-header">',
            '        <div class="left">',
            '           {title} ',
            '        </div>',
            '        <div class="right" [onclick]="personal">',
            global.user,
            '        </div>',
            '   </div>',
            '   <div class="content-content">',
            '      {content}',
            '   </div>',
            '   <div class="content-footer">',
            '       {footer}',
            '   </div>',
            '</div>'
        ].join('');

        return function (child, data, controller) {
            if (typeof data === 'function') {
                controller = data;
                data = {};
            }
            if (typeof controller === 'function') {
                controller(data);
            }
            if (typeof child === 'string') {
                Object.keys(data).forEach(function (k) {
                    child = child.replace(new RegExp('\\{\\s*' + k + '\\s*\\}', 'g'), data[k] || '');
                });
            } else if(controller.update){
                var dataService = controller;
                controller = null;
                child = '<div [my.grid]="items"></div>';
                dataService.update(function (list,page) {
                    data.items = list;
                    data.page = data.page || {};
                    Object.keys(page||{}).forEach(function(k){
                         data.page[k] = page[k];
                    });
                });
            }


            data.personal = function () {
                $ehr('personal')(global.user);
            };
            return binding([template, {
                title: data.title || 'no title',
                content: child,
                footer: data.footer
            }], data, controller);
        }
    }]);

})(window.$ehr);