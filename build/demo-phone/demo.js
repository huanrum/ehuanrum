ehr(true);



ehr('router.login', ['$global', 'http', 'router', 'binding', function ($global, http, router, binding) {

    var template = `<div class="router-login">
                            <div class="row-3"><img src="assets/img/self/backbone.png"></div>
                            <div class="row"><input :value="name"></div>
                            <div class="row"><input :value="password"></div>
                            <div class="row"><button @click="login">Login</button></div>
                        </div>`;

    return function (name) {
        $global.title = 'Login';
        $global.left.icon = '';
        $global.right.icon = '';
        binding(template, {
            name: 'seto@m.com',
            password: '******',
            login: function () {
                http('/login', { user: this.name, password: this.password }).then(function (req) {
                    $global.user = req.name || 'User';
                    router.goto('router.main');
                });
            }
        });
    };
}]);



ehr('$global', [function () {
    return {
        title: '',
        buttons: [],
        left: { fn: function () { $ehr('router').goto(-1); } },
        right: { fn: function () { } }
    };
}]);

/**
 * goin(true) 可以使菜单不显示出来
 */
ehr('main', ['router', 'binding', '$global', function (router, binding, $global) {

    var template = `<div class="global-control">
                        <div class="global-header">
                            <div class="menu"><img src="assets/img/global-header/icon-menu.svg"></div>
                            <div class="title">{{title}}</div>
                            <div class="buttons">
                                <div [btn:buttons] @click="btn.fn()"><img :src="btn.icon"></div>
                            </div>
                        </div>
                        <div class="global-footer">
                            <div class="left" @click="left.fn()" :hidden="!left.icon">
                                <img :src="left.icon">
                            </div>
                            <div class="right" @click="right.fn()" :hidden="!right.icon">
                                <img :src="right.icon">
                            </div>
                        </div>
                    </div>`
    return function (goin) {

        goin(true);

        binding(template, $global).update(document.body);
    };
}]);


ehr('router.main', ['$global', 'router', 'binding', function ($global, router, binding) {

    var template = `<div class="main-menu">
                        <div [menu:menus] @click="goto(menu.name)">
                            <img :src="menu.icon">
                            <div>{{menu.title}}</div>
                        </div>
                    </div>`;

    var menus = [
        {name:'router.shop',title:'Shop'},
        {name:'router.book',title:'Book'},
        {name:'router.sport',title:'Sport'},
        {name:'router.code',title:'Code'},
        {name:'router.css',title:'Css'},
        {name:'router.java',title:'Java'},
        {name:'router.math',title:'Math'},
        {name:'router.other',title:'Other'}
    ];

    return function (name) {
        $global.title = 'Home';
        $global.left.icon = '';
        $global.right.icon = '';
        binding(template, {
            goto:function(){router.goto.apply(null,arguments);},
            menus:menus
        });
    }
}]);



ehr('router.shop', ['binding', '$global','http', function (binding,$global, http) {

    var template = `<div refresher>
                        <div class="item" [item:items]>
                            <div class="item-content">
                                <div>{{item.name}}</div>
                            </div>
                        </div>
                    <div>`;

    return function (name) {
        update();
        binding(template, controller);
    };

    function update() {
        $global.title = 'Shop';
        $global.left.icon = 'assets/img/global-controls/icon-lock.svg';
        $global.right.icon = '';
    }

    function controller(scope) {
        scope.items = [];
        http('/book/shop',{pageSize:10,pageNumber:1}).then(function(req){
            scope.items = req.data.list;
        });
    }
}]);
