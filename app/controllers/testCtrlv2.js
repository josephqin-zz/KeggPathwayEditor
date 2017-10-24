angular
	.module('MyApp',[])
	.controller('testCtrl',['$scope',function($scope){
		
    		$scope.uploadFile = function(){

    		    	$scope.columns=Object.keys($scope.testFile[0]);
    		     	$scope.hierarchies = [];
    		     	$scope.yaxis=null;
    		     	$scope.smethod=null;
    		     	// $scope.cData=null;
    		     	$scope.noBlank=false;
    		      $scope.chartSetting={};
              $scope.trellis = [];

    		}

        $scope.drawChart = function(){
				let col = $scope.hierarchies[$scope.hierarchies.length-1];
        	    let keys = $scope.testFile.map((d)=>d[col]).filter((d,i,self)=>self.indexOf(d)===i);
        	    $scope.chartSetting.colormap = colorMap(keys);        	           		
	            $scope.chartSetting.yaxis = $scope.yaxis;
                $scope.chartSetting.hierarchies = $scope.hierarchies;	            
	            $scope.chartSetting.smethod = $scope.smethod;
	            $scope.chartSetting.noBlank = $scope.noBlank;
				$scope.trellisData = flatenData(trellisData($scope.trellis,$scope.testFile)).filter((d)=>d.values.length>0);
				
        	} 

       
}]);