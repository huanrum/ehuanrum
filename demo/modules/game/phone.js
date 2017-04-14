/**
 * Created by Administrator on 2017/3/28.
 */
(function ($e) {
    'use strict';

    //界面上的菜单数据以及路由和界面,必须以router.开头
    $e('router.game.phone', ['common_page','common_dialog',function (common_page,common_dialog) {

        return function (name) {
            return common_page([
                '<div>',
                '   <div [my.login]="login"></div>',
                '</div>'
            ].join(''), {
                    title: 'Game Phone',
                    username: name,
                    login:function(username,password){
                        console.log(username,password);
                        common_dialog(username+' - '+password,{title:'Login Message'});
                    }
                });
        };

    }]);

})(window.$ehr);
