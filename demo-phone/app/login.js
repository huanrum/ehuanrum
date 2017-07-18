
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

