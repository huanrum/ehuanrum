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

    $e('control.ehr.file', ['value','binding','common_file',function (value,binding,common_file) {
        return function (element, data, field) {
            binding('<input type="file" [onchange]="onchange">', {
                onchange: function (e) {
                    if (e.target.files.length > 0) {
                        var reader = new FileReader();
                        var file = e.target.files[0];
                        reader.onload = function () {
                           value(data,field,common_file(file)(reader.result));
                        };
                        reader.readAsText(file,'gb2312');
                    }
                }
            }, element);
        }
    }]);

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

window.$ehr('control.my.drag', ['value', 'common_drag', function (value, common_drag) {

    return function (element, data, field) {
        setTimeout(function () {
            element.parentNode.style.position = 'relative';
            element.style.position = 'absolute';
            element.style.left = element.offsetLeft + 'px';
            element.style.top = element.offsetTop + 'px';
        }, 500);

        common_drag(element, function () {
            return value(data, field);
        });
    };
}]);
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
                '       <div [field:fields] class="form-row" [my.label.value]="'+field+':field">',
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
                    common_dialog('<div [my.form]="item"></div>', {title:'展示一条数据',item:item,buttons:{
                        'ok':function(){common_dialog('提交数据')(this.$close);},
                        'cancel':function(){this.$close();}
                    }});
                }
            }, ['height',field]);
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
                '   <div class="table-header">',
                '       <div class="table-row">',
                '           <div [column:columns] [innerHTML]="column|capitalize" [class]="\'cell-\' + $index"></div>',
                '       </div>',
                '   </div>',
                '   <div class="table-body" [style.height]="height">',
                '       <div [item:items] class="table-row" [ondblclick]="show(item)" [onclick]="select">',
                '           <div [column:columns] [class]="\'cell-\' + $index" [innerHTML]="item[column]"></div>',
                '       </div>',
                '   </div>'
            ].join(''), newData, element);
        }
    }]);

})(window.$ehr);
(function ($e) {
    'use strict';

    //定义自己的指令,必须以control.开头,使用的时候[ehr.input]="field",定义的时候有三个参数,第一个参数是指令所在的元素,第二个参数是元素关联的数据,第三个参数是field(调用时候传的参数名)

    $e('control.my.label.value', ['binding', function (binding) {
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
                '       <input [value]="username">',
                '   </div>',
                '   <div>',
                '       <label>Password</label>',
                '       <input [value]="password">',
                '   </div>',
                '<div><button [onclick]="'+field+'(username,password)">Login</button></div>',
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
    $e('common.dialog',['functions_event','common_drag',function(functions_event,common_drag){
        return function(child,data,controller){
            data = data || {};
            var event = functions_event(data);
            data.buttons = data.buttons || {};
            data.$close = function(){
                dialog.update();
                data.$destroy();
                event.fire(data,dialog);
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
                '           <a [btn:buttons] [onclick]="btn" [innerHTML]="$index|capitalize"></a>',
                '       </div>',
                '   </div>',
                ' </div>'
                ].join(''),data,document.body,controller);

                common_drag([dialog[0].getElementsByClassName('common-dialog')[0], dialog[0].getElementsByClassName('common-dialog-header')[0]]);
                return event.in;
        }
    }]);

})(window.$ehr);

window.$ehr('common.drag', [function () {
    return function drag(element, toParent) {
        var temp = {}, dragElement = element,canDrag = function(){return true;};
        if (element instanceof Array) {
            dragElement = element[1];
            element = element[0];
        }
        if (typeof toParent === 'function') {
            canDrag = toParent;
            toParent = null;
        }

        dragElement.addEventListener('mousedown', function (e) {
            var style = window.getComputedStyle(element);
            if (e.clientX < (parseInt(style.left) || 0) + (parseInt(style.width) || 0) - 15 ||
                e.clientY < (parseInt(style.top) || 0) + (parseInt(style.height) || 0) - 15) {
                mousedown(e);
            }
        });

        window.addEventListener('mouseup', function () {
            temp.e = null;
            element.style.cursor = 'default';
            Array.prototype.forEach.call(element.children, function (child) {
                child.style.cursor = element.style.cursor;
            });
            window.removeEventListener('mousemove', mousemove);
            if (toParent && toParent !== element.parentNode) {
                toParent.appendChild(element);
            }
            if (element.recycle && element.parentNode) {
                element.parentNode.removeChild(element);
            }
        });

        return function (e, recycle) {
            element.style.position = 'fixed';
            element.style.left =  e.clientX - 10 + 'px';
            element.style.top = e.clientY - 10 + 'px';
            mousedown(e);
            if (recycle) {
                window.addEventListener('mousemove', recycleOverlap);
            }
            function recycleOverlap() {
                if (!element.parentNode) {
                    window.removeEventListener('mousemove', recycleOverlap);
                }
                if(!temp.e){return;}
                element.recycle = overlap(element, recycle);
                element.style.cursor = element.recycle ? 'url(resource/delete.ico),move' : 'default';
                Array.prototype.forEach.call(element.children, function (child) {
                    child.style.cursor = element.style.cursor;
                });
            }
        };

        function overlap(element, recycle) {
            var containerRect = recycle.getBoundingClientRect();
            var selfRect = element.getBoundingClientRect();
            return !(beyond(containerRect.left, containerRect.right, selfRect.left) ||
                beyond(containerRect.left, containerRect.right, selfRect.right) ||
                beyond(containerRect.top, containerRect.bottom, selfRect.top) ||
                beyond(containerRect.top, containerRect.bottom, selfRect.bottom));

            function beyond(a, b, num) {
                return num < Math.min(a, b) || num > Math.max(a, b);
            }
        }

        function mousedown(e) {
            var style = window.getComputedStyle(element);
            temp.e = e;
            temp.x = e.clientX - (parseInt(style.left) || 0);
            temp.y = e.clientY - (parseInt(style.top) || 0);
            element.style.cursor = 'move';
            window.addEventListener('mousemove', mousemove);
        }
        function mousemove(e) {
            if(canDrag(e)){
                element.style.left = e.clientX - temp.x + 'px';
                element.style.top = e.clientY - temp.y + 'px';
            }
        }
    };
}]);
(function ($e) {
    'use strict';

    //定义自己的功能,由于参数明不能带.所以使用的时候可以用_代替
    $e('common.file', function () {
        var functions = {
            csv: [csv_read, csv_write]
        };


        return function (file) {
            switch (file.type) {
                case 'application/vnd.ms-excel':
                    return transe('csv');
                default:
                    return function (i) { return i; };
            }
        };

        function transe(type) {
            return function (data) {
                if (typeof data === 'string') {
                    return functions[type][0](data);
                } else {
                    return functions[type][1](data);
                }
            }
        }

        function csv_read(data) {
            //字符串为解析,否则为构建
            return data.split(/[\n\b]/).filter(function(i){return !!i.trim();}).map(function (str) {
                var replaces = /\".*\"/.exec(str) || [];
                replaces.forEach(function (rep, index) {
                    str = str.replace(rep, '{{' + index + '}}');
                });
                return str.replace(/\r/, '').split(',').map(function (res) {
                    replaces.forEach(function (rep, index) {
                        res = res.replace('{{' + index + '}}', rep.slice(1,-1));
                    });
                    return res;
                });
            });
        }

        function csv_write() {

        }
    });

})(window.$ehr);
(function ($e) {
    'use strict';

    //定义自己的功能,由于参数明不能带.所以使用的时候可以用_代替
    $e('common.page',function(){
        return function(child,data,controller){
           
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
            ].join(''),data,controller);
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
        };

    }]);


})(window.$ehr);

