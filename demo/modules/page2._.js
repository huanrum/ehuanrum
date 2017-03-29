/**
 * Created by Administrator on 2017/3/28.
 */
(function ($e) {
    'use strict';

    //界面上的菜单数据以及路由和界面,必须以router.开头
    $e('router.page2', function (common_page) {

        return function (name) {
            return common_page([
                '<div> Page2',
                '   <input type="checkbox" [checked]="checked">',
                '   <input type="checkbox" [checked]="checked">',
                '   <input type="text" [value]="name">',
                '   <input type="text" [value]="name" [style.display]="name?\'block\':\'none\'">',
                '</div>'
            ].join(''), {
                    title: 'Page2',
                    checked:false,
                    name: name
                });
        }
    });

})(window.$ehr);
