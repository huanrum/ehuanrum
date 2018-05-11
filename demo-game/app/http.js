$ehr('http', ['global', 'binding', function (global, binding) {
    return function (url, parms, bodyData) {
        var fullUrl = initParms(url, parms || {});

        var loading = binding([
            '<div class="common-dialog-back">',
            '   <div class="common-dialog">',
            '      <strong [innerHTML]="loadMessage + \'(\' +floor(remaining/2)+ \'s)\' + index" [hidden]="!remaining"></strong>',
            '      <span [hidden]="!!remaining">加载已经超时</span>',
            '  </div>',
            '</div>',
        ].join(''), { loadMessage: '加载中', index: '...', remaining: 2*30,floor:function(i){return Math.floor(i);} }, document.body, function (scope) {
            var index = 0;
            var hald = setInterval(function () {
                index = (index + 1) % 16;
                scope.index = Array(index + 4).join('.');
                scope.remaining = scope.remaining - 1;
                if (!Math.floor(scope.remaining)) {
                    setTimeout(function () {
                        loading.update();
                    }, 3 * 1000);
                }
            }, 500);
            scope.$destroy(function () {
                clearInterval(hald);
            });
        });



        return new Promise(function (resolve, reject) {
            var options = {
                headers:{owner:global.user},
                method:bodyData?'POST':'GET'
            };
            if (!fullUrl) {
                reject({ message: '参数不完整' });
            }
            if(bodyData){
                options.body = JSON.stringify(bodyData);
            }
            fetch(global.service + fullUrl,options).then(function (response) {
                loading.update();
                return response.json();
            }, function (err) {
                loading.update();
                reject(err);
            }).then(function (json) {
                resolve(json);
            });
        });
    };


    function initParms(url, parms) {
        var parmsStr = Object.keys(parms).sort(function (a, b) {
            return /:/.test(b.name) - /:/.test(a.name);
        }).map(function (key) {
            if (url.indexOf(':' + key) !== -1) {
                url = url.replace(':' + key, parms[key]);
            } else {
                return key + '=' + parms[key];
            }
        }).filter(function (i) { return !!i; }).join('&');

        if (url.indexOf(':') === -1) {
            return url + (parmsStr ? ('?' + parmsStr) : '')
        }
    }

}]);