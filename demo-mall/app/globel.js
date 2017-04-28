
$ehr(true);
$ehr('global', ['common_dialog', function (common_dialog) {

    var options = {
        service:{seto:'http://192.168.1.248:8888/mall',127:'http://192.168.1.248:8888/mall',binbin:'http://192.168.1.152:8888/mall'},
        websocket:{seto:'ws://192.168.1.248:8181',127:'ws://192.168.1.248:8181',binbin:'ws://192.168.1.152:8181'}
    };

    var globalData = {
        user: localStorage['ehuanrum_user'],
        websocket:localStorage['ehuanrum_websocket'] || options.websocket.seto,
        service: localStorage['ehuanrum_service'] || options.service.seto,
        update: function (data, user) {
            var self = this;
            Object.keys(data || {}).forEach(function (k) {
                self[k] = data[k];
            });
            Object.keys(data || {}).forEach(function (k) {
                localStorage['ehuanrum_' + k] = data[k];
            });
        }
    };

    window.document.addEventListener('keydown', function (e) {
        if (e.altKey && e.shiftKey && e.ctrlKey) {
            var items = Object.keys(localStorage).filter(function (i) { return /^ehuanrum_/.test(i); }).map(function (i) {
                return { name: i.replace('ehuanrum_', ''), value: localStorage[i],options:options[i.replace('ehuanrum_', '')] };
            });
            if(!items.some(function(i){return i.name === 'service';})){
                items.push({ name: 'service', value: options.service[0],options:options.service});
            }
            common_dialog([
                '<div [item:items] class="form-row label-value">',
                '    <label [innerHTML]="item.name"></label>',
                '    <input [style.display]="!item.options?\'inline-block\':\'none\'"  [value]="item.value">',
                '    <select [style.display]="!!item.options?\'inline-block\':\'none\'" [value]="item.value"><option [op:item.options] [value]="op" [innerHTML]="$index"></select>',
                '</div>'
            ].join(''), {
                    title:'Update Config',
                    items: items,
                    buttons: [function confirm() {
                        var data = {};
                        this.items.forEach(function(item){
                            data[item.name] = item.value;
                            globalData[item.name] = item.value;
                        });
                        globalData.update(data);
                        this.$close();
                    }]
                });
        }
    });

    return globalData;
}]);