/**
 * Created by Administrator on 2017/3/28.
 */
(function ($e) {
    'use strict';

    $e(true);

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

    $e('router.page2.login', function (common_page) {

        return function (name) {
            return common_page([
                '<div>',
                '   <div [my.login]="login"></div>',
                '</div>'
            ].join(''), {
                    title: 'Page2.login',
                    name: name,
                    login:function(){
                        console.log(this.userName,this.password);
                    }
                });
        }

    });

    $e('router.page2.logout', function (common_page) {

        return function (name) {
            return common_page([
                '<div>',
                '   <div [ehr.input]="name"></div>',
                '   <div [ehr.checkbox]="name"></div>',
                '</div>'
            ].join(''), {
                    title: 'Page2.logout',
                    checked:true,
                    name: name
                });
        }

    });

    $e('router.page2.logout.a', function (common_page) {

        return function (name) {
            return common_page([
                '<div>',
                '   <div [ehr.input]="name"></div>',
                '   <div [ehr.checkbox]="name"></div>',
                '</div>'
            ].join(''), {
                    title: 'Page2.logout.a',
                    checked:true,
                    name: name
                });
        }

    });

    $e('router.page2.each', function (common_page) {

        return function (name) {
            return common_page([
                '<div>',
                '   <div [item:items]>',
                '       <label [innerHTML]="$index +\'  \'+ item.name"></label> ',
                '       <input [value]="item.value"> ',
                '       <button [onclick]="remove">&times;</button>',
                '   </div>',
                '   <div>循环后面</div>',
                '   <button [onclick]="add">Add Item</button>',
                '</div>'
            ].join(''), {
                    title: 'Page2.each',
                    checked:true,
                    name: name,
                    items:[{name:'*1',value:1},{name:'-2',value:2},{name:'+3',value:3}],
                    add:function(){
                        this.items = this.items.concat([{name:'--',value:Math.floor(Math.random() * 100)}]);
                    },
                    remove:function(){
                        var self = this;
                        this.items = this.items.filter(function(i){return i != self.item;});
                    }
                });
        }

    });


})(window.$ehr);
