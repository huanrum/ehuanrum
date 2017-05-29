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
                '    <br>',
                '    <div>{{title}}</div>',
                '    <input value="{{title}}">',
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
