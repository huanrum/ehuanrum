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