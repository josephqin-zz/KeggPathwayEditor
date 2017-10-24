angular
	.module('MyApp',[])
	.controller('testCtrl',['$scope',function($scope){
		$scope.chatTypeList = ['line','bar','stackedBar1','stackedBar2','pie','stdLine','stdBar']
    $scope.showLog=true;
    $scope.progress=0;
    $scope.uploadend=false;
    $scope.chartSetting={'type':null}
		var getChart = function(type) {
                     var chart = null;
                        switch(type){
                              case "line":
                                  chart = new lineChart();
                                  break;
                              case "bar":
                                  chart = new barChart();
                                  break;    
                              case "stackedBar1":
                                  chart = new stackedBarChart();
                                  break;
                              case "stackedBar2":
                                  chart = new pstackedBarChart();
                                  break;
                              case "pie":
                                  chart = new pieChart();
                                  break;
                              case "dount":
                                  chart = new donutChart();
                                  break;
                              case "stdLine":
                                  chart = new stdlineChart();
                                  break;
                              case "stdBar":
                                  chart = new stdbarChart();
                                  break;                         
                              default:
                                  chart = new lineChart()
                        }
                     return chart;    
           			}
		
		$scope.uploadFile = function(){
          $scope.progress=0;
		    	$scope.columns=Object.keys($scope.testFile[0]);
		     	$scope.hierarchies = [];
		     	$scope.yaxis=null;
		     	$scope.smethod=null;
		     	// $scope.cData=null;
		     	$scope.noBlank=false;

		     	
          $scope.chartSetting={}
          $scope.trellis = [];

		    }

      $scope.$watch('chartSetting.type',function(newVal,oldVal){
        if(!newVal){return;};
        if(newVal.includes('std')){
          
          $scope.showLog=false;
          }

        
      });

      $scope.$on('fileProgress',function(event,args){
        $scope.progress = args.loaded / args.total ;
        $scope.btnDisable = (args.loaded === args.total ) ? false:true ;
      })

     
      $scope.drawChart = function(){
				      let col = $scope.hierarchies[$scope.hierarchies.length-1]
        	    let keys=$scope.testFile.map((d)=>d[col]).filter((d,i,self)=>self.indexOf(d)===i);
        	    $scope.chartSetting.colormap = colorMap(keys);
        	              		
	            $scope.chartSetting.yaxis = $scope.yaxis;
	            $scope.chartSetting.chart = getChart($scope.chartSetting.type);
              
	            if($scope.chartSetting.chart.type.includes('line')){
	            	$scope.chartSetting.hierarchies = [$scope.hierarchies[$scope.hierarchies.length-1],$scope.hierarchies[0]];
	            }else{

	            	$scope.chartSetting.hierarchies = $scope.hierarchies;
	            };
	            $scope.chartSetting.smethod = $scope.smethod;
	            $scope.chartSetting.noBlank = $scope.noBlank;
				      $scope.trellisData = flatenData(trellisData($scope.trellis,$scope.testFile)).filter((d)=>d.values.length>0)
				      
        	}

       
}]);