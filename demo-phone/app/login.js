
ehr('router.login',['global','router','binding',function(global,router,binding){

        return function(name){
            global.title = 'Login';
            global.left.icon = '';
            global.right.icon = '';
            binding('<div @click="login">Login</div>',{
                login:function(){
                    router.goto('router.main');
                }
            });
        };
}]);