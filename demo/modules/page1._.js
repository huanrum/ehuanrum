/**
 * Created by Administrator on 2017/3/28.
 */
(function ($e) {
    'use strict';

    //界面上的菜单数据以及路由和界面,必须以router.开头
    $e('router.page1', function (common_page) {

        function getData(columns,count){
            var list = [];
            for(var i=0;i<count;i++){
                var item = {};
                columns.forEach(function(column){
                    item[column.trim()] = Math.random();
                });
                list.push(item);
            }
            return list;
        }

        return function (name) {
            return common_page([
               '<div [my.grid]="items"></div>'
            ].join(''),{
                    title:'Page1',
                    items:getData(['id','name','value','date'],Math.floor(Math.random() * 10 + 5))
            });
        }
    });


})(window.$ehr);
