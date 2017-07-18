
ehr('router.shop', ['binding', '$global','http', function (binding,$global, http) {

    var template = `<div refresher>
                        <div class="item" [item:items]>
                            <div class="item-content">
                                <div>{{item.name}}</div>
                            </div>
                        </div>
                    <div>`;

    return function (name) {
        update();
        binding(template, controller);
    };

    function update() {
        $global.title = 'Shop';
        $global.left.icon = 'assets/img/global-controls/icon-lock.svg';
        $global.right.icon = '';
    }

    function controller(scope) {
        scope.items = [];
        http('/book/shop',{pageSize:10,pageNumber:1}).then(function(req){
            scope.items = req.data.list;
        });
    }
}]);
