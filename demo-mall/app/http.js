$ehr('http', ['global',function (global) {
    return function (url, parms) {
        var fullUrl = initParms(url, parms);
        return new Promise(function (resolve, reject) {
            if(!fullUrl){
                reject({message:'参数不完整'});
            }
            fetch(global.service + fullUrl).then(function (response) {
                return response.json();
            },function(err){
                reject(err);
            }).then(function (json) {
                resolve(json);
            });
        });
    };


    function initParms(url,parms) {
        var parmsStr = Object.keys(parms).sort(function (a, b) {
                return /:/.test(b.name) - /:/.test(a.name);
            }).map(function(key){
            if(url.indexOf(':'+key) !== -1){
                url = url.replace(':' + key,JSON.parse(parms[key]));
            }else{
                return key + '=' + JSON.parse(parms[key]);
            }
        }).filter(function(i){return !!i;}).join('&');

        if(url.indexOf(':') === -1){
            return url + (parmsStr?('?'+parmsStr):'')
        }
    }

}]);