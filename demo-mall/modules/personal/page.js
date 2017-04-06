
$ehr('personal',['binding',function(binding){

    var template = [
        '<div>',
        '   <div [innerHTML]="item.title"></div>',
        '   <div [item:items]>',
        '       <label [innerHTML]="item.label"></label>',
        '       <div [innerHTML]="item.value"></div>',
        '   </div>',
        '</div>'
    ].join('');

    return function(user){
        var userData = {
            name:user,
            email:'huanrum@126.com'
        };

        binding(template,{
            title:'个人信息',
            items:Object.keys(userData).map(function(k){
                return {
                    label:k,
                    value:userData[k]
                };
            })
        },'personal');
    };

}]);