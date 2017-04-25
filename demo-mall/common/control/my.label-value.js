window.$ehr('control.my.label.value', ['binding', function (binding) {
        return function (element, data, field) {
            var newData = data.$extend({}, field.split(':'));

            binding([
                '   <div class="label-value">',
                '       <label [innerHTML]="field"></label>',
                '       <div [innerHTML]="item[field]"></div>',
                '   </div>',
            ].join(''), newData, element);
        }
    }]);