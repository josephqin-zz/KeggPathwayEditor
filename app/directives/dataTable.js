angular
	.module('MyApp')
	.directive('myTable',function(){
		return {
			restrict:'E',
			scope:{
				tableData:'='
			},
			controller:['$scope',function($scope){
				

				$scope.$watch('tableData',function(newVal,oldVal){
					if(!newVal){return;}
					$scope.columns = Object.keys(newVal[0]);

					// console.log(newVal);



				})
			}],
			templateUrl:'app/templates/dataTable.htm'
		}

	})