
$ehr(true);

$ehr('../../lib/d3.js');

$ehr('$d3',function(){return window.d3;});

$ehr('global', ['common_dialog', function (common_dialog) {

    var global = {
        service: location.origin + '/ehr/game/',
        update: function (data, user) {
            var self = this;
            return new Promise(function(resolve){
                Object.keys(data || {}).forEach(function (k) {
                    self[k] = data[k];
                });
                Object.keys(data || {}).forEach(function (k) {
                    localStorage['[ehuanrum_game]' + k] = data[k];
                });
                resolve(self);
            });
        }
    };

    Object.keys(localStorage).forEach(function(k){
        if(/^\[ehuanrum_game\]/.test(k)){
            global[k.replace(/^\[ehuanrum_game\]/,'')] = localStorage[k];
        }
    });

    return global;

}]);
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

$ehr('login',['global','binding',function(global,binding){
    var template = [
                '<div class="login-controller">',
                '   <div>',
                '       <label>UserName</label>',
                '       <input [value]="username">',
                '   </div>',
                '   <div>',
                '       <label>Password</label>',
                '       <input [value]="password">',
                '   </div>',
                '<div><button [onclick]="login(username,password)">Login</button></div>',
                '</div>',
                ].join('');

    return function(goin,username){

        var loginElement = binding(template,{
                    username:username,
                    login:function(username,password){
                        global.update({user:username},{user:username});
                        loginElement.update();
                        goin();
                    }
                },document.body);
    };
}]);

