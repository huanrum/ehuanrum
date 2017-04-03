/**
 * Created by Administrator on 2017/3/28.
 */
(function ($e) {
    'use strict';

    //界面上的菜单数据以及路由和界面,必须以router.开头
    $e('router.work.binding', ['common_page','functions',function (common_page,functions) {

        return function (name) {
            var binding = common_page([
               '<div>',
               '    <div [style.color]="color()" [style.fontSize]="index+\'px\'" [innerHTML]="index">',
               
               '    </div>',
               '    <div [innerHTML]="name|capitalize(index)">',
               
               '    </div>',
               '</div>'
            ].join(''),{
                    title:'Binding',
                    name:name,
                    index:0,
                    color:function(){
                        return functions.color(this.index);
                    }
            },function(data){
                setInterval(function(){
                    data.index = Math.floor(Math.random() * 100);
                },1000);
            });

            

            return binding;
        }
    }]);


})(window.$ehr);
