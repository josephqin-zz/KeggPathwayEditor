angular
   .module('MyApp')
   .directive('nestSelection',function(){
   	return {
   		restrict:'E',
         // transclude: true,
   		scope:{
            selectName:'@',
   			selectOptions:'=',
   			selectModel:'='
         },
   		controller:['$scope',function($scope){
           
            $scope.resetHierachy = function(){
               $scope.selectModel = [];
            }

            $scope.addHierachy = function(){
               if($scope.selectModel.indexOf($scope.hierarchy)===-1){
                  $scope.selectModel.push($scope.hierarchy);
               }
            }
            
            $scope.deleteHierachy = function(index){
                $scope.selectModel.splice(index,1);
            }
            $scope.resetHierachy()
            $scope.hierarchy = null;
   		}],
   		link: function(scope, element, attrs,controllers){
            

   		},
   		templateUrl:'app/templates/nestSelection.htm'
   	}
   });   