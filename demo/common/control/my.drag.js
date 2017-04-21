
window.$ehr('control.my.drag', ['value', 'common_drag', function (value, common_drag) {

    return function (element, data, field) {
        setTimeout(function () {
            element.parentNode.style.position = 'relative';
            element.style.position = 'absolute';
            element.style.left = element.offsetLeft + 'px';
            element.style.top = element.offsetTop + 'px';
        }, 500);

        common_drag(element, function () {
            return value(data, field);
        });
    };
}]);