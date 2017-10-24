angular
   .module('MyApp')
   .directive('chartCanvas',function(){
   		return{
   			restrict:'E',
   			scope:{
   				chartData:'=',
               chartSetting:'='
               
   			},
   			link:function(scope,element,attrs){
   				width = element[0].parentElement.clientWidth
   				height = width/2
   				var svg = d3.select(element[0]).append('svg').attr('width',width).attr('height',height);
   				var chart = scope.chartSetting.chart;
       //         if( scope.chartSetting.type === 'line'){
       //            chart = new lineChart();
       //            }else if( scope.chartSetting.type === 'bar' ){
       //               chart = new barChart();
       //            }else if( scope.chartSetting.type === 'stackedBar1'){
       //               chart = new stackedBarChart();
       //            }else if( scope.chartSetting.type === 'stackedBar2' ){
       //               chart = new pstackedBarChart();
       //            }else if( scope.chartSetting.type === 'pie' ){
       //               chart = new pieChart();
       //            }else if( scope.chartSetting.type === 'dount' ){
       //               chart = new donutChart();
       //            }else if( scope.chartSetting.type === 'dount' )

   				// // chart.svgbox = {"width":width,"height":height}
               
   				scope.$watch('chartData',function(newVal,oldval){
   					chart.bindSVG(svg);
   					if(!newVal){
   						chart.warningInfo("no data available");
   						return;}
                    
                  
                  let cData=null;
   					      if(chart.type.includes("std")){
                     
                     if(scope.chartSetting.logON){
                      console.log('test')
                        cData = groupDataLog(scope.chartSetting.yaxis,scope.chartSetting.hierarchies,newVal,scope.chartSetting.noBlank)
                     }else{
                        cData = groupDataV2(scope.chartSetting.yaxis,scope.chartSetting.hierarchies,newVal,scope.chartSetting.noBlank)
                     }
                     
                  }else{
                     cData = groupData(scope.chartSetting.yaxis,scope.chartSetting.hierarchies,newVal,statistcFn(scope.chartSetting.smethod),scope.chartSetting.noBlank)
                  }
                  
                  chart.bindData(cData);
                  chart.setColorMap(scope.chartSetting.colormap);
   					chart.render();	

   				})
   			}
   		}
   })