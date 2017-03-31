/**
 * Created by Administrator on 2017/3/28.
 */
(function ($e) {
    'use strict';

    //界面上的菜单数据以及路由和界面,必须以router.开头
    $e('router.game.phone', ['common_page',function (common_page) {

        return function (name) {
            return common_page([
                '<div>',
                '   <div [my.login]="login"></div>',
                '</div>'
            ].join(''), {
                    title: 'Game Phone',
                    name: name,
                    login:function(){
                        console.log(this.userName,this.password);
                        $e('common.dialog')(this.userName+' - '+this.password,{title:'Login Message'});
                    }
                });
        }

    }]);

})(window.$ehr);
