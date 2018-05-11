
$ehr('control.my.label.value', ['binding', function (binding) {
    return function (element, data, field) {
        var newData = data.$extend({}, field.split(':'));

        binding([
            '   <div class="label-value">',
            '       <label [innerHTML]="field"></label>',
            '       <div [innerHTML]="item[field]|lookup(field)"></div>',
            '   </div>',
        ].join('').replace(/item/g, field.split(':')[0]).replace(/field/g, field.split(':')[1]),
            newData, element);
    }
}]);