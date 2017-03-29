/**
 * Created by Administrator on 2017/3/28.
 */
(function ($e) {
    'use strict';

    //界面上的菜单数据以及路由和界面,必须以router.开头
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
