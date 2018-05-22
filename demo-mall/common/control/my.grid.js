
$ehr('control.my.grid', ['binding', 'value', 'common_dialog', function (binding, value, common_dialog) {
    return function (element, data, field) {
        var oldColumns = [], newData = data.$extend({
            select: data.select,
            show: function (item) {
                common_dialog('<div [my.form]="item" style="width:20em;"></div>', {
                    title: '展示一条数据', item: item, buttons: {
                        'ok': function () { common_dialog('提交数据');this.$close(); },
                        'cancel': function () { this.$close(); }
                    }
                });
            }
        }, [field]);
        Object.defineProperty(newData, 'columns', {
            configurable: true,
            enumerable: false,
            set: function (v) { oldColumns = v; },
            get: function () {
                var columns = [];
                (value(data, field) || []).forEach(function (it) {
                    Object.keys(it).forEach(function (k) {
                        if (columns.indexOf(k) === -1) {
                            columns.push(k);
                        }
                    });
                });
                if (Object.keys(oldColumns).join() !== Object.keys(columns).join()) {
                    newData.columns = columns;
                }
                return columns;
            }
        });

        binding([
            '<div >',
            '   <div class="table-header">',
            '       <div class="table-row">',
            '           <div [column:columns] [innerHTML]="column|capitalize" [class]="\'cell-\' + $index"></div>',
            '       </div>',
            '   </div>',
            '   <div class="table-body">',
            '       <div [item:items] class="table-row" [ondblclick]="show(item)" [onclick]="select">',
            '           <div [column:columns] [class]="\'cell-\' + $index" [innerHTML]="item[column]|lookup(column)"></div>',
            '       </div>',
            '   </div>',
            '</div>'
        ].join(''), newData, element);
    }
}]);