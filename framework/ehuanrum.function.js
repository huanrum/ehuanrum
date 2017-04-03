/**
 * Created by Administrator on 2017/3/28.
 */
(function ($e) {
    'use strict';

    //界面上的菜单数据以及路由和界面,必须以router.开头
    $e('functions.color', function () {
        return function (index) {
            if (!index) {
                var color = Math.floor(Math.random() * 256 * 256 * 256).toString(16).slice(-6);
                while (color.length < 6) {
                    color = 0 + color;
                }
                return '#' + color;
            } else {
                if (typeof index !== 'number') {
                    index = $ehr.sToint('' + index);
                }
                return '#' + new Date(10000).setYear(index).toString(16).slice(-8, -2);
            }
        };
    });


})(window.$ehr);
