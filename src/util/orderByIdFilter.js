// 把对象变为数组，并按照 id 排序
uf.filter('orderById', function () {
    return function (items, field, reverse) {
        var filtered = [];
        angular.forEach(items, function (item, name) {
            item["name"] = name;
            filtered.push(item);
        });
        filtered.sort(function (a, b) {
            return (a[field] > b[field] ? 1 : -1);
        });
        if (reverse) filtered.reverse();
        return filtered;
    };
});
