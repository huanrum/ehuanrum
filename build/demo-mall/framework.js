/**
 * Created by Seto Sun on 2017/3/28.
 */
(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
        typeof define === 'function' && define.amd ? define(factory) :
            (global.$ehr = factory());
})(this, (function (_eval) {
    'use strict';

    var chaceData = { temp: {}, data: {}, load: [], binding$id: 0 };

    if (window) {
        chaceData.menu = document.createElement('div');
        chaceData.content = document.createElement('div');
        chaceData.menu.className = 'ehuanrum-menu';
        chaceData.content.className = 'ehuanrum-content';
        //界面加载完成后去主动给界面做数据绑定处理
        window.addEventListener('load', function () {
            var routerUrl = {}, paths = location.hash.replace('#', '').split('/');
            binding(document.body, window);

            chaceData.menu.appendChild(__createMenu(ehuanrum('router') || {}, routerUrl, go, ''));

            if (ehuanrum('main')) {
                ehuanrum('main')(goin);
            } else {
                goin();
            }

            function goin() {
                document.body.appendChild(chaceData.menu);
                document.body.appendChild(chaceData.content);
                go('/' + paths.filter(function (i) { return !!i; }).join('/'), paths.pop() || paths.pop());
            }

            function go(menu) {
                if (typeof menu === 'string') {
                    if (/^router\./.test()) {
                        arguments[0] = routerUrl[menu.replace('.', '/').replace('router', '/')];
                    } else {
                        arguments[0] = routerUrl[menu];
                    }
                    go.apply(this, arguments);
                } else if (typeof menu === 'function') {
                    chaceData.content.innerHTML = '';
                    menu.apply(this, Array.prototype.slice.call(arguments, 1));
                }
            }
        });
    }

    //把下面的两个功能提供出去
    ehuanrum('filter', function () { return filter; });
    ehuanrum('binding', function () { return binding; });
    ehuanrum('value', function () { return $value; });


    return function () {
        return ehuanrum;
    };

    //用来做依赖相关的处理，这是这个框架的入口
    function ehuanrum(field, value) {
        field = field || '';
        if (typeof field !== 'string') {
            //如果第一个参数是方法就表示是要添加界面加载完成和关闭界面的时候需要的事件处理
            if (typeof field === 'function' && window) {
                window.addEventListener('load', field);
                if (typeof value === 'function') {
                    //$window.addEventListener('unload',value);
                    window.addEventListener('beforeunload', value);
                }
                //如果是布尔量就表示要设置全局的绑定相关的信息是否显示在界面
            } else if (typeof field === 'boolean') {
                chaceData.binding = field;
                //如果是数字就表示要设置版本号
            } else if (typeof field === 'number') {
                chaceData.version = field;
                //其他的都认为是需要主动做数据双向绑定处理的，最好是DOM元素否则会报错，至于其他类型等以后再加
            } else {
                binding(field, value)
            }
            return;
        }

        //field可能是a.b这样的结构所以需要拆分
        field = field.trim().replace(/_/g, '.');

        if (field[0] === '>') {
            return chaceData.temp[field.slice(1)];
        }

        //如果有两个参数，就是存数据
        if (value) {
            //如果以.结束的field是为了把value在包裹一下
            if (field[field.length - 1] === '.') {
                var $value = value;
                field = field.slice(0, field.length - 1);
                value = function () { return $value; };
            }
            chaceData.temp[field] = value;

        } else {
            if (!Object.getOwnPropertyNames(chaceData.data).length) {
                var temp = chaceData.temp;
                chaceData.temp = {};
                Object.keys(temp).sort(function (a, b) { return a.length - b.length; }).forEach(function (field) {
                    chaceData.temp[field] = temp[field];
                });
            }

            //如果第一个参数为假时返回整个缓存
            if (!field) {
                return chaceData.data;
                //如果temp里面已经有了就可以计算出缓存值
            } else if (chaceData.temp[field]) {
                var tempField, fields = field.split('.'), lastField = fields.pop(), chaceTempData = chaceData.data;
                value = chaceData.temp[field];

                while (fields.length) {
                    tempField = fields.shift();
                    chaceTempData = chaceTempData[tempField] = chaceTempData[tempField] || {};
                }
                if (!chaceTempData[lastField] && value) {
                    if (typeof value === 'function' || (value instanceof Array && typeof value[value.length - 1] === 'function')) {
                        var parameters = [];
                        if (typeof value === 'function') {
                            var str = value.toLocaleString().slice(value.toLocaleString().indexOf('(') + 1, value.toLocaleString().indexOf(')'));
                            parameters = str ? str.split(',') : [];
                        } else {
                            var fn = value.pop();
                            parameters = value;
                            value = fn;
                        }

                        for (var i = 0; i < parameters.length; i++) {
                            if (parameters[i].trim().toLocaleLowerCase() === 'self') {
                                parameters[i] = chaceData.data[field.split('.')[0]];
                            } else {
                                parameters[i] = ehuanrum(parameters[i].trim());
                            }
                        }
                        chaceTempData[lastField] = value.apply(value, parameters);
                    } else {
                        chaceTempData[lastField] = value;

                    }
                }
            }

            for (var f in chaceData.temp) {
                if (f !== field && check(f.split('.'), field.split('.'))) {
                    ehuanrum(f);
                }
            }

            var $fields = field.split('.'), $chaceTempData = chaceData.data;
            while ($fields.length > 1) {
                $chaceTempData = $chaceTempData[$fields.shift()];
            }
            return $chaceTempData[$fields.shift()];
        }

        function check(bases, news) {
            for (var ck = 0; ck < news.length; ck++) {
                if (bases[ck] !== news[ck]) {
                    return false;
                }
            }
            return true;
        }
    }

    function filter(str) {
        str = str.replace(/\$\S*\$/, '');
        return str.split(/\s+/).map(function (c) {
            return c[0].toLocaleUpperCase() + c.slice(1);
        }).join('');
    }

    //完成菜单和路由的构建，它是不对外公开的,若外部定义了相关的menuAction操作就用外部的，否则就用默认的
    function __createMenu(menus, router, go, hash) {
        var element = document.createElement('ul');
        Object.keys(menus).forEach(function (m) {
            var menuElement = document.createElement('div');
            var menuSpan = createElement(m, menus[m], (hash || '') + '/' + m.replace(/\$\S*\$/, ''));
            element.appendChild(menuElement);
            menuElement.appendChild(menuSpan);
            if (Object.keys(menus).length) {
                var childMenu = __createMenu(menus[m], router, go, (hash || '') + '/' + m.replace(/\$\S*\$/, ''));
                menuElement.appendChild(childMenu);
                menuSpan.addEventListener('click', menuAction(menuSpan, childMenu, m.replace(/\$\S*\$/, '')));
            }
        });
        return element;


        function menuAction(menuSpan, childMenu, m) {
            if (ehuanrum('menuAction')) {
                return function () {
                    ehuanrum('menuAction')(m, menuSpan, childMenu);
                }
            } else {
                childMenu.style.display = new RegExp('#' + (hash || '') + '/' + m).test(location.hash) ? 'block' : 'none';
                return function () {
                    Array.prototype.forEach.call(this.parentNode.parentNode.children, function (menuEle) {
                        Array.prototype.forEach.call(menuEle.getElementsByTagName('UL'), function (ul) {
                            ul.style.display = 'none';
                        });
                    });
                    childMenu.style.display = childMenu.style.display === 'none' ? 'block' : 'none';
                }
            }
        }

        function createElement(name, menu, fullHash) {
            var parent = document.createElement('span');
            parent.innerHTML = ehuanrum('filter')(name);
            if (ehuanrum('filter.menu')) {
                parent.innerHTML = ehuanrum('filter.menu')(parent.innerHTML, name);
            }

            parent.addEventListener('click', function () {
                if (location.hash !== '#' + fullHash) {
                    location.hash = '#' + fullHash;
                    go(fullHash, name);
                }
            });
            router[fullHash] = menu;
            return parent;
        }
    }

    function __getOwnPropertyDescriptor(obj, field) {
        if (field in obj) {
            while (obj) {
                if (Object.getOwnPropertyDescriptor(obj, field)) {
                    return Object.getOwnPropertyDescriptor(obj, field);
                } else {
                    obj = obj.__proto__;
                }
            }
        }
        return {};
    }

    //给对象设值或取值，field可以是复杂的路径:a.b.0.a
    function $value($obj, $field, $value) {
        if (!/^[0-9a-zA-Z\._$@]*$/.test($field)) {
            //计算表达式
            return _eval($obj, $field, valuer);
        } else {
            //取值
            return valuer($obj, $field, $value);
        }

        function valuer(obj, field, value) {
            field = field || '';
            var fields = field.trim().split('.');
            if (!obj) {
                return;
            }
            if (obj instanceof HTMLElement && ((!fields[0] in obj) && obj.hasAttribute(fields[0]))) {
                var newObj = obj.attributes[fields[0]];
                fields[0] = 'value';
                return valuer(newObj, fields.join('.'), value);
            }
            if (field instanceof Array) {//获取一个真值
                for (var i = 0; i < field.length; i++) {
                    if ((typeof obj[field[i]] === 'number') || obj[field[i]]) {
                        return obj[field[i]];
                    }
                }
                if (!(typeof obj === 'object')) {
                    return obj;
                } else {
                    return null;
                }
            }

            while (fields.length > 1) {
                if (!fields[0].trim()) {
                    fields.shift();
                } else {
                    obj = fill(obj, fields.shift(), true);
                }
            }
            if (!(typeof value === 'undefined')) {
                fill(obj, fields.shift(), true, value);
            } else {
                return fill(obj, fields.shift(), false);
            }
        }

        function fill(ent, tempField, run, val) {
            if (!/\[\d+\]/.test(tempField)) {
                if (run) {
                    if (typeof val === 'undefined') {
                        if (!ent[tempField]) {
                            ent[tempField] = {};
                        }
                    } else {
                        ent[tempField] = val;
                    }
                    ent = ent[tempField];
                } else {
                    return ent[tempField];
                }
            } else {
                var fieldT = tempField.replace(/\[\d+\]/g, '');
                if (fieldT) {
                    ent = ent[fieldT] = ent[fieldT] || [];
                }
                Array.prototype.map.call(tempField.match(/\[\d+\]/g), function (v, i, list) {
                    v = v.replace('[', '').replace(']', '');
                    if (i < list.length - 1) {
                        ent = ent[v] = ent[v] || [];
                    } else {
                        if (run) {
                            ent = ent[v] = (!(typeof val === 'undefined') ? val : ent[v] || {});
                        } else {
                            return ent[v];
                        }
                    }
                });
            }
            return ent;
        }
    };

    //用作双向绑定的功能部分
    function binding(element, data, parentNode) {
        if(typeof parentNode === 'string'){
            chaceData.content.innerHTML = '';
            location.hash = '#' + parentNode.replace(/\./g,'/')
            parentNode = null;
        }
        if (typeof element === 'string') {
            element = createElement(element);
            (parentNode || chaceData.content).appendChild(element);
        }
        if(typeof element[0] === 'string' && typeof element[1] === 'object'){
            Object.keys(element[1]).forEach(function(k){
                element[0] = element[0].replace(new RegExp('\\{\\s*'+k+'\\s*\\}','g'),element[1][k]||'');
            });
            element = createElement(element[0]);
            (parentNode || chaceData.content).appendChild(element);
        }
        if (!element instanceof HTMLElement) {
            throw new Error('element必须是DOM元素。');
        }

        initBindingDefineProperty();
        initBindingElement();
        data.$eval.forEach(function (ev) { ev.fn() });

        extendElement(element, data);

        return element;

        function _$extend(oldObject, newObject, pros) {
            var fromPros = pros, toPros = pros;
            if (!(pros instanceof Array)) {
                fromPros = Object.keys(pros);
                toPros = Object.values(pros);
            }
            toPros.forEach(function (to, i) {
                var from = fromPros[i], tempData = $value(oldObject, from);
                Object.defineProperty(oldObject, from, {
                    configurable: true,
                    enumerable: true,
                    set: function (val) {
                        $value(newObject, to, val);
                    },
                    get: function () {
                        return $value(newObject, to);
                    }
                });
                Object.defineProperty(newObject, to, {
                    configurable: true,
                    enumerable: true,
                    set: function (val) {
                        tempData = val;
                    },
                    get: function () {
                        return tempData;
                    }
                });
            });
            return newObject;
        }

        function initBindingDefineProperty() {
            if (!data.$eval || (data.$eval === data.__proto__.$eval)) {

                Object.defineProperty(data, '$id', { value: ++chaceData.binding$id });
                Object.defineProperty(data, '$eval', { value: [] });
                Object.defineProperty(data, '$real', { value: function () { return JSON.parse(JSON.stringify(data) || 'null'); } });
                Object.defineProperty(data, '$extend', { value: function (newObject, pros) { return _$extend(data, newObject, pros); } });
                Object.defineProperty(data, '$apply', { value: function () { data.$eval.forEach(function (ev) { ev.fn() }); } });

                if (data === window) { return; }//不给window添加set/get
                Object.keys(data).filter(function (i) { return typeof data[i] !== 'function' && !(data[i] instanceof EventTarget); }).forEach(function (pro) {
                    var oldVal = data[pro], descriptor = __getOwnPropertyDescriptor(data, pro) || {};
                    Object.defineProperty(data, pro, {
                        configurable: true,
                        enumerable: descriptor.enumerable,
                        set: function (val) {
                            oldVal = val;
                            if (descriptor.set) {
                                descriptor.set(val);
                            }
                            data.$eval.forEach(function (ev) { ev.fn() });
                        },
                        get: function () {
                            var getValue = (descriptor.get && descriptor.get());
                            return typeof getValue === 'number' ? getValue : (getValue || oldVal);
                        }
                    });
                });
            }
        }

        function initBindingElement() {
            //把[]关起来的属性设置双向绑定
            var controls = ehuanrum('control');
            Array.prototype.filter.call(element.attributes || [], function (attr) {
                return /^\[.+\]$/.test(attr.name);
            }).sort(function (a, b) {
                return /:/.test(b.name) - /:/.test(a.name);
            }).forEach(function (attr) {
                if (!/:/.test(attr.name) && $value(controls, attr.name.slice(1, -1))) {
                    $value(controls, attr.name.slice(1, -1).replace(/[_\-]/g, '.'))(element, data, attr.value);
                } else {
                    defineProperty(element, data, $name(attr.name.slice(1, -1)), attr.value);
                }

                if (!chaceData.binding) {
                    element.removeAttribute(attr.name);
                }
            });

            if (!element.parentNode) { return; }
            initChildren.apply(element, element.children);
        }

        function initChildren() {
            Array.prototype.forEach.call(arguments, function (child) {
                if (!child.scope) {
                    binding(child, data);
                    //DOM元素的孩子是否已经绑定过，绑定过就不要在绑定
                } else if (child.scope() !== data && data !== window) {
                    child.scope().__proto__ = data;
                    data.$eval.push({ eval: '', fn: child.scope().$apply });
                }
            });
        }

        function extendElement(element, data) {
            element.scope = function () {
                return data;
            };

        }

        function $name(name) {
            var replaces = {
                class: 'className',
                fontsize: 'fontSize',
                innerhtml: 'innerHTML'
            };
            var fileds = Object.keys(replaces);
            Object.keys(replaces).forEach(function (field) {
                name = name.replace(field, replaces[field]);
            });
            return name;
        }

        function createElement(string) {
            var parent = document.createElement('div');
            parent.innerHTML = string;
            return parent.children[0];
        }

    };

    ///defineProperty,实现双向绑定
    function defineProperty(element, data, field, value) {
        if (!element.parentNode) { return; }
        //关联的element属性名以on开头的都是事件
        if (/^\s*on/.test(field)) {
            events();
            //以a:b这种结构的是循环此时的value是无意义的
        } else if (/\S+:\S+/.test(field)) {
            foreach(field.split(':'));
            //其他的都是element的普通属性
        } else {
            //简单属性名
            if (/^[0-9a-zA-Z\._$@]*$/.test(value)) {
                if (typeof $value(data, value) === 'function') {
                    $value(element, field, $value(data, value));
                } else {
                    property();
                }
            } else {
                descriptorFileds(data, value, applyElement);
                data.$eval.push({ eval: value, fn: applyElement });
            }
        }

        function applyElement() {
            var regExp = /\|\s*[0-9a-zA-Z_$@]+\s*\(?\S*\)?/g;
            var tempV = $value(data, value.replace(regExp, ''));
            if (value.match(regExp)) {
                value.match(regExp).forEach(function (filter) {
                    var filterFn = filter.split('(')[0].replace('|', '').trim();
                    if (filter.split(/[\(\)]/g)[1]) {
                        var filterArgs = filter.split(/[\(\)]/g)[1].split(',').map(function (arg) {
                            return $value(data, arg.trim());
                        });
                        tempV = ehuanrum('filter.' + filterFn).apply(ehuanrum('filter'), [tempV].concat(filterArgs));
                    } else {
                        tempV = ehuanrum('filter.' + filterFn)(tempV);
                    }
                });
            }
            $value(element, field, tempV);
        }

        function descriptorFileds(data, expression, fn) {
            expression.replace(/\'((?!\').)*\'/g, '').split(/[+\-*/%\|\&\(\)=\?\:,!]/).filter(function (i) { return !!i.trim(); }).forEach(function (fi) {
                if (/\[.*\]/.test(fi)) {
                    fi.match(/\[[0-9a-zA-Z\.]*\]/g).forEach(function (f) {
                        fi = fi.replace(f, '.' + $value(data, f.replace(/[\[\]]/g, '')));
                    });
                }

                var td = data;
                fi.split('.').forEach(function (f) {
                    de(td, f);
                    td = td[f] || {};
                });
            });
            function de(td, tf) {
                var descriptor = __getOwnPropertyDescriptor(td, tf);
                Object.defineProperty(td, tf, {
                    configurable: true,
                    enumerable: descriptor.enumerable,
                    set: function (val) {
                        if (descriptor.set) {
                            descriptor.set(val);
                        } else {
                            descriptor.value = val;
                        }
                        fn();
                    },
                    get: function () {
                        return descriptor.get && descriptor.get() || descriptor.value;
                    }
                });
            }
        }

        //on开头的都被认为是事件
        function events() {
            if (field === 'onload') {
                if (/^[0-9a-zA-Z\._$@]*$/.test(value)) {
                    $value(data, value).call(data, element)
                } else {
                    $value(data, value);
                }
            } else {
                element.addEventListener(field.replace('on', '').trim(), function () {
                    if (/^[0-9a-zA-Z\._$@]*$/.test(value)) {
                        $value(data, value).apply(data, arguments)
                    } else {
                        $value(data, value);
                    }
                });
            }
        }

        function property() {

            var descriptor = __getOwnPropertyDescriptor(data, value) || {};
            data.$eval.push({
                eval: value, fn: function () {
                    $value(element, field, $value(data, value));
                }
            });

            Object.defineProperty(data, value, {
                configurable: true,
                enumerable: descriptor.enumerable,
                set: function (val) {
                    $value(element, field, val);
                    if (descriptor.set) {
                        descriptor.set(val);
                    }
                },
                get: function () {
                    return (field === 'value' && element.value) || (descriptor.get && descriptor.get());
                }
            });
            if (field === 'value') {
                element.addEventListener('keyup', function () {
                    $value(data, value, $value(element, field));
                });
            } else {
                element.addEventListener('click', function () {
                    $value(data, value, $value(element, field));
                });
            }
        }

        function foreach(fields) {
            var elements = [], nextSibling = element.nextSibling,parentNode = element.parentNode, descriptor = __getOwnPropertyDescriptor(data, fields[1]);
            element.parentNode.removeChild(element);
            Object.defineProperty(data, fields[1], {
                configurable: true,
                enumerable: descriptor.enumerable,
                get: function () {
                    return descriptor.get && descriptor.get() || descriptor.value;
                },
                set: function (val) {
                    if (descriptor.set) {
                        descriptor.set(val);
                    } else {
                        descriptor.value = val;
                    }
                    render(val);
                }
            });

            render($value(data, fields[1]));

            function render(vals) {
                elements.forEach(function (it) {
                    if (!vals.some(function (i) { return it.t === i; })) {
                        it.e.parentNode.removeChild(it.e);
                    }
                });
                elements = Array.prototype.map.call(vals, function (item, i) {
                    var bindElement = (elements.find(function (it) { return it.t === item; }) || {}).e;
                    if (!bindElement) {
                        var da = { $index: i };
                        Object.defineProperty(da, '$index', {
                            enumerable: false,
                            get: function () {
                                return $value(data, fields[1]).map(function (x) { return '' + x; }).indexOf('' + item);
                            }
                        });
                        Object.defineProperty(da, fields[0], {
                            configurable: true,
                            enumerable: true,
                            get: function () {
                                return vals[i];
                            },
                            set: function (val) {
                                vals[i] = val;
                            }
                        });
                        da.__proto__ = data;
                        bindElement = binding(element.outerHTML.replace('[' + field + ']=""', ''), da);
                        data.$eval.push({ eval: '', fn: da.$apply });
                    } else {
                        bindElement.scope().$apply();
                    }
                    if(nextSibling){
                        nextSibling.before(bindElement);
                    }else{
                        parentNode.appendChild(bindElement);
                    }
                    return { t: item, e: bindElement };
                });

            }
        }

    };


})(function (_obj, _str, _valuer) {
    with (_obj) {
        return eval(_str);
    }
}));

/**
 * Created by Administrator on 2017/3/28.
 */
(function ($e) {
    'use strict';

    //界面上的菜单数据以及路由和界面,必须以router.开头
    $e('functions.color', function () {
        return function (index) {
            if (!index) {
                var color = Math.floor(Math.random() * 256 * 256 * 256).toString(16).slice(-6);
                while (color.length < 6) {
                    color = 0 + color;
                }
                return '#' + color;
            } else {
                if (typeof index !== 'number') {
                    index = $ehr.sToint('' + index);
                }
                return '#' + new Date(10000).setYear(index).toString(16).slice(-8, -2);
            }
        };
    });

})(window.$ehr);
