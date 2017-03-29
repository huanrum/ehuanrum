(function ($e) {
    'use strict';

    //定义自己的指令,必须以control.开头,使用的时候[ehr.input]="field",定义的时候有三个参数,第一个参数是指令所在的元素,第二个参数是元素关联的数据,第三个参数是field(调用时候传的参数名)

    $e('control.ehr.input',function(binding){
        return function(element,data,field){
            binding('<input [value]="'+field+'">',data).appendTo(element);
        }
    });

    $e('control.ehr.checkbox',function(binding){
        return function(element,data,field){
            binding('<input type="checkbox" [checked]="'+field+'">',data).appendTo(element);
        }
    });

    $e('control.my.login',function(binding){
        return function(element,data,field){
            binding([
                '<div>',
                '   <div>',
                '       <label>UserName</label>',
                '       <input [value]="userName">',
                '   </div>',
                '   <div>',
                '       <label>Password</label>',
                '       <input [value]="password">',
                '   </div>',
                '<div><button [onclick]="'+field+'">Login</button></div>',
                '</div>',
                ].join(''),data).appendTo(element);
        }
    });

    $e('control.my.grid',function(binding,value){
        return function(element,data,field){
            var columns = [];
            value(data,field).forEach(function(it){
                Object.keys(it).forEach(function(k){
                    if(columns.indexOf(k) === -1){
                        columns.push(k);
                    }
                });
            });
            binding([
                '<div >',
                '   <div class="table-header">',
                '       <div class="table-row">',
                '           <div [column:columns] [innerHTML]="column" [class]="\'cell-\' + $index"></div>',
                '       </div>',
                '   </div>',
                '   <div class="table-body">',
                '       <div [item:items] class="table-row">',
                '           <div [column:columns] [innerHTML]="item[column]" [class]="\'cell-\' + $index"></div>',
                '       </div>',
                '   </div>',
                '</div>'
            ].join(''),{
                columns:columns,
                items:value(data,field)
            }).appendTo(element);
        }
    });

})(window.$ehr);