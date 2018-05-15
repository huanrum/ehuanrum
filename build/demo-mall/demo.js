
$ehr(true);
$ehr('global', ['common_dialog', function (common_dialog) {

    var options = {
        service:{seto:location.origin + '/mall',127:'http://127.0.0.1:8888/mall',binbin:'http://192.168.1.152:8888/mall'},
        websocket:{seto:'ws://192.168.1.248:8181',127:'ws://127.0.0.1:8181',binbin:'ws://192.168.1.152:8181'}
    };

    var globalData = {
        user: localStorage['ehuanrum_user'],
        websocket:localStorage['ehuanrum_websocket'] || options.websocket.seto,
        service: localStorage['ehuanrum_service'] || options.service.seto,
        update: function (data, user) {
            var self = this;
            Object.keys(data || {}).forEach(function (k) {
                self[k] = data[k];
            });
            Object.keys(data || {}).forEach(function (k) {
                localStorage['ehuanrum_' + k] = data[k];
            });
        }
    };

    window.document.addEventListener('keydown', function (e) {
        if (e.altKey && e.shiftKey && e.ctrlKey) {
            var items = Object.keys(localStorage).filter(function (i) { return /^ehuanrum_/.test(i); }).map(function (i) {
                return { name: i.replace('ehuanrum_', ''), value: localStorage[i],options:options[i.replace('ehuanrum_', '')] };
            });
            if(!items.some(function(i){return i.name === 'service';})){
                items.push({ name: 'service', value: options.service[0],options:options.service});
            }
            common_dialog([
                '<div [item:items] class="form-row label-value">',
                '    <label [innerHTML]="item.name"></label>',
                '    <input [style.display]="!item.options?\'inline-block\':\'none\'"  [value]="item.value">',
                '    <select [style.display]="!!item.options?\'inline-block\':\'none\'" [value]="item.value"><option [op:item.options] [value]="op" [innerHTML]="$index"></select>',
                '</div>'
            ].join(''), {
                    title:'Update Config',
                    items: items,
                    buttons: [function confirm() {
                        var data = {};
                        this.items.forEach(function(item){
                            data[item.name] = item.value;
                            globalData[item.name] = item.value;
                        });
                        globalData.update(data);
                        this.$close();
                    }]
                });
        }
    });

    return globalData;
}]);
$ehr('http', ['global', 'binding', function (global, binding) {
    return function (url, parms) {
        var fullUrl = initParms(url, parms || {});

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
                url = url.replace(':' + key, parms[key]);
            } else {
                return key + '=' + parms[key];
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

$ehr('filter.capitalize', function () {
    return function (value, index) {
        index = index % value.length || 0;
        return value.slice(0, index) + value[index].toLocaleUpperCase() + value.slice(index + 1);
    };
});


$ehr('filter.lookup', ['http', function (http) {
    var lookupData = {};
    [
        '/book/lookup'
    ].forEach(function (lookupUrl) {
        http(lookupUrl).then(function (req) {
            Object.keys(req.data).forEach(function (key) {
                var items = {};
                req.data[key].forEach(function (item) {
                    items[item.id] = item.name;
                })
                lookupData[key] = items;
            });
        });
    });
    return function (value, type) {
        return lookupData[type] && lookupData[type][value] || value;
    };
}]);

$ehr('common.dialog', ['binding',function (binding) {
    return function (child, data) {
        data = data || {};
        data.buttons = data.buttons || [];
        data.$close = function () {
            dialog.update();
        };
        var dialog = binding([
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
        ].join(''), data, document.body);

        dialog.forEach(function (dia) {
            drag(dia.getElementsByClassName('common-dialog-header')[0], dia.getElementsByClassName('common-dialog')[0]);
        });
    }

    function drag(canDragElement, element) {
        var temp = {};
        canDragElement.addEventListener('mousedown', function (e) {
            var style = window.getComputedStyle(element);
            if (e.clientX < (parseInt(style.left) || 0) + (parseInt(style.width) || 0) - 15 ||
                e.clientY < (parseInt(style.top) || 0) + (parseInt(style.height) || 0) - 15) {
                mousedown(e);
            }
        });
        window.addEventListener('mouseup', function () {
            temp.e = null;
            element.style.cursor = 'default';
            window.removeEventListener('mousemove', mousemove);
        });
        function mousedown(e) {
            var style = window.getComputedStyle(element);
            temp.e = e;
            temp.x = e.clientX - (parseInt(style.left) || 0);
            temp.y = e.clientY - (parseInt(style.top) || 0);
            element.style.cursor = 'move';
            window.addEventListener('mousemove', mousemove);
        }
        function mousemove(e) {
            element.style.left = e.clientX - temp.x + 'px';
            element.style.top = e.clientY - temp.y + 'px';
        }
    }
}]);

$ehr('common.page', ['global', 'binding', function (global, binding) {

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
        } else if (controller.update) {
            var dataService = controller;
            controller = null;
            child = '<div [my.grid]="items"></div><div [my.grid.menu]="page:update"></div>';
            data.page = data.page || {};
            data.update = function () {
                dataService.get(data.page);
            };
            dataService.update(function (list, page) {
                data.items = list;
                Object.keys(page || {}).forEach(function (k) {
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
$ehr('common.service', ['http', 'functions.event', function (http, functions_event) {

    return function (option) {
        var tempData = {}, updateEvent = functions_event();
        var page = { pageNumber: 1, pageSize: 20 };
        var service = {
            update: function (fn) {
                updateEvent.in(fn);
                if (tempData.list) {
                    fn(tempData.list, page);
                }
            },
            get: function (filter) {
                if (filter) {
                    http(option.url, filter).then(function (req) {
                        tempData.list = req.data.list;
                        Object.keys(req.data).forEach(function (key) {
                            if (typeof req.data[key] != 'object') {
                                page[key] = req.data[key];
                            }
                        });
                        updateEvent.fire(tempData.list, page);
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

$ehr('control.my.form', ['binding', 'value', 'common_dialog', function (binding, value, common_dialog) {
    return function (element, data, field) {
        var newData = data.$extend({}, [field]);
        Object.defineProperty(newData, 'fields', {
            configurable: true,
            enumerable: false,
            get: function () {
                return Object.keys(value(data, field));
            }
        });

        binding([
            '   <div class="form-body">',
            '       <div [field:fields] class="form-row" [my.label.value]="' + field + ':field">',
            '       </div>',
            '   </div>',
        ].join(''), newData, element);
    }
}]);

$ehr('control.my.grid', ['binding', 'value', 'common_dialog', function (binding, value, common_dialog) {
    return function (element, data, field) {
        var oldColumns = [], newData = data.$extend({
            select: data.select,
            show: function (item) {
                common_dialog('<div [my.form]="item" style="width:20em;"></div>', {
                    title: '展示一条数据', item: item, buttons: {
                        'ok': function () { common_dialog('提交数据')(this.$close); },
                        'cancel': function () { this.$close(); }
                    }
                });
            }
        }, [field]);
        Object.defineProperty(newData, 'columns', {
            configurable: true,
            enumerable: false,
            set: function (v) { oldColumns = v; },
            get: function () {
                var columns = [];
                (value(data, field) || []).forEach(function (it) {
                    Object.keys(it).forEach(function (k) {
                        if (columns.indexOf(k) === -1) {
                            columns.push(k);
                        }
                    });
                });
                if (Object.keys(oldColumns).join() !== Object.keys(columns).join()) {
                    newData.columns = columns;
                }
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
            '           <div [column:columns] [class]="\'cell-\' + $index" [innerHTML]="item[column]|lookup(column)"></div>',
            '       </div>',
            '   </div>',
            '</div>'
        ].join(''), newData, element);
    }
}]);

$ehr('control.my.grid.menu', ['binding', 'value', function (binding, value) {

    function toArray(scope, total) {
        var befor = [], after = [];
        for (var i = 0; i < Math.floor(total / 2); i++) {
            befor.push(i + 1);
        }
        for (var i = Math.floor(total / 2); i < total; i++) {
            after.push(i + 1);
        }
        scope.befors = befor;
        scope.afters = after;
    }
    return function (element, data, field) {
        var page = field.split(':')[0], update = field.split(':')[1];
        var totalPage = value(data, field.split(':')[0] + '.totalPage') || 1;
        var newData = data.$extend({
            befors: [], afters: [],
            goto: function (num) {
                if (num === true) {
                    num = Math.min(+ value(data, field.split(':')[0] + '.pageNumber') + 1, value(data, field.split(':')[0] + '.totalPage'));
                } else if (num === false) {
                    num = + Math.max(value(data, field.split(':')[0] + '.pageNumber') - 1, 1);
                }
                if (/^\d+$/.test(num)) {
                    if (num > -1 && num - 1 < value(data, field.split(':')[0] + '.totalPage') && ('' + num) !== value(data, field.split(':')[0] + '.pageNumber')) {
                        value(data, field.split(':')[0] + '.pageNumber', num);
                        value(data, field.split(':')[1])();
                    }
                }
            }
        }, field.split(':'));

        Object.defineProperty(value(data, field.split(':')[0]), 'totalPage', {
            configurable: true,
            get: function () { return totalPage; },
            set: function (value) {
                totalPage = value;
                toArray(newData, value);
            }
        });
        toArray(newData, value(data, field.split(':')[0] + '.totalPage'))
        binding([
            '   <ul class="my-grid-menu">',
            '       <li><span [onclick]="goto(1)" [class]="(+@page@.pageNumber)===1&&\'disable\'">First</span></li>',
            '       <li><span [onclick]="goto(false)" [class]="(+@page@.pageNumber)<2&&\'disable\'">Prev</span></li>',
            '       <li [item:befors] [class]="(+@page@.pageNumber)===(+item)&&\'active\'"><span [onclick]="goto(item)" [innerHTML]="item"></span></li>',
            '       <li [style.display]="@page@.totalPage<11?\'none\':\'inline-block\'"><input [value]="@page@.pageNumber" [onkeyup]="goto(@page@.pageNumber)"></li>',
            '       <li [item:afters] [class]="(+@page@.pageNumber)===(+item)&&\'active\'"><span [onclick]="goto(item)" [innerHTML]="item"></span></li>',
            '       <li><span [onclick]="goto(true)" [class]="(+@page@.pageNumber)>(+@page@.totalPage-1)&&\'disable\'">Next</span></li>',
            '       <li><span [onclick]="goto(@page@.totalPage)" [class]="(+@page@.pageNumber)===(+@page@.totalPage)&&\'disable\'">Last</span></li>',
            '   </ul>',
        ].join('').replace(/@page@/g, field.split(':')[0]), newData, element);
    }
}]);

$ehr('control.my.label.value', ['binding', function (binding) {
    return function (element, data, field) {
        var newData = data.$extend({}, field.split(':'));

        binding([
            '   <div class="label-value">',
            '       <label [innerHTML]="field"></label>',
            '       <div [innerHTML]="item[field]|lookup(field)"></div>',
            '   </div>',
        ].join('').replace(/item/g, field.split(':')[0]).replace(/field/g, field.split(':')[1]),
            newData, element);
    }
}]);

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

$ehr('personal', ['binding', 'global','common_dialog', function (binding, $global,common_dialog) {

    var clientId = Date.now(), template = [
        '<div>',
        '   <div [innerHTML]="title"></div>',
        '   <div [value:item]>',
        '       <label [innerHTML]="$index"></label>',
        '       <div [innerHTML]="value"></div>',
        '   </div>',
        '   <button [onclick]="connection">Connection</button>',
        '</div>'
    ].join('');

    return function (user) {
        binding(template, function (scope) {
            scope.title = '个人信息';
            scope.item = {
                id: clientId,
                name: user,
                email: 'huanrum@126.com'
            };

            scope.connection = function () {
                connection(scope.item);
            };
        }, 'personal');
    };


    function connection(item) {
        var scope = { title: 'connection', friends: [], messageDialog: messageDialog };

        var ws = new WebSocket($global.websocket);
        ws.onopen = function (e) {
            ws.send(JSON.stringify({action: 'login',data: item.id}));
        };
        ws.onmessage = function (e) {
            var dataMessage = JSON.parse(e.data);
            switch (dataMessage.action) {
                case 'login':
                    if (dataMessage.from) {
                        scope.friends = scope.friends.concat([{ id: dataMessage.from, messageList: [] }]);
                    } else {
                        scope.friends = dataMessage.data.map(function (i) { return { id: i, messageList: [] } });
                    }

                    break;
                case 'logout':
                    scope.friends = scope.friends.filter(function (i) { return i.id !== dataMessage.from; });
                    break;
                default:
                    var friend = scope.friends.find(function (i) { return i.id === dataMessage.from; });
                    if (friend) {
                        friend.messageList = friend.messageList.concat([{
                            get: true,
                            value: dataMessage.data
                        }]);
                    }
                    break;
            }
        };

        common_dialog([
            '<div [friend:friends]>',
            '   <span [innerHTML]="friend.id" [onclick]="messageDialog(friend)"></span>',
            '</div>'
        ].join(''), scope);

        scope.$destroy(function () {
            ws.send(JSON.stringify({action: 'logout'}));
            ws.close();
        });

        function messageDialog(friend) {
            var data = {
                title: friend.id,
                messages:friend.messageList,
                buttons: [function send() {
                    friend.messageList = friend.messageList.concat([{ value: this.messageContent }])
                    ws.send(JSON.stringify({
                        to: [friend.id],
                        data: this.messageContent
                    }));
                }]
            };

            Object.defineProperty(friend, 'messageList', {
                configurable: true,
                get: function () { 
                    return data.messages; 
                },
                set: function (val) { 
                    data.messages = val; 
                }
            });

            common_dialog([
                '<div style="max-height:20em;overflow: auto;">',
                '   <div [message:messages] [innerHTML]="message.value" [style.color]="message.get?\'#d3d3d3\':\'#66dd66\'" [class]="message.get?\'text-left\':\'text-right\'"></div>',
                '</div>',
                '<br>',
                '<textarea [value]="messageContent"></textarea>'
            ].join(''), data);
        }
    }

}]);