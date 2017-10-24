angular
	.module('MyApp')
	.directive('cohorChart',function(){
		return {
			restrict:'E',
			scope:{
				groupDetail:'=',
			},
			controller:['$scope','$http','$q',function($scope,$http,$q){
				$scope.cohorGroups = null;
				$scope.httpdone = true;
				$scope.drawPlot = function(){
					
					$scope.vlcData = $scope.cohorGroups.map((g)=>{
                       let volc_item = {};
                       
                       let vals1 = g.values.filter((l)=>l.key===$scope.cohorgroup1)
                       let vals2 = g.values.filter((l)=>l.key===$scope.cohorgroup2)
                       if( vals1.length>0 && vals2.length>0 ) {
                       		let cohor1 = vals1[0].values.map((v)=>+v.areatop).filter((t)=>typeof t !=='undefined' && !isNaN(t) )
                       		let cohor2 = vals2[0].values.map((v)=>+v.areatop).filter((t)=>typeof t !=='undefined' && !isNaN(t) )
                       		if( cohor1.length>0 && cohor2.length>0){
                       			volc_item.name = g.key
                       		
                       			let mean1 = d3.mean(cohor1);
                       			let mean2 = d3.mean(cohor2);
	                       		if(mean2 != 0 && Math.abs(mean2)>0) {
								    volc_item.x = Math.log2(mean1/mean2);
							              
	

							    	let tval = ss.tTestTwoSample(cohor1, cohor2, 0);
							    	let logPvalue = convertTvalue2Pvalue(cohor1.length-1, tval);


							    	volc_item.y = logPvalue;
							               	
							        } else {
							            	   volc_item.x = 0;
							            	   volc_item.y = 0;
							        }

                       	
                              }
                       		}
                       		

                       return volc_item
					}).filter((v)=> Object.keys(v).length>0 && typeof v.y !== 'undefined')
					// console.log(d3.min($scope.vlcData.map((d)=>d.x)));
				}
				$scope.$watch('groupDetail',function(newVal,oldVal){
					$scope.vlcData = null;
					$scope.cohorgroup1 = null;
					$scope.cohorgroup2 = null;
					if(!newVal){return;}
					$scope.httpdone = true;
					$scope.cohorGroups=null;
					$q.all(newVal.map((g)=>$http.get(g.gurl).then(function(response){ return response.data.data.values.map((r)=>{r.cohorgroup=g.name; return r}) })))
					  .then(function(data){
					   $scope.httpdone = false;	
                       $scope.cohorGroups = d3.nest()
                       					   .key((t)=>t.peakgroup_id)
                       					   .key((t)=>t.cohorgroup)
                       					   
                       					   .entries(data.reduce((a,b)=>a.concat(b),[]));
                    
                       console.log($scope.cohorGroups);   			
					})
				});
				
			         			
			}],
			templateUrl:'app/templates/cohorChart.htm'
		}

	})