angular
 .module('MyApp')
	.directive("vlcChart",function(){
            	return{
            		restrict:'E',
            		scope:{
            			vData:'=chartdata'
            		},
            		link:function(scope,element,attrs){

						var margin = {top: 20, right: 20, bottom: 30, left: 40},
						    width = 800 - margin.left - margin.right,
						    height = 500 - margin.top - margin.bottom;
						var x = d3.scale.linear()
    							  .range([0, width]);
						var y = d3.scale.linear()
						    	  .range([height, 0]);	    
            			var vis = d3.select(element[0])
									.append('svg')
									.attr("width", width + margin.left + margin.right)
			    					.attr("height", height + margin.top + margin.bottom)
			  						.append("g")
			    					.attr("transform", "translate(" + margin.left + "," + margin.top + ")");
			    		var color = d3.scale.category20();
			    		var xAxis = d3.svg.axis()
									    .scale(x)
									    .orient("bottom");

						var yAxis = d3.svg.axis()
									    .scale(y)
									    .orient("left");			

            			scope.$watch('vData',function(newVal,oldVal){
            				  vis.selectAll('*').remove();
            				  if(!newVal){return;}

            				  var tooltip = d3.select("body")
            				                .append("div")	
										    .attr("class", "tooltip")				
										    .style("opacity", 0);
										            				  
            				  let Xmin = d3.min(newVal.map(function(d){return d.x}))
            				  let Xmax = d3.max(newVal.map(function(d){return d.x}))
            				  let Ymin = d3.min(newVal.map(function(d){return d.y}))
            				  let Ymax = d3.max(newVal.map(function(d){return d.y}))
							  x.domain([Xmin,Xmax]).nice();
                              y.domain([Ymin,Ymax]).nice();

            				  vis.append("line")
										  	 .attr("x1",x(0))
										  	 .attr("y1",450)
										  	 .attr("x2",x(0))
										  	 .attr("y2",0)
										  	 .style('stroke','#000')
										  	 .style('stroke-width',2);

							  vis.append("line")
										  	 .attr("x1",0)
										  	 .attr("y1",y(2))
										  	 .attr("x2",800)
										  	 .attr("y2",y(2))
										  	 .style('stroke','#000')
										  	 .style('stroke-width',2); 	
            				  
                              
                              console.log(newVal);
                              vis.append("g")
							      .attr("class", "x axis")
							      .attr("transform", "translate(0," + height + ")")
							      .call(xAxis)
							      .append("text")
							      .attr("class", "label")
							      .attr("x", width)
							      .attr("y", -6)
							      .style("text-anchor", "end")
							      .text("");

							  vis.append("g")
							      .attr("class", "y axis")
							      .call(yAxis)
							     .append("text")
							      .attr("class", "label")
							      .attr("transform", "rotate(-90)")
							      .attr("y", 6)
							      .attr("dy", ".71em")
							      .style("text-anchor", "end")
							      .text("")

							     

							  vis.selectAll(".dot")
							      .data(newVal)
							      .enter().append("circle")
							      .attr("class", "dot")
							      .attr("r", 3.5)
							      .attr("cx", function(d) { 
							       	return x(d.x); 
							      })
							      .attr("cy", function(d) { return y(d.y); })
							      .style("fill", function(d,i) { return color(i); })
			                      .on("mouseover", function(d) {		
							            tooltip.transition()		
							                .duration(200)		
							                .style("opacity", .9);		
							           tooltip.html("<p>"+d.name+"</p>")	
							                .style("left", (d3.event.pageX) + "px")		
							                .style("top", (d3.event.pageY - 28) + "px");	
							            })					
							        .on("mouseout", function(d) {		
							            tooltip.transition()		
							                .duration(500)		
							                .style("opacity", 0);	
							        });

							         	  	  
							     

					            			})

					            		}
					            	}

					            });

