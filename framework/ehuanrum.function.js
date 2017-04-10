/**
 * Created by Administrator on 2017/3/28.
 */
(function ($e) {
    'use strict';

    //功能部分
    $e('functions.color', function () {
        return function (index) {
            if (!index) {
                var color = Math.floor(Math.random() * 256 * 256 * 256).toString(16).slice(-6);
                while (color.length < 6) {
                    color = 0 + color;
                }
                return '#' + color;
            } else {
                if (typeof index !== 'number') {
                    index = $ehr.sToint('' + index);
                }
                return '#' + new Date(10000).setYear(index).toString(16).slice(-8, -2);
            }
        };
    });

     $e('functions.event', function () {
            return function(scope){
                var thenlist = [];
                 
                 return Object.create({
                     in:function(fn){
                        thenlist.push(fn);
                     },
                     out:function(fn){
                         if(!fn){return;};
                        thenlist = thenlist.filter(function(i){
                            return (typeof fn === 'function' && i !== fn) || 
                             (typeof fn === 'string' && i.name !== fn)
                        });
                     },
                     fire:function(){
                        var args = arguments;
                        thenlist.forEach(function(fn){fn.apply(scope,args);});
                     }
                 })
            }
     });

})(window.$ehr);
