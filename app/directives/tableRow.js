angular
	.module('MyApp')
	.directive('tableRow',function(){
		return {
			restrict:'A',
			scope:{
				rowData:'=',
				tableColumns:'=',
				groupList:'='
			},
			controller:['$scope',function($scope){
				$scope.style={'background-color':null}
	
			}],
			link: function(scope, element, attrs,controllers){
				
				element.on('click',function(){
					scope.rowData.selected = true;
					scope.$apply();
				})
				
				scope.$watch('rowData.selected',function(newVal,oldVal){
					if(!newVal){
						element.css('background-color',null);
						return;};
					element.css('background-color','#FFC');
				})
				scope.$watch('rowData',function(newVal,oldVal){
					if(!newVal){return;}
					var rowTR = d3.select(element[0]);
				    rowTR.selectAll('td')
				    	 .data(scope.tableColumns)
				    	 .enter()
				    	 .append('td')
				    	 .attr('name',(t)=>t)
				    	 .text((t)=>newVal[t]);
				});
           

   			}
			
		}

	})