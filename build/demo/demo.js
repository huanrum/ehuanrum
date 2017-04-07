/**
 * Created by Administrator on 2017/3/28.
 */
(function ($e) {
    'use strict';

    //绑定数据以后是否把这些attr显示在DOM里面，默认是不显示的
    $e(true);

    //操作子菜单
    // $e('menuAction',function(){
    //     return function(menu,parent,element){
    //         console.log('切换菜单',menu);
    //     };
    // });

})(window.$ehr);

(function ($e) {
    'use strict';

    //定义自己的指令,必须以control.开头,使用的时候[ehr.input]="field",定义的时候有三个参数,第一个参数是指令所在的元素,第二个参数是元素关联的数据,第三个参数是field(调用时候传的参数名)

    $e('control.ehr.checkbox',function(){
        return function(element,data,field){
            $e('binding')('<input type="checkbox" [checked]="'+field+'">',data,element);
        }
    });

})(window.$ehr);
(function ($e) {
    'use strict';

    //定义自己的指令,必须以control.开头,使用的时候[ehr.input]="field",定义的时候有三个参数,第一个参数是指令所在的元素,第二个参数是元素关联的数据,第三个参数是field(调用时候传的参数名)

    $e('control.ehr.input',function(){
        return function(element,data,field){
            $e('binding')('<input [value]="'+field+'">',data,element);
        }
    });

})(window.$ehr);
(function ($e) {
    'use strict';

    //定义自己的指令,必须以control.开头,使用的时候[ehr.input]="field",定义的时候有三个参数,第一个参数是指令所在的元素,第二个参数是元素关联的数据,第三个参数是field(调用时候传的参数名)

    $e('control.my.form', ['binding', 'value', 'common_dialog', function (binding, value, common_dialog) {
        return function (element, data, field) {
            var newData = data.$extend({}, [field]);
            Object.defineProperty(newData, 'fields', {
                configurable: true,
                enumerable: false,
                get: function () {
                    return  Object.keys(value(data, field));
                }
            });

            binding([
                '   <div class="form-body">',
                '       <div [field:fields] class="form-row">',
                '           <label [innerHTML]="field"></label>',
                '           <div [innerHTML]="item[field]"></div>',
                '       </div>',
                '   </div>',
            ].join(''), newData, element);
        }
    }]);

})(window.$ehr);
(function ($e) {
    'use strict';

    //定义自己的指令,必须以control.开头,使用的时候[ehr.input]="field",定义的时候有三个参数,第一个参数是指令所在的元素,第二个参数是元素关联的数据,第三个参数是field(调用时候传的参数名)

    $e('control.my.grid', ['binding', 'value', 'common_dialog', function (binding, value, common_dialog) {
        return function (element, data, field) {
            var newData = data.$extend({
                select: data.select,
                show: function (item) {
                    common_dialog('<div [my.form]="item"></div>', {item:item,buttons:{
                        'Ok':function(){this.$close();}
                    }});
                }
            }, [field]);
            Object.defineProperty(newData, 'columns', {
                configurable: true,
                enumerable: false,
                get: function () {
                    var columns = [];
                    value(data, field).forEach(function (it) {
                        Object.keys(it).forEach(function (k) {
                            if (columns.indexOf(k) === -1) {
                                columns.push(k);
                            }
                        });
                    });
                    return columns;
                }
            });

            binding([
                '<div >',
                '   <div class="table-header">',
                '       <div class="table-row">',
                '           <div [column:columns] [innerHTML]="column|capitalize" [class]="\'cell-\' + $index"></div>',
                '       </div>',
                '   </div>',
                '   <div class="table-body">',
                '       <div [item:items] class="table-row" [ondblclick]="show(item)" [onclick]="select">',
                '           <div [column:columns] [class]="\'cell-\' + $index" [innerHTML]="item[column]"></div>',
                '       </div>',
                '   </div>',
                '</div>'
            ].join(''), newData, element);
        }
    }]);

})(window.$ehr);
(function ($e) {
    'use strict';

    //定义自己的指令,必须以control.开头,使用的时候[ehr.input]="field",定义的时候有三个参数,第一个参数是指令所在的元素,第二个参数是元素关联的数据,第三个参数是field(调用时候传的参数名)

    $e('control.my.login',function(){
        return function(element,data,field){
            $e('binding')([
                '<div class="my-login">',
                '   <div>',
                '       <label>UserName</label>',
                '       <input [value]="userName">',
                '   </div>',
                '   <div>',
                '       <label>Password</label>',
                '       <input [value]="password">',
                '   </div>',
                '<div><button [onclick]="'+field+'">Login</button></div>',
                '</div>',
                ].join(''),data,element);
        }
    });

})(window.$ehr);
(function ($e) {
    'use strict';

    //定义自己的功能,由于参数明不能带.所以使用的时候可以用_代替
    $e('filter.capitalize',function(){
        return function(value,index){
            index = index % value.length || 0;
            return value.slice(0,index) + value[index].toLocaleUpperCase() + value.slice(index+1);
        };
    });

})(window.$ehr);
(function ($e) {
    'use strict';

    //定义自己的功能,由于参数明不能带.所以使用的时候可以用_代替
    $e('common.dialog',function(){
        return function(child,data){
            data = data || {};
            data.buttons = data.buttons || {};
            data.$close = function(){
                dialog.parentNode.removeChild(dialog);
            };
            var dialog = $e('binding')([
                ' <div class="common-dialog-back">',
                '   <div class="common-dialog" [style.background]="background">',
                '       <div class="common-dialog-header">',
                '           <label>',
                            data.title || 'no title',
                '           </label>',
                '           <a [onclick]="$close">&times;</a>',
                '       </div>',
                '       <div class="common-dialog-content">',
                            child,
                '       </div>',
                '       <div class="common-dialog-footer">',
                '           <a [btn:buttons] [onclick]="btn" [innerHTML]="$index"></a>',
                '       </div>',
                '   </div>',
                ' </div>'
                ].join(''),data,document.body);
        }
    });

})(window.$ehr);
(function ($e) {
    'use strict';

    //定义自己的功能,由于参数明不能带.所以使用的时候可以用_代替
    $e('common.page',function(){
        return function(child,data,controller){
            if(controller){
                controller(data);
            }
           return $e('binding')([
               '<div>',
               '   <div class="content-header">',
                        data.title || 'no title',
                '   </div>',
                '   <div class="content-content">',
                        child,
                '   </div>',
                '   <div class="content-footer">',
                        data.footer || '',
                '   </div>',
                '</div>'
            ].join(''),data);
        }
    });

})(window.$ehr);
(function ($e) {
    'use strict';

    //定义自己的功能,由于参数明不能带.所以使用的时候可以用_代替
    $e('common.service',function(){

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

        return function(option){
            var tempData = {};
           return {
               load:function(){
                    tempData.list = getData(option.fields,Math.floor(Math.random() * 10 + 5));
               },
               get:function(){
                   return tempData.list;
               },
               select:function(item){
                   if(item){
                        tempData.select = item;
                   }
                   return tempData.select;
                    
               }
           }
        };
    });

})(window.$ehr);
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

