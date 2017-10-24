angular
   .module('MyApp')
   .directive('hierarchySelect',function(){
   	return {
   		restrict:'E',
         // transclude: true,
   		scope:{
   			selectOptions:'=',
   			selectResult:'=',
            yName:'=',
            sMethod:'=',
            withoutBlank:'='
   		},
   		controller:['$scope',function($scope){
            $scope.statisticsMethods = ['median','mean','sum','max','min'];
            
   		}],
   		link: function(scope, element, attrs,controllers){
            

   		},
   		templateUrl:'app/templates/hierarchySelect.htm'
   	}
})