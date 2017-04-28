
$ehr('personal', ['binding', 'global','common_dialog', function (binding, $global,common_dialog) {

    var clientId = Date.now(), template = [
        '<div>',
        '   <div [innerHTML]="title"></div>',
        '   <div [value:item]>',
        '       <label [innerHTML]="$index"></label>',
        '       <div [innerHTML]="value"></div>',
        '   </div>',
        '   <button [onclick]="connection">Connection</button>',
        '</div>'
    ].join('');

    return function (user) {
        binding(template, function (scope) {
            scope.title = '个人信息';
            scope.item = {
                id: clientId,
                name: user,
                email: 'huanrum@126.com'
            };

            scope.connection = function () {
                connection(scope.item);
            };
        }, 'personal');
    };


    function connection(item) {
        var scope = { title: 'connection', friends: [], messageDialog: messageDialog };

        var ws = new WebSocket($global.websocket);
        ws.onopen = function (e) {
            ws.send(JSON.stringify({action: 'login',data: item.id}));
        };
        ws.onmessage = function (e) {
            var dataMessage = JSON.parse(e.data);
            switch (dataMessage.action) {
                case 'login':
                    if (dataMessage.from) {
                        scope.friends = scope.friends.concat([{ id: dataMessage.from, messageList: [] }]);
                    } else {
                        scope.friends = dataMessage.data.map(function (i) { return { id: i, messageList: [] } });
                    }

                    break;
                case 'logout':
                    scope.friends = scope.friends.filter(function (i) { return i.id !== dataMessage.from; });
                    break;
                default:
                    var friend = scope.friends.find(function (i) { return i.id === dataMessage.from; });
                    if (friend) {
                        friend.messageList = friend.messageList.concat([{
                            get: true,
                            value: dataMessage.data
                        }]);
                    }
                    break;
            }
        };

        common_dialog([
            '<div [friend:friends]>',
            '   <span [innerHTML]="friend.id" [onclick]="messageDialog(friend)"></span>',
            '</div>'
        ].join(''), scope);

        scope.$destroy(function () {
            ws.send(JSON.stringify({action: 'logout'}));
            ws.close();
        });

        function messageDialog(friend) {
            var data = {
                title: friend.id,
                messages:friend.messageList,
                buttons: [function send() {
                    friend.messageList = friend.messageList.concat([{ value: this.messageContent }])
                    ws.send(JSON.stringify({
                        to: [friend.id],
                        data: this.messageContent
                    }));
                }]
            };

            Object.defineProperty(friend, 'messageList', {
                configurable: true,
                get: function () { 
                    return data.messages; 
                },
                set: function (val) { 
                    data.messages = val; 
                }
            });

            common_dialog([
                '<div style="max-height:20em;overflow: auto;">',
                '   <div [message:messages] [innerHTML]="message.value" [style.color]="message.get?\'#d3d3d3\':\'#66dd66\'" [class]="message.get?\'text-left\':\'text-right\'"></div>',
                '</div>',
                '<br>',
                '<textarea [value]="messageContent"></textarea>'
            ].join(''), data);
        }
    }

}]);