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
                var list = [],isPush = 0,temp = '';str.replace(/\r/, '')
                for(var i=0;i<str.length;i++){
                    if(str[i] === '"'){
                        isPush = !isPush;
                    }
                    if(!isPush && str[i] === ','){
                        list.push(temp);
                        temp = '';
                    }else{
                        temp += str[i]; 
                    }
                }
                list.push(temp);
                return list;
            });
        }

        function csv_write() {

        }
    });

})(window.$ehr);