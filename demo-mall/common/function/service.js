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