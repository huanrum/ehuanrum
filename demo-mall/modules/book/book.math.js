
$ehr('router.book.math',['common_page','book_math_service',function(common_page,data_service){

    return function(){
         return common_page(null,{title : 'Math'},data_service);
    };

}]);

$ehr('book.math.service',['common_service',function(common_service){

    return common_service({url:'/book/math'});

}]);