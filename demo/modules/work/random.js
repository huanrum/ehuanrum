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
