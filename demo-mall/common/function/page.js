
$ehr('common.page', ['global', 'binding', function (global, binding) {

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
        } else if (controller.update) {
            var dataService = controller;
            controller = null;
            child = '<div [my.grid]="items"></div><div [my.grid.menu]="page:update"></div>';
            data.page = data.page || {};
            data.update = function () {
                dataService.get(data.page);
            };
            dataService.update(function (list, page) {
                data.items = list;
                Object.keys(page || {}).forEach(function (k) {
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