$ehr('main',['global','common.dialog',function(global,commonDialog){
    
    return function(goin){

            global.update({OpposingFronts:global.OpposingFronts||10});
            if(!global.user){
                $ehr('login').call(this,goin,'seto');
            }else{
                goin();
        }
    };

}]);
$ehr('router.OpposingFronts', ['binding', '$d3', 'global','common.dialog', 'service.OpposingFronts', function (binding, $d3, global,commonDialog, opposingFronts) {
    return function (ele, a, b) {
        var scope = {
            title: 'Opposing Fronts -> ' + global.OpposingFronts,
            residue:'**',
            maxscore:'**'
        };
        var element = binding('<div @click="selectLevel"><label>{{title}}</label><span style="color: red;font-size: 26px;margin-left: 2em;">{{residue}}</span><a>{{maxscore}}</a></div><div @click="start"></div>', scope);
        var force = $d3.layout.force().linkDistance(300).gravity(0.03).linkStrength(1).friction(0.62).charge(-600);

        setTimeout(function () {
            opposingFronts.get(+global.OpposingFronts).then(function (data) {
                var svg = addEventToD3($d3.select(element[1]).append('svg:svg').attr({
                    'pointer-events': 'all',
                    'width': element[1].offsetWidth - 10,
                    'height': window.innerHeight - 30
                }), force, data).append('svg:g').call($d3.behavior.zoom()
                    .scaleExtent([0.2, 10])
                    .scale(1)
                    .translate([0, 0])
                    .on('zoom', function(){
                        force.refresh({s:$d3.event.scale});
                    }));
                //指定节点数组,指定连线数组
                force.nodes(data.nodes).links(data.links);
                //添加节点 , 添加连线 , 添加文本
                force.on('tick', tick(initLine(svg, force, data.links), initNodes(svg, force, data.nodes), initText(svg, force, data.nodes),toTransform(svg, force,data),score(data)));
                force.start();

                force.refresh = refresh(svg,force,data);
                scope.maxscore = data.score || data.links.length;
                scope.score = data.score || data.links.length;
                scope.start = function () {
                    data.nodes.forEach(function (node) {
                        node.fixed = true;
                    });
                };
                scope.selectLevel = selectLevel;
                setTimeout(scope.start,2000);
            });
        }, 100);

        return element;

        function score(data){
            return function(){
                var residue = data.links.filter(function (d) {return data.links.some(function (l) {return intersect(d, l);}) ;}).length;
                if(residue<scope.score){
                    scope.score = residue;
                    opposingFronts.score(data,residue);
                }
                scope.residue = residue || '完成';
            };
        }
    };

    function selectLevel(){
        commonDialog('<ul style="max-height:400px;overflow: auto;list-style: none;"><li [op:options] style="text-align:center" @click="change(op)">{{op}}</li></ul>',{
            title:'选择等级挑战 '+global.OpposingFronts,
            options:Array(100).fill(1).map(function(v,i){return ''+i;}),
            change:function(op){
                global.update({OpposingFronts:op}).then(function(){
                    window.location.reload();
                });
            }
        });
    }


    function tick() {
        var self = this;
        var fnList = Array.prototype.slice.call(arguments, 0);
        return function () {
            var args = Array.prototype.slice.call(arguments, 0);
            fnList.forEach(function (fn) {
                fn.apply(self, args);
            });
        };
    }

    function refresh(svg,force,data){
        
        var option = {x:20,y:20,s:1,px:0,py:0,ps:1};

        return function(optionEx){

            if(optionEx){
                option.x = option.x + (optionEx.x || 0);
                option.y = option.y + (optionEx.y || 0);
                option.s = optionEx.s || option.s;
                option.px = optionEx.px || option.px;
                option.py = optionEx.py || option.py;
                option.ps = optionEx.ps || option.ps;
            }

            svg.attr('transform', 'translate(' + (option.x+option.px) +','+ (option.y+option.py) + ')' + ' scale(' + (option.s*option.ps) + ')');
        };
    }

    function toTransform(svg,force,data){
        var width = svg[0][0].parentNode.width.baseVal.value - 40;
        var height = svg[0][0].parentNode.height.baseVal.value - 40;
        return function(){
            var minX = Math.min.apply(Math, data.nodes.map(function(i){return i.x;}));
            var minY = Math.min.apply(Math, data.nodes.map(function(i){return i.y;}));
            var maxX = Math.max.apply(Math, data.nodes.map(function(i){return i.x;}));
            var maxY = Math.max.apply(Math, data.nodes.map(function(i){return i.y;}));
            if(data.nodes.some(function(i){return !i.fixed;})){
                force.refresh({
                    px:-minX,
                    py:-minY,
                    ps:Math.min(1,width/(maxX-minX),height/(maxY-minY))
                });
            }
        };
    }


    function initNodes(svg, force, nodes) {
        var svg_nodes = svg.selectAll("circle")
            .data(nodes)
            .enter()
            .append("circle")
            .attr("r", 20)
            .style("fill", function (d, i) {
                return d3.scale.category20()(i);
            })
            .call(force.drag) //使得节点能够拖动
            .on('dblclick', function (d) {
                d.fixed = !d.fixed;
            });
        return function () {
            //更新节点坐标
            svg_nodes.attr("cx", function (d) {
                    return d.x;
                })
                .attr("cy", function (d) {
                    return d.y;
                });
        };
    }

    function initLine(svg, force, links) {
        
        var svg_edges = svg.selectAll("line")
            .data(links)
            .enter()
            .append("line")
            .style("stroke", "#ccc")
            .style("stroke-width", 2);
        return function () {
            //更新连线坐标
            svg_edges.attr("x1", function (d) {
                    return d.source.x;
                })
                .attr("y1", function (d) {
                    return d.source.y;
                })
                .attr("x2", function (d) {
                    return d.target.x;
                })
                .attr("y2", function (d) {
                    return d.target.y;
                }).style("stroke", function (d) {
                    if (links.some(function (l) {return intersect(d, l);})) {
                        return '#ff3636';
                    } else {
                        return '#36ff36';
                    }
                });
        };
    }

    function initText(svg, force, nodes) {
        //添加描述节点的文字
        var svg_texts = svg.selectAll("text")
            .data(nodes)
            .enter()
            .append("text")
            .style("fill", "black")
            .attr("dx", 20)
            .attr("dy", 8)
            .text(function (d) {
                return d.name.replace(/^node\-/i,'');
            }).call(force.drag);
        return function () {
            //更新文字坐标
            svg_texts.attr("x", function (d) {
                    return d.x - 30;
                })
                .attr("y", function (d) {
                    return d.y;
                });
        };
    }

    function intersect(l1, l2) {
        var mult = function(a, b, c){return (a.x - c.x) * (b.y - c.y) - (b.x - c.x) * (a.y - c.y);};

        if(l1.source === l2.source || l1.source == l2.target || l1.target === l2.source || l1.target == l2.target){
            return false;
        }

        if (Math.max(l1.source.x, l1.target.x) < Math.min(l2.source.x, l2.target.x)) {
            return false;
        }
        if (Math.max(l1.source.y, l1.target.y) < Math.min(l2.source.y, l2.target.y)) {
            return false;
        }
        if (Math.max(l2.source.x, l2.target.x) < Math.min(l1.source.x, l1.target.x)) {
            return false;
        }
        if (Math.max(l2.source.y, l2.target.y) < Math.min(l1.source.y, l1.target.y)) {
            return false;
        }
        if (mult(l2.source, l1.target, l1.source) * mult(l1.target, l2.target, l1.source) < 0) {
            return false;
        }
        if (mult(l1.source, l2.target, l2.source) * mult(l2.target, l1.target, l2.source) < 0) {
            return false;
        }
        return true;
    }


    function addEventToD3(svg, force, data){
        var winDialog = null;
        var moveData = {can:false,event:null,target:null};

        svg.on('mousedown', function(){
                if(['circle','text','line'].indexOf($d3.event.target.nodeName)===-1) {
                    moveData.target = $d3.event.target;
                    this.style.cursor = 'move';
                }else{
                    moveData.target = null;
                    this.style.cursor = 'pointer';
                }
            }).on('mouseup', function() {
                if (!moveData.target && (!winDialog||!winDialog[0].parentNode) && !data.links.some(function (d) {return data.links.some(function (l) {return intersect(d, l);}) ;})){
                    opposingFronts.save(data).then(function(){
                        winDialog = commonDialog('可以进入下一级了',{
                            title:'提示',
                            buttons:[function Conform(){
                            global.update({OpposingFronts:+global.OpposingFronts+1}).then(function(){
                                window.location.reload();
                            });
                        }]});
                    });
                }
                moveData.target = null;
                this.style.cursor = 'auto';
            }).on('mousemove', function() {
                if(moveData.event && moveData.target){
                    force.refresh({
                        x:($d3.event.clientX - moveData.event.clientX),
                        y:($d3.event.clientY - moveData.event.clientY)
                    });
                }
                moveData.event = $d3.event;
            });

            window.document.addEventListener('keydown', function (e) {
                if (e.altKey && e.shiftKey && e.ctrlKey) {
                    switch (e.key) {
                        case 'S':
                            opposingFronts.save(data);
                            break;
                    }
    
                }
            });
    
            return svg;
        }

        


}]);


