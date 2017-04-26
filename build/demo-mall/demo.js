

$ehr('global',function(){
    return {
        service:'http://192.168.1.248:8888/mall',
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
$ehr('http', ['global', 'binding', function (global, binding) {
    return function (url, parms) {
        var fullUrl = initParms(url, parms);

        var loading = binding([
            '<div class="common-dialog-back">',
            '   <div class="common-dialog">',
            '      <strong [innerHTML]="loadMessage + \'(\' +floor(remaining/2)+ \'s)\' + index" [hidden]="!remaining"></strong>',
            '      <span [hidden]="!!remaining">加载已经超时</span>',
            '  </div>',
            '</div>',
        ].join(''), { loadMessage: '加载中', index: '...', remaining: 2*30,floor:function(i){return Math.floor(i);} }, document.body, function (scope) {
            var index = 0;
            var hald = setInterval(function () {
                index = (index + 1) % 16;
                scope.index = Array(index + 4).join('.');
                scope.remaining = scope.remaining - 1;
                if (!Math.floor(scope.remaining)) {
                    setTimeout(function () {
                        loading.update();
                    }, 3 * 1000);
                }
            }, 500);
            scope.$destroy(function () {
                clearInterval(hald);
            });
        });



        return new Promise(function (resolve, reject) {
            if (!fullUrl) {
                reject({ message: '参数不完整' });
            }
            fetch(global.service + fullUrl).then(function (response) {
                loading.update();
                return response.json();
            }, function (err) {
                loading.update();
                reject(err);
            }).then(function (json) {
                resolve(json);
            });
        });
    };


    function initParms(url, parms) {
        var parmsStr = Object.keys(parms).sort(function (a, b) {
            return /:/.test(b.name) - /:/.test(a.name);
        }).map(function (key) {
            if (url.indexOf(':' + key) !== -1) {
                url = url.replace(':' + key, JSON.parse(parms[key]));
            } else {
                return key + '=' + JSON.parse(parms[key]);
            }
        }).filter(function (i) { return !!i; }).join('&');

        if (url.indexOf(':') === -1) {
            return url + (parmsStr ? ('?' + parmsStr) : '')
        }
    }

}]);

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
                        loginElement.update();
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
window.$ehr('control.my.form', ['binding', 'value', 'common_dialog', function (binding, value, common_dialog) {
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
                '       <div [field:fields] class="form-row" [my.label.value]="'+field+':field">',
                '       </div>',
                '   </div>',
            ].join(''), newData, element);
        }
    }]);
(function ($e) {
    'use strict';

    //定义自己的指令,必须以control.开头,使用的时候[ehr.input]="field",定义的时候有三个参数,第一个参数是指令所在的元素,第二个参数是元素关联的数据,第三个参数是field(调用时候传的参数名)

    $e('control.my.grid', ['binding', 'value', 'common_dialog', function (binding, value, common_dialog) {
        return function (element, data, field) {
            var oldColumns = [] ,newData = data.$extend({
                select: data.select,
                show: function (item) {
                    common_dialog('<div [my.form]="item" style="width:20em;"></div>', {title:'展示一条数据',item:item,buttons:{
                        'ok':function(){common_dialog('提交数据')(this.$close);},
                        'cancel':function(){this.$close();}
                    }});
                }
            }, [field]);
            Object.defineProperty(newData, 'columns', {
                configurable: true,
                enumerable: false,
                set:function(v){oldColumns = v;},
                get: function () {
                    var columns = [];
                    (value(data, field)||[]).forEach(function (it) {
                        Object.keys(it).forEach(function (k) {
                            if (columns.indexOf(k) === -1) {
                                columns.push(k);
                            }
                        });
                    });
                    if(Object.keys(oldColumns).join() !== Object.keys(columns).join()){
                        newData.columns = columns;
                    }
                    return columns;
                }
            });

            binding([
                '<div >',
                '   <div class="table-header">',
                '       <div class="table-row">',
                '           <div [column:columns] [innerHTML]="\'\'+column" [class]="\'cell-\' + $index"></div>',
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
window.$ehr('control.my.label.value', ['binding', function (binding) {
        return function (element, data, field) {
            var newData = data.$extend({}, field.split(':'));

            binding([
                '   <div class="label-value">',
                '       <label [innerHTML]="field"></label>',
                '       <div [innerHTML]="item[field]"></div>',
                '   </div>',
            ].join(''), newData, element);
        }
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
                dialog.update();
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
            if (typeof controller === 'function') {
                controller(data);
            }
            if (typeof child === 'string') {
                Object.keys(data).forEach(function (k) {
                    child = child.replace(new RegExp('\\{\\s*' + k + '\\s*\\}', 'g'), data[k] || '');
                });
            } else if(controller.update){
                var dataService = controller;
                controller = null;
                child = '<div [my.grid]="items"></div>';
                dataService.update(function (list,page) {
                    data.items = list;
                    data.page = data.page || {};
                    Object.keys(page||{}).forEach(function(k){
                         data.page[k] = page[k];
                    });
                });
            }


            data.personal = function () {
                $ehr('personal')(global.user);
            };
            return binding([template, {
                title: data.title || 'no title',
                content: child,
                footer: data.footer
            }], data, controller);
        }
    }]);

})(window.$ehr);
(function ($e) {
    'use strict';

    //定义自己的功能,由于参数明不能带.所以使用的时候可以用_代替
    $e('common.service', ['http','functions.event', function (http,functions_event) {

        return function (option) {
            var tempData = {}, updateEvent = functions_event();
            var page = { pageNumber: 1, pageSize: 20 };
            var service = {
                update: function(fn){
                    updateEvent.in(fn);
                    if(tempData.list){
                        fn(tempData.list,page);
                    }
                },
                get: function (filter) {
                    if (filter) {
                        http(option.url, filter).then(function (req) {
                            tempData.list = req.data.list;
                            updateEvent.fire(tempData.list,page);
                        });
                    }
                    return tempData.list;
                },
                select: function (item) {
                    if (item) {
                        tempData.select = item;
                    }
                    return tempData.select;
                }
            };
            service.get(page);
            return service;
        };
    }]);

})(window.$ehr);

$ehr('router.book.math',['common_page','book_math_service',function(common_page,data_service){

    return function(){
         return common_page(null,{title : 'Math'},data_service);
    };

}]);

$ehr('book.math.service',['common_service',function(common_service){

    return common_service({url:'/book/math'});

}]);

$ehr('router.book.story',['common_page','book_story_service',function(common_page,data_service){

    return function(){
        return common_page(null,{title : 'Story'},data_service);
    };

}]);

$ehr('book.story.service',['common_service',function(common_service){

    return common_service({url:'/book/story'});

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