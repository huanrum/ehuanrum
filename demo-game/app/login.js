
$ehr('login',['global','binding',function(global,binding){
    var template = [
                '<div class="login-controller">',
                '   <div>',
                '       <label>UserName</label>',
                '       <input [value]="username">',
                '   </div>',
                '   <div>',
                '       <label>Password</label>',
                '       <input [value]="password">',
                '   </div>',
                '<div><button [onclick]="login(username,password)">Login</button></div>',
                '</div>',
                ].join('');

    return function(goin,username){

        var loginElement = binding(template,{
                    username:username,
                    login:function(username,password){
                        global.update({user:username},{user:username});
                        loginElement.update();
                        goin();
                    }
                },document.body);
    };
}]);