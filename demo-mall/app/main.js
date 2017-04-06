
$ehr('main',['global',function(global){
    
    return function(goin){
        if(!global.user){
            $ehr('login').call(this,goin,'seto');
        }else{
            goin();
        }
    };

}]);