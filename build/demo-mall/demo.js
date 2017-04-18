

$ehr('global',function(){
    return {
        update:function(data,user){
            var self = this;
            Object.keys(data||{}).forEach(function(k){
                self[k] = data[k];
            });
            Object.keys(data||{}).forEach(function(k){
                localStorage['ehuanrum_' + k] = data[k];
            });
        },
        user:localStorage['ehuanrum_user']
    }
});

$ehr('login',['global','binding',function(global,binding){
    var template = [
                '<div class="login-controller">',
                '   <div>',
                '       <label>UserName</label>',
                '       <input [value]="username">',
                '   </div>',
                '   <div>',
                '       <label>Password</label>',
                '       <input [value]="password">',
                '   </div>',
                '<div><button [onclick]="login(username,password)">Login</button></div>',
                '</div>',
                ].join('');

    return function(goin,username){

        var loginElement = binding(template,{
                    username:username,
                    login:function(username,password){
                        global.update({user:username},{user:username});
                        loginElement.parentNode.removeChild(loginElement);
                        goin();
                    }
                },document.body);
    };
}]);

$ehr('main',['global',function(global){
    
    return function(goin){
        if(!global.user){
            $ehr('login').call(this,goin,'seto');
        }else{
            goin();
        }
    };

}]);
(function ($e) {
    'use strict';

    //定义自己的功能,由于参数明不能带.所以使用的时候可以用_代替
    $e('filter.capitalize',function(){
        return function(value,index){
            index = index % value.length;
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
            data.buttons = data.buttons || [];
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
                '           <a [btn:buttons] [onclick]="btn" [innerHTML]="btn.name"></a>',
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
    $e('common.page', ['global', 'binding', function (global, binding) {

        var template = [
            '<div>',
            '   <div class="content-header">',
            '        <div class="left">',
            '           {title} ',
            '        </div>',
            '        <div class="right" [onclick]="personal">',
                        global.user,
            '        </div>',
            '   </div>',
            '   <div class="content-content">',
            '      {content}',
            '   </div>',
            '   <div class="content-footer">',
            '       {footer}',
            '   </div>',
            '</div>'
        ].join('');

        return function (child, data, controller) {
            if (typeof data === 'function') {
                controller = data;
                data = {};
            }
            if (controller) {
                controller(data);
            }
            Object.keys(data).forEach(function (k) {
                child = child.replace(new RegExp('\\{\\s*' + k + '\\s*\\}', 'g'), data[k] || '');
            });

            data.personal = function(){
                $ehr('personal')(global.user);
            };
            return binding([template, {
                title: data.title || 'no title',
                content: child,
                footer: data.footer
            }], data,controller);
        }
    }]);

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
(function ($e) {
    'use strict';

    //定义自己的指令,必须以control.开头,使用的时候[ehr.input]="field",定义的时候有三个参数,第一个参数是指令所在的元素,第二个参数是元素关联的数据,第三个参数是field(调用时候传的参数名)

    $e('control.my.grid', ['binding', 'value', 'common_dialog', function (binding, value, common_dialog) {
        return function (element, data, field) {
            var newData = data.$extend({
                select: data.select,
                show: function (item) {
                    common_dialog(JSON.stringify(item), {});
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
                '           <div [column:columns] [innerHTML]="column" [class]="\'cell-\' + $index"></div>',
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

$ehr('router.home',['common_page',function(common_page){

    var template = [
        '<div>{brief}</div>',
        '<br>',
        '<div>{info}</div>',
        '<br>',
        '<hr>',
        '<div>{contact}</div>'
    ].join('');

    return function(){
        return common_page(template,{title : 'Home'},function(data){
            data.brief = '这是一个模拟网络商场以及产品管理的项目，里面主要包含用户个人信息，商品展示，购物车等等';
            data.info = [
                '此项目中主要包含两个分块：商品展示和商品管理。',
                '   商品展示：用户可以浏览所有商品，都可以点击购买，加入购物车，查看相信信息等等。',
                '   商品管理：商场管理人员查看销售情况以及库存信息，分析商品的销售趋势，以便于后期的囤货。',
                '   ',
                '   '
            ].join('<br>');
            data.contact = 'email: <i>huanrum@126.com</i>';
        });
    };

}]);

$ehr('personal', ['binding', function (binding) {

    var template = [
        '<div>',
        '   <div [innerHTML]="title"></div>',
        '   <div [value:item]>',
        '       <label [innerHTML]="$index"></label>',
        '       <div [innerHTML]="value"></div>',
        '   </div>',
        '</div>'
    ].join('');

    return function (user) {
        binding(template, function (scope) {
            scope.title = '个人信息';
            scope.item = {
                name: user,
                email: 'huanrum@126.com'
            };
        }, 'personal');
    };

}]);