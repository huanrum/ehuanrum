/**
 * Created by Administrator on 2017/3/28.
 */
(function ($e) {
    'use strict';

    //界面上的菜单数据以及路由和界面,必须以router.开头
    $e('router.learn', ['common_page','service_learn',function (common_page,service_learn) {

        return function (name) {
            return common_page([
               '<div [my.grid]="items"></div>'
            ].join(''),{
                    title:'Learn',
                    items:service_learn.get(),
                    select:function(){
                        service_learn.select(this.item);
                    }
            });
        }
    }]);

     $e('service.learn', ['common_service',function (common_service) {

        var service = common_service({fields:['id','name','value','date']});
        service.load();
        return service;

    }]);


})(window.$ehr);
