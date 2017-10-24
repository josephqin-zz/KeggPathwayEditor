angular
	.module('MyApp',[])
	.controller('testCtrl',['$scope','$http','$q','$location',function($scope,$http,$q,$location){
    var urlParams = $location.search()
    

		$scope.chatTypeList = ['line','bar','stackedBar1','stackedBar2','pie','stdLine','stdBar']
    $scope.showLog=true;
    $scope.progress=0;
    $scope.loadDone=false;

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

		var loadDataset = function(dataset_id){
        console.log(dataset_id)
        $http.get('http://10.4.1.60/mtb/getData.php?type=maven_dataset_data&dataset_id='+dataset_id)
          .then(function(response){
                console.log(response);
                $scope.loadDone = true;
                $scope.testFile = response.data.data.values;
                $scope.progress=0;
                $scope.columns=Object.keys($scope.testFile[0]);
                $scope.hierarchies = [];
                $scope.yaxis=null;
                $scope.smethod=null;
                $scope.cData=null;
                $scope.noBlank=false;

                
                $scope.chartSetting={}
                $scope.trellis = [];
         })


    }

    if(urlParams.hasOwnProperty('dataset_id')){
      $scope.datasetShow = false;
      loadDataset(urlParams.dataset_id);
    }else{
      $scope.datasetShow = true;
    }


		$scope.uploadFile = function(){
         loadDataset($scope.datasetName.dataset_id.toString());
    }

      $scope.$watch('chartSetting.type',function(newVal,oldVal){
        if(!newVal){return;};
        if(newVal.includes('std')){
          
          $scope.showLog=false;
          }

        
      });

      // $scope.$on('fileProgress',function(event,args){
      //   $scope.progress = args.loaded / args.total ;
      //   $scope.btnDisable = (args.loaded === args.total ) ? false:true ;
      // });

      $http({ method:"GET",
              url: 'http://10.4.1.60/mtb/getData.php?type=mvn_dataset_info'
            }).success(function(data){
                        console.log(data);
                        $scope.menuData = d3.nest().key((d)=>d.a_number)
                                                   .entries(data.data.values).map((d)=>{
                                                    d.show = false;
                                                    return d;
                                                   });

                        
            }).error(function(data,status,headers){
                        
            })
      
      $scope.expand = function(d) {
            d.show = !d.show;
      }

      
     
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