/**
 * Created by Administrator on 2017/3/28.
 */
(function ($e) {
    'use strict';

    //功能部分
    $e('functions.color', function () {
        //根据index计算出一种颜色
        return function (index) {
            if (!index) {
                var color = Math.floor(Math.random() * 256 * 256 * 256).toString(16).slice(-6);
                while (color.length < 6) {
                    color = 0 + color;
                }
                return '#' + color;
            } else {
                if (typeof index !== 'number') {
                    index = 0;
                    Array.prototype.forEach.call('' + index, function (i) {
                         index = index + i.charCodeAt(); 
                    });
                }
                return '#' + new Date(10000).setYear(index).toString(16).slice(-8, -2);
            }
        };
    });

    $e('functions.event', function () {
        //构建一个事件对象
        return function (scope) {
            var thenlist = [];

            function push(fn){
                thenlist.push(fn);
                return push;
            }
            return Object.create({
                in: push,
                out: function (fn) {
                    if (!fn) { return; };
                    thenlist = thenlist.filter(function (i) {
                        return (typeof fn === 'function' && i !== fn) ||
                            (typeof fn === 'string' && i.name !== fn)
                    });
                },
                fire: function () {
                    var args = arguments;
                    thenlist.forEach(function (fn) { fn.apply(scope, args); });
                }
            })
        }
    });

    $e('functions.style', function () {
        var style = document.createElement('style');
        style.id = 'functions.style';
        document.head.appendChild(style); 
        return function (content) {
            style.innerHTML += '\r\n' + content;
        };
    });

})(window.$ehr);