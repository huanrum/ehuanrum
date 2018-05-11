
$ehr('filter.capitalize', function () {
    return function (value, index) {
        index = index % value.length || 0;
        return value.slice(0, index) + value[index].toLocaleUpperCase() + value.slice(index + 1);
    };
});