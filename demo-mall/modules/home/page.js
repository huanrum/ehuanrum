
$ehr('router.home',['common_page',function(common_page){

    var template = [
        '<div>{brief}</div>',
        '<br>',
        '<div>{info}</div>',
        '<br>',
        '<hr>',
        '<div>{contact}</div>'
    ].join('');

    return function(){
        return common_page(template,{title : 'Home'},function(data){
            data.brief = '这是一个模拟网络商场以及产品管理的项目，里面主要包含用户个人信息，商品展示，购物车等等';
            data.info = [
                '此项目中主要包含两个分块：商品展示和商品管理。',
                '   商品展示：用户可以浏览所有商品，都可以点击购买，加入购物车，查看相信信息等等。',
                '   商品管理：商场管理人员查看销售情况以及库存信息，分析商品的销售趋势，以便于后期的囤货。',
                '   ',
                '   '
            ].join('<br>');
            data.contact = 'email: <i>huanrum@126.com</i>';
        });
    };

}]);