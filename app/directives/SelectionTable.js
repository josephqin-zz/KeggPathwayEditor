angular
	.module('MyApp')
	.directive('selectionTable',function(){
		return {
			restrict:'A',
			scope:{
				tableData:'=',
				selectedRow:'=',
				tableBody:'='
			},
			controller:['$scope',function($scope){
				
			}],
			link: function(scope, element, attrs,controllers){
				scope.$watch('tableData',function(newVal,oldVal){
					if(!newVal){return;}
					var columns = Object.keys(newVal[0]);
					columns.splice(columns.indexOf('CohorGroup'),1);
					columns.splice(columns.indexOf('RowID'),1);
					var tableDiv = d3.select(element[0]);
					tableDiv.selectAll('*').remove();
					var tableHead = tableDiv.append('thead').append('tr').selectAll('th')
									.data(columns)
									.enter()
									.append('th')
									.text((d)=>d);
				    scope.tableBody = tableDiv.append('tbody').selectAll('tr')
				    				.data(newVal)
				    				.enter()
				    				.append('tr')
				    				.attr('class','selectable')
				    				.on('click',function(d){
				    					
				    					
				    					if( d3.event.shiftKey && scope.selectedRow.length===1 ){
				    						let max = d3.max([d.RowID,scope.selectedRow[0]]);
				    						let min = d3.min([d.RowID,scope.selectedRow[0]]);
				    						scope.tableBody.filter((d)=>(d.RowID<=max && d.RowID>=min)).style('background-color',null).attr('class','selected');
				    						for(var i=min;i<=max;i++){
				    							scope.selectedRow.push(i);
				    						}
				    						scope.selectedRow.filter((d,i,self)=>self.indexOf(d)===i);
 
				    					}else{
				    					if(!d3.event.ctrlKey){
				    						scope.tableBody.attr('class','selectable');
				    						scope.selectedRow = []				    					
				    						};
				    					d3.select(this).style('background-color',null);
				    					d3.select(this).attr('class','selected');
				    					scope.selectedRow.push(d.RowID);	
				    					}


				    					
				    					
				    				});

				    scope.tableBody.each(function(d){
				    	d3.select(this).selectAll('td')
				    	  .data(columns)
				    	  .enter()
				    	  .append('td')
				    	  .text((t)=>d[t]);
				    	}); 				

			
				});
           

   			}
			
		}

	})