/**
 * Created by Administrator on 2017/3/28.
 */
(function ($e) {
    'use strict';

    //界面上的菜单数据以及路由和界面,必须以router.开头
    $e('router.game.phone', ['common_page','common_dialog',function (common_page,common_dialog) {

        return function (name) {
            return common_page([
                '<div>',
                '   <div [my.login]="login"></div>',
                '</div>'
            ].join(''), {
                    title: 'Game Phone',
                    username: name,
                    login:function(username,password){
                        console.log(username,password);
                        common_dialog(username+' - '+password,{title:'Login Message'});
                    }
                });
        };

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
        };
    }]);

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
        };
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
    $e('router.work.binding', ['common_page', 'common_dialog', 'functions', function (common_page, common_dialog, functions) {

        return function (name) {
            var binding = common_page([
                '<div>',
                '    <br>',
                '    <div [ehr.file]="csv"></div>',
                '      <button [onclick]="showCsv(csv)">showCsv</button>',
                '    <br>',
                '    <div [style.color]="color()" [style.fontSize]="index+\'px\'" [innerHTML]="index"> </div>',
                '    <div [innerHTML]="name|capitalize(index)"></div>',
                '</div>'
            ].join(''), {
                    title: 'Binding',
                    name: name,
                    index: 0,
                    color: function () {
                        return functions.color(this.index);
                    }
                }, function (scope) {
                    var handel = setInterval(function () {
                        scope.index = Math.floor(Math.random() * 100);
                    }, 1000);

                    scope.showCsv = function (array) {
                        if (array instanceof Array) {
                            var items = [];
                            for (var i = 1; i < array.length; i++) {
                                var item = {};
                                array[0].forEach(function (f, j) {
                                    item[f] = array[i][j];
                                });
                                items.push(item);
                            }
                            common_dialog('<div [my.grid]="items">', { title: '显示读取的文件', height: '30em', items: items });
                        } else {
                            common_dialog(array, { title: '显示读取的文件', height: '30em' });
                        }

                    };


                    scope.$destroy(function () {
                        clearInterval(handel);
                    });
                });

            return binding;
        };
    }]);


})(window.$ehr);