/**
 * Created by Administrator on 2017/3/28.
 */
(function ($e) {
    'use strict';

    var url = 'https://jira-sinodynamic.atlassian.net/s/d41d8cd98f00b204e9800998ecf8427e-T/wnphhp/b/c/ced29afba244973b16a7e99d069f29b8/_/download/batch/com.atlassian.jira.collector.plugin.jira-issue-collector-plugin:issuecollector/com.atlassian.jira.collector.plugin.jira-issue-collector-plugin:issuecollector.js?locale=en-US&collectorId=9571fe0b';

    //界面上的菜单数据以及路由和界面,必须以router.开头
    $e('router.game', ['common_page','common_dialog',function (common_page,common_dialog) {

        return function (name) {
            return common_page([
                '<div>',
                '   <input type="checkbox" [checked]="checked">',
                '   <input type="checkbox" [checked]="checked">',
                '   <input type="text" [value]="name">',
                '   <input type="text" [value]="name" [style.display]="name?\'block\':\'none\'">',
                '   <br>',
                '   <button [onclick]="shwo">ShowDialog</button>',
                '</div>'
            ].join(''), {
                    title: 'Game',
                    checked:false,
                    name: name,
                    shwo:function(){
                        common_dialog([
                            '<iframe [onload]="onload" width="@width@" height="@height@"></iframe>'.replace('@width@',window.screen.width).replace('@height@',window.screen.height)
                            ].join(''),{background:'rgba(255,255,255,0.1)',onload:function(iframe){
                                var self = this;
                                var script = iframe.contentDocument.createElement('script');
                                    script.src = url;
                                    script.onload = function(){
                                        setTimeout(function(){
                                            iframe.contentDocument.getElementById('atlwdg-trigger').click();
                                            iframe.contentWindow.addEventListener("message",function(e){
                                                //alert(e.data);
                                                //cancelFeedbackDialog
                                                if(e.data === 'cancelFeedbackDialog'){
                                                    self.$close();
                                                }
                                            });
                                        },500);
                                    };
                                    iframe.contentDocument.head.appendChild(script);
                        }});
                    }
                });
        }
    }]);

})(window.$ehr);


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

/**
 * Created by Administrator on 2017/3/28.
 */
(function ($e) {
    'use strict';

    //界面上的菜单数据以及路由和界面,必须以router.开头
    $e('router.game.poker', ['common_page',function (common_page) {

        return function (name) {
            return common_page([
                '<div>',
                '   <div [ehr.input]="name"></div>',
                '   <div [ehr.checkbox]="name"></div>',
                '</div>'
            ].join(''), {
                    title: 'Game Poker',
                    checked:true,
                    name: name
                });
        }

    }]);

})(window.$ehr);
