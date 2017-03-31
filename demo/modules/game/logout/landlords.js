/**
 * Created by Administrator on 2017/3/28.
 */
(function ($e) {
    'use strict';

    //界面上的菜单数据以及路由和界面,必须以router.开头
    $e('router.game.poker.landlords', ['common_page',function (common_page) {

        return function (name) {
            return common_page([
                '<div>',
                '   <div [ehr.input]="name"></div>',
                '   <div [ehr.checkbox]="name"></div>',
                '</div>'
            ].join(''), {
                    title: 'Game Poker Landlords',
                    checked:true,
                    name: name
                });
        }

    }]);

})(window.$ehr);
