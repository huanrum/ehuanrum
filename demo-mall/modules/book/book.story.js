
$ehr('router.book.story',['common_page','book_story_service',function(common_page,data_service){

    return function(){
        return common_page(null,{title : 'Story'},data_service);
    };

}]);

$ehr('book.story.service',['common_service',function(common_service){

    return common_service({url:'/book/story'});

}]);