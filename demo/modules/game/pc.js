/**
 * Created by Administrator on 2017/3/28.
 */
(function ($e) {
    'use strict';

    //界面上的菜单数据以及路由和界面,必须以router.开头
    $e('router.game.pc', ['common_page',function (common_page) {

        return function (name) {
            return common_page([
                '<div>',
                '   <div [item:items]>',
                '       <label [innerHTML]="$index +\'  \'+ item.name"></label> ',
                '       <input [value]="item.value"> ',
                '       <button [onclick]="remove(item)">&times;</button>',
                '   </div>',
                '   <div>循环后面</div>',
                '   <button [onclick]="add(items.length)">Add Item</button>',
                '</div>'
            ].join(''), {
                    title: 'Game PC',
                    checked:true,
                    name: name,
                    items:[{name:'*1',value:1},{name:'-2',value:2},{name:'+3',value:3}],
                    add:function(index){
                        this.items = this.items.concat([{name:index,value:Math.floor(Math.random() * 100)}]);
                    },
                    remove:function(item){
                        var self = this;
                        this.items = this.items.filter(function(i){return i != item;});
                    }
                });
        }

    }]);


})(window.$ehr);
