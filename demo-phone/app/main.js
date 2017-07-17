
$ehr('global',function(){
    return {
        title:'',
        buttons:[],
        left:{fn:function(){}},
        right:{fn:function(){}}
    };
});

/**
 * goin(true) 可以使菜单不显示出来
 */
$ehr('main',['router','binding','global',function(router,binding,global){
    return function(goin){

        goin(true);

        binding([
            '<div class="global-control">',
            '   <div class="global-header">',
            '       <div class="menu"><img src="assets/img/global-header/icon-menu.svg"></div>',
            '       <div class="title">{{title}}</div>',
            '       <div class="buttons">',
            '           <div [btn:buttons] @click="btn.fn()"><img :src="btn.icon"></div>',
            '       </div>',
            '   </div>',
            '   <div class="global-footer">',
            '       <div class="left" @click="left.fn()" :hidden="!left.icon">',
            '           <img :src="left.icon">',
            '       </div>',
            '       <div class="right" @click="right.fn()" :hidden="!right.icon">',
            '           <img :src="right.icon">',
            '       </div>',
            '   </div>',
            '</div>'
        ].join(''),global).update(document.body);
        
        router.goto('router.main');
    };
}]);


ehr('router.main',['global','router','binding',function(global,router,binding){

        return function(name){
            global.title = 'Home';
            global.left.icon = 'assets/img/global-controls/icon-lock.svg';
            global.right.icon = 'assets/img/global-controls/icon-pay.svg';
            global.left.fn = function(){
                router.goto('router.login');
            };
            binding([
                '<div></div>'
            ].join(''),{});
        }
}]);

