

$ehr(function(){

    $ehr('home');
});


$ehr('home',['$binding',function(binding){
    binding(`
    <div>
        0 - {{name}}
        <br>
        <input [value]="name"><button @click="manage()">Add</button>
        <br>
        <div [*item]="items">
            <a @click="manage(item)">&times;<a>  <span [onclick]="click($element,item)">Click Me {{name}} {{item}}</span>
        </div>
        <br>
        <div [ehr] (say)="say"></div>
    </div>`,function(scope){
        scope.name = '000111222';
        scope.items = ['aaaa','bbbb','cccc'];
        scope.click = function(element,item){
            console.log(element,item);
            scope.name = item;
        };
        scope.manage = function(item){
            if(!item){
                scope.items.push(Date.now());
            }else{
                scope.items = scope.items.filter(i=>i!==item);
            }
            
        };

        scope.say = function(){
            console.log('say',...arguments);
        };
    });
}]);


$ehr('$control.ehr',['$binding',function(binding){

    return function(elemnet,scope,expression){
        
        binding(`
            <ul>
                <li [*item]="items" (click)="click(item)">
                    <a>{{item}}</a>
                </li>
            <ul/>
        `,function(){
            var newScope = Object.create(scope);
            newScope.click = function(item){
                newScope.$emit('say',item,1,2,3);
            };
            return newScope;
        },elemnet);
    };

}]);