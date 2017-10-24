angular
	.module('MyApp',[])
	.controller('ctableCtrl',['$scope',function($scope){
		$scope.uploadend = false;
        $scope.grouplist = [];
        $scope.selectedRow = [];
        $scope.tableBody = null;
        $scope.txtContent =[];
    	$scope.uploadFile = function(){
            $scope.txtContent = $scope.testFile.map((d,index)=>{d['CohorGroup']=null;d['RowID']=index;return d});
    	}

        $scope.drawChart = function(){
		      
				
        } 

       
}]);