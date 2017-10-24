angular
	.module('MyApp',[])
	.controller('ctableCtrl',['$scope',function($scope){
		$scope.uploadend = false;
        $scope.grouplist = [];
        $scope.selectedRow = [];
        
    	$scope.uploadFile = function(){
            $scope.txtContent = $scope.testFile.map((d,index)=>{d['CohortGroup']=null;d['RowID']=index;return d});
            $scope.selectedRow = [];
            
    	}

        $scope.drawChart = function(){
					
        }

      

       
}]);