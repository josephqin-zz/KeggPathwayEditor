angular
	.module('MyApp')
	.directive('smartSelect',function(){
		return {
			restrict:'E',
			scope:{
				selectionData:'='
			},
			controller:['$scope','$http',function($scope,$http){
				            			
			}],
			templateUrl:'app/templates/smartSelect.htm'
		}

	})