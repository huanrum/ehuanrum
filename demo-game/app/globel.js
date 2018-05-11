
$ehr(true);

$ehr('../../lib/d3.js');

$ehr('$d3',function(){return window.d3;});

$ehr('global', ['common_dialog', function (common_dialog) {

    var global = {
        service: location.origin + '/ehr/game/',
        update: function (data, user) {
            var self = this;
            return new Promise(function(resolve){
                Object.keys(data || {}).forEach(function (k) {
                    self[k] = data[k];
                });
                Object.keys(data || {}).forEach(function (k) {
                    localStorage['[ehuanrum_game]' + k] = data[k];
                });
                resolve(self);
            });
        }
    };

    Object.keys(localStorage).forEach(function(k){
        if(/^\[ehuanrum_game\]/.test(k)){
            global[k.replace(/^\[ehuanrum_game\]/,'')] = localStorage[k];
        }
    });

    return global;

}]);