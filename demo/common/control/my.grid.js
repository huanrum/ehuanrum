(function ($e) {
    'use strict';

    //定义自己的指令,必须以control.开头,使用的时候[ehr.input]="field",定义的时候有三个参数,第一个参数是指令所在的元素,第二个参数是元素关联的数据,第三个参数是field(调用时候传的参数名)

    $e('control.my.grid', ['binding', 'value', 'common_dialog', function (binding, value, common_dialog) {
        return function (element, data, field) {
            var newData = data.$extend({
                select: data.select,
                show: function (item) {
                    common_dialog(JSON.stringify(item), {});
                }
            }, [field]);
            Object.defineProperty(newData, 'columns', {
                configurable: true,
                enumerable: false,
                get: function () {
                    var columns = [];
                    value(data, field).forEach(function (it) {
                        Object.keys(it).forEach(function (k) {
                            if (columns.indexOf(k) === -1) {
                                columns.push(k);
                            }
                        });
                    });
                    return columns;
                }
            });

            binding([
                '<div >',
                '   <div class="table-header">',
                '       <div class="table-row">',
                '           <div [column:columns] [innerHTML]="column" [class]="\'cell-\' + $index"></div>',
                '       </div>',
                '   </div>',
                '   <div class="table-body">',
                '       <div [item:items] class="table-row" [ondblclick]="show(item)" [onclick]="select">',
                '           <div [column:columns] [class]="\'cell-\' + $index" [innerHTML]="item[column]"></div>',
                '       </div>',
                '   </div>',
                '</div>'
            ].join(''), newData, element);
        }
    }]);

})(window.$ehr);