
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