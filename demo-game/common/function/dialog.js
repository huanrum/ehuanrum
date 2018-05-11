
$ehr('common.dialog', ['binding',function (binding) {
    return function (child, data) {
        data = data || {};
        data.buttons = data.buttons || [];
        data.$close = function () {
            dialog.update();
        };
        var dialog = binding([
            ' <div class="common-dialog-back">',
            '   <div class="common-dialog" [style.background]="background">',
            '       <div class="common-dialog-header">',
            '           <label>',
            data.title || 'no title',
            '           </label>',
            '           <a [onclick]="$close">&times;</a>',
            '       </div>',
            '       <div class="common-dialog-content">',
            child,
            '       </div>',
            '       <div class="common-dialog-footer">',
            '           <a [btn:buttons] [onclick]="btn" [innerHTML]="btn.name"></a>',
            '       </div>',
            '   </div>',
            ' </div>'
        ].join(''), data, document.body);

        dialog.forEach(function (dia) {
            drag(dia.getElementsByClassName('common-dialog-header')[0], dia.getElementsByClassName('common-dialog')[0]);
        });

        return dialog;
    };

    function drag(canDragElement, element) {
        var temp = {};
        canDragElement.addEventListener('mousedown', function (e) {
            var style = window.getComputedStyle(element);
            if (e.clientX < (parseInt(style.left) || 0) + (parseInt(style.width) || 0) - 15 ||
                e.clientY < (parseInt(style.top) || 0) + (parseInt(style.height) || 0) - 15) {
                mousedown(e);
            }
        });
        window.addEventListener('mouseup', function () {
            temp.e = null;
            element.style.cursor = 'default';
            window.removeEventListener('mousemove', mousemove);
        });
        function mousedown(e) {
            var style = window.getComputedStyle(element);
            temp.e = e;
            temp.x = e.clientX - (parseInt(style.left) || 0);
            temp.y = e.clientY - (parseInt(style.top) || 0);
            element.style.cursor = 'move';
            window.addEventListener('mousemove', mousemove);
        }
        function mousemove(e) {
            element.style.left = e.clientX - temp.x + 'px';
            element.style.top = e.clientY - temp.y + 'px';
        }
    }
}]);