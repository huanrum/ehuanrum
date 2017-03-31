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