/**
 * Created by Administrator on 2017/3/28.
 */
(function ($e) {
    'use strict';

    //界面上的菜单数据以及路由和界面,必须以router.开头
    $e('router.work.random', ['common_page', 'random', function (common_page, random) {

        return function (name) {
            var binding = common_page([
                '<div>',
                '    <br>',
                '    <div [item:items] style="display:inline-table;margin:1em;">',
                '       <div [innerHTML]="item.info"></div>',
                '       <textarea [value]="item.model" [onkeyup]="random(item,$element)" style="width:300px;height:200px;"></textarea>',
                '       <br>',
                '       <button [onclick]="random(item)">random</button>&nbsp;<button [onclick]="copy(item)">copy</button>',
                '       <div [innerHTML]="item.value" style="width:300px;word-wrap:break-word;"></div>',
                '    </div>',
                '</div>'
            ].join(''), {
                    title: 'Random',
                    name: name,
                    items: [
                        { model: '"[1970-2020]-[1-12]-[1-30] [(AP)1]M [0-12]:[0-59]:[0-59]"', info: '时间' },
                        { model: '"Name-[(a-z)3-5]"', length: '3-7', info: '字符串数组' },
                        { model: '{"name":"data-[(0-9)8]","list:3-6":{"id":"[1+2]","index":"[0-999]","type":"[(a-Z)3-6]","other[()1-5]":"[()3-7]"}}', info: '对象(里面带有数组)' },
                        { model: '"[(0-9)]"', info: '数字,任意位数' }
                    ],
                    random: function (item, element) {
                        if (item.model) {
                            if (this.items[this.items.length - 1] === item) {
                                this.items = this.items.concat([{}]);
                                if (element && document.activeElement !== element) {
                                    element.focus();
                                }
                            }
                            item.value = JSON.stringify(random(JSON.parse(item.model), item.length));
                        }
                    },
                    copy: function (item) {
                        var textarea = document.createElement("textarea");
                        document.body.appendChild(textarea);
                        textarea.value = item.value;
                        textarea.select(); // 选择对象 
                        document.execCommand("Copy");
                        document.body.removeChild(textarea);
                    }
                }, function (scope) {
                    scope.items.forEach(function (item) {
                        item.value = JSON.stringify(random(JSON.parse(item.model), item.length));
                    });
                });

            return binding;
        };
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
        };

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
        };

    }]);

})(window.$ehr);
