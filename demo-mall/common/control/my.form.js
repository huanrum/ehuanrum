window.$ehr('control.my.form', ['binding', 'value', 'common_dialog', function (binding, value, common_dialog) {
        return function (element, data, field) {
            var newData = data.$extend({}, [field]);
            Object.defineProperty(newData, 'fields', {
                configurable: true,
                enumerable: false,
                get: function () {
                    return  Object.keys(value(data, field));
                }
            });

            binding([
                '   <div class="form-body">',
                '       <div [field:fields] class="form-row" [my.label.value]="'+field+':field">',
                '       </div>',
                '   </div>',
            ].join(''), newData, element);
        }
    }]);