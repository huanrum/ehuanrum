

$ehr('global',function(){
    return {
        update:function(data,user){
            var self = this;
            Object.keys(data||{}).forEach(function(k){
                self[k] = data[k];
            });
            Object.keys(data||{}).forEach(function(k){
                localStorage['ehuanrum_' + k] = data[k];
            });
        },
        user:localStorage['ehuanrum_user']
    }
});