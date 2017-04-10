
$ehr('personal', ['binding', function (binding) {

    var template = [
        '<div>',
        '   <div [innerHTML]="title"></div>',
        '   <div [value:item]>',
        '       <label [innerHTML]="$index"></label>',
        '       <div [innerHTML]="value"></div>',
        '   </div>',
        '</div>'
    ].join('');

    return function (user) {
        binding(template, function (scope) {
            scope.title = '个人信息';
            scope.item = {
                name: user,
                email: 'huanrum@126.com'
            };
        }, 'personal');
    };

}]);