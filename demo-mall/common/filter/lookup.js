

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