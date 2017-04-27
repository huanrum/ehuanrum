
$ehr('control.my.grid.menu', ['binding', 'value', function (binding, value) {

    function toArray(scope, total) {
        var befor = [], after = [];
        for (var i = 0; i < Math.floor(total / 2); i++) {
            befor.push(i + 1);
        }
        for (var i = Math.floor(total / 2); i < total; i++) {
            after.push(i + 1);
        }
        scope.befors = befor;
        scope.afters = after;
    }
    return function (element, data, field) {
        var page = field.split(':')[0], update = field.split(':')[1];
        var totalPage = value(data, field.split(':')[0] + '.totalPage') || 1;
        var newData = data.$extend({
            befors: [], afters: [],
            goto: function (num) {
                if (num === true) {
                    num = Math.min(+ value(data, field.split(':')[0] + '.pageNumber') + 1, value(data, field.split(':')[0] + '.totalPage'));
                } else if (num === false) {
                    num = + Math.max(value(data, field.split(':')[0] + '.pageNumber') - 1, 1);
                }
                if (/^\d+$/.test(num)) {
                    if (num > -1 && num - 1 < value(data, field.split(':')[0] + '.totalPage') && ('' + num) !== value(data, field.split(':')[0] + '.pageNumber')) {
                        value(data, field.split(':')[0] + '.pageNumber', num);
                        value(data, field.split(':')[1])();
                    }
                }
            }
        }, field.split(':'));

        Object.defineProperty(value(data, field.split(':')[0]), 'totalPage', {
            configurable: true,
            get: function () { return totalPage; },
            set: function (value) {
                totalPage = value;
                toArray(newData, value);
            }
        });
        toArray(newData, value(data, field.split(':')[0] + '.totalPage'))
        binding([
            '   <ul class="my-grid-menu">',
            '       <li><span [onclick]="goto(1)" [class]="(+@page@.pageNumber)===1&&\'disable\'">First</span></li>',
            '       <li><span [onclick]="goto(false)" [class]="(+@page@.pageNumber)<2&&\'disable\'">Prev</span></li>',
            '       <li [item:befors] [class]="(+@page@.pageNumber)===(+item)&&\'active\'"><span [onclick]="goto(item)" [innerHTML]="item"></span></li>',
            '       <li [style.display]="@page@.totalPage<11?\'none\':\'inline-block\'"><input [value]="@page@.pageNumber" [onkeyup]="goto(@page@.pageNumber)"></li>',
            '       <li [item:afters] [class]="(+@page@.pageNumber)===(+item)&&\'active\'"><span [onclick]="goto(item)" [innerHTML]="item"></span></li>',
            '       <li><span [onclick]="goto(true)" [class]="(+@page@.pageNumber)>(+@page@.totalPage-1)&&\'disable\'">Next</span></li>',
            '       <li><span [onclick]="goto(@page@.totalPage)" [class]="(+@page@.pageNumber)===(+@page@.totalPage)&&\'disable\'">Last</span></li>',
            '   </ul>',
        ].join('').replace(/@page@/g, field.split(':')[0]), newData, element);
    }
}]);