$ehr('service.OpposingFronts', ['http','global','common.dialog',function (http,global,commonDialog) {
    var url = 'OpposingFronts';
    return {
        get:get,
        save:save,
        score:score
    };

    function get(level) {
        return new Promise(function (resolve) {
            http(url,{level:global.OpposingFronts}).then(function(data){
                var sessions = {};
                if(data.nodes){
                    data.nodes.forEach(function(i){sessions[i.session] = true;});
                }

                if(Object.keys(sessions).length){
                    if(Object.keys(sessions).length>1){
                        commonDialog('<ul><li [session:sessions] @click="select(session)">{{session}}</li></ul>',{
                            title:'选择开始结构',
                            sessions:Object.keys(sessions),
                            select:function(session){
                                var filter = function(i){return i.session===session;};
                                done(resolve,{
                                    nodes:data.nodes.filter(filter),
                                    links:data.links.filter(filter)
                                },session);
                                this.$close();
                            }
                        });
                    }else{
                        done(resolve,data,Object.keys(sessions)[0]);
                    }
                }else{
                    done(resolve,data);
                }
            });
        });

        function done(resolve,data,session){
            var nodes = initNodes(data.nodes).sort(function(a,b){return a.primaryKey-b.primaryKey;});
            var links = initLinks(data.links,nodes);
            http(url + '/:session',{session:session}).then(function(score){
                resolve({
                    score:score,
                    save:!session,
                    session:session || (Date.now() + '-' + global.OpposingFronts),
                    nodes: nodes,
                    links: links
                });
            });
        }

        function initNodes(nodes){
            if(nodes && nodes.length){
                return nodes;
            }else{
                return Array(level).fill(1).map(function (v, i) {
                    return {
                        primaryKey: i,
                        name: 'Node-' + i
                    };
                });
            }
        }

        function initLinks(links,nodes){
            if(links && links.length){
                return links;
            }else{
                links = [];
                for (var i = 0; i < level; i++) {
                    for (var j = i; j < level; j++) {
                        if (Math.random() > 0.9) {
                            links.push({
                                target: i,
                                source: j
                            });
                        }
                    }
                }
                return links;
            }
            
        }
    }

    function save(data){
        if(data.save){
            data.save = false;
            return http(url,{},{
                nodes:data.nodes.map(function(i){return {orderIndex:i.primaryKey,name:i.name,session:data.session};}),
                links:data.links.map(function(i){return {target:i.target.primaryKey,source:i.source.primaryKey,session:data.session};})
            });
        }else{
            return Promise.resolve();
        }
    }

    function score(data,value){
        return http(url + '/:session',{session:data.session},{value:value});
    }

}]);

$ehr('control.my.form', ['binding', 'value', 'common_dialog', function (binding, value, common_dialog) {
    return function (element, data, field) {
        var newData = data.$extend({}, [field]);
        Object.defineProperty(newData, 'fields', {
            configurable: true,
            enumerable: false,
            get: function () {
                return Object.keys(value(data, field));
            }
        });

        binding([
            '   <div class="form-body">',
            '       <div [field:fields] class="form-row" [my.label.value]="' + field + ':field">',
            '       </div>',
            '   </div>',
        ].join(''), newData, element);
    }
}]);

$ehr('control.my.label.value', ['binding', function (binding) {
    return function (element, data, field) {
        var newData = data.$extend({}, field.split(':'));

        binding([
            '   <div class="label-value">',
            '       <label [innerHTML]="field"></label>',
            '       <div [innerHTML]="item[field]|lookup(field)"></div>',
            '   </div>',
        ].join('').replace(/item/g, field.split(':')[0]).replace(/field/g, field.split(':')[1]),
            newData, element);
    }
}]);

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

$ehr('filter.capitalize', function () {
    return function (value, index) {
        index = index % value.length || 0;
        return value.slice(0, index) + value[index].toLocaleUpperCase() + value.slice(index + 1);
    };
});