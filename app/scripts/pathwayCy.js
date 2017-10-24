function creatPathWay(){
	pathWay = { 
		xWindowSize : 1000,
		yWindowSize : 600,
		experimentData : null,
		mapData: null,
		nodesData : null,
		mapMatchCols:["data","HMDB_Name"],
		mapMatchCol:"HMDB_Name",
		experimentMatchCols:["metabolite_name"],
		experimentMatchCol:"metabolite_name",
		dataLevels:[],
		dataScales:null	
	};

	pathWay.initial = function(dom){

		pathWay.cy =  cytoscape({
			container: dom,
			style: [
			{
				selector: 'node[KEGG_NODE_TYPE="compound"]',
				style: {
						      	'shape': 'ellipse', //'data(KEGG_NODE_SHAPE)',
						      	'width': 'data(KEGG_NODE_WIDTH)',
						      	'height':'data(KEGG_NODE_HEIGHT)',
						      	'background-color': '#FFFFFF',  //'data(KEGG_NODE_FILL_COLOR)',
						      	'border-width': '1',
						      	'border-style': 'solid',
						      	'border-color': 'black',
						      	'label': function(elm) { 
						      	    	    // if(elm.data.hasOwnProperty('Short_Name')){
						      	    	    // 	console.log(elm.data('Short_Name'));
						      	    	    // 	console.log('test');
						      	    	    // }
											return elm.data('KEGG_NODE_LABEL_LIST_FIRST');
										
									},
								'text-wrap': 'wrap',
								'text-max-width': '80px',
								'color': 'blue',
								'font-family': 'arial',
								'font-size': '6',
									//'font-weight': 'bold'
								'text-margin-x': function(elm) {
										if(elm.data.hasOwnProperty('Short_Name') && elm.data('Short_Name') == 'G1P') {
											return 17;
										} else { return 0;} },
								'text-margin-y': function(elm) { 
											if(elm.data.hasOwnProperty('Short_Name') && elm.data('Short_Name') == 'DHAP')  { 
												return 18;
											} else if(elm.data.hasOwnProperty('Short_Name') && elm.data('Short_Name') == 'G1P') {
												return 10;
											} else { return 0;} }
										}
									},
									{
										selector: 'node[KEGG_NODE_TYPE="gene"]',
										style: {
							      	'shape': 'rectangle', //'data(KEGG_NODE_SHAPE)',
							      	'width': 'data(KEGG_NODE_WIDTH)',
							      	'height':'data(KEGG_NODE_HEIGHT)',
							      	'background-color': 'data(KEGG_NODE_FILL_COLOR)',
							      	'label': 'data(KEGG_NODE_LABEL_LIST_FIRST)',
							      	'color': 'black',
							      	'font-family': 'arial',
							      	'font-size': '10',
						         	'text-valign': 'top',
						         	//'font-weight': 'bold',
									//'text-margin-x': 'data(KEGG_NODE_X)',
									//'text-margin-y': 'data(KEGG_NODE_HEIGHT)'
									'text-margin-y': function(ele) { return ele.data('KEGG_NODE_HEIGHT') -2 }
								}
							},
							{
								selector: 'node[KEGG_NODE_TYPE="map"]',
								style: {
						         'shape': 'roundrectangle', //'data(KEGG_NODE_SHAPE)',
						         'width': 'data(KEGG_NODE_WIDTH)',
						         'height':'data(KEGG_NODE_HEIGHT)',
						         'background-color': 'data(KEGG_NODE_FILL_COLOR)',
						         'label': 'data(KEGG_NODE_LABEL_LIST_FIRST)',
						         'text-wrap': 'wrap',
						         'text-max-width': '100px',
						         'color': 'black',
						         'font-family': 'arial',
						         'font-size': '10',
						         //'font-weight': 'bold',
						         'text-valign': 'top',
						         //'text-margin-x': 'data(KEGG_NODE_X)',
						         //'text-margin-y': 'data(KEGG_NODE_HEIGHT)'
						         'text-margin-y': function(ele) { return ele.data('KEGG_NODE_HEIGHT') -2 }
						     }

						 },
						 {
						 	selector: 'edge[id]',
						 	style: {
						 		'width': '1',
						 		'curve-style': 'bezier',
						 		'line-color': 'black',
						 		'line-style': 'solid',
									'target-arrow-shape': 'triangle-backcurve',  //'triangle',
									'target-arrow-fill': 'filled'
								}
							}
							], 
							layout: {
								name: 'preset'
							}
						});
		return pathWay;
	}

	pathWay.bind = function(dataSet){
		
		pathWay.mapData = dataSet;
        
        pathWay.mapData.elements.nodes.forEach(function(d){
           if(!d.hasOwnProperty('position')){
           	d.position = {x:+getVal(['data','KEGG_NODE_X']).call(null,d),y:+getVal(['data','KEGG_NODE_Y']).call(null,d)}
           }
        })
        	
    	pathWay.xRang = getScale(dataSet.elements.nodes.map(getVal(['position','x'])));
		pathWay.yRang = getScale(dataSet.elements.nodes.map(getVal(['position','y'])));
		let xmid = pathWay.xWindowSize/2 - (pathWay.xRang.min+(pathWay.xRang.max - pathWay.xRang.min)/2)
		let ymid = pathWay.yWindowSize/2 - (pathWay.yRang.min+(pathWay.yRang.max - pathWay.yRang.min)/2)
		// pathWay.xFn = getScaleFn({min:0,max:pathWay.xWindowSize},pathWay.xRang);
		// pathWay.yFn = getScaleFn({min:0,max:pathWay.yWindowSize},pathWay.yRang);
        // pathWay.mapData.elements.nodes.forEach(function(d){ d.position.x = pathWay.xFn(d.position.x)});
        // pathWay.mapData.elements.nodes.forEach(function(d){ d.position.y = pathWay.yFn(d.position.y)});
        pathWay.mapData.elements.nodes.forEach(function(d){ d.position.x = d.position.x + xmid});
        pathWay.mapData.elements.nodes.forEach(function(d){ d.position.y = d.position.y + ymid});
        // console.log(pathWay.mapData);
		return pathWay;
	}

	pathWay.draw = function(){
		if(!pathWay.mapData){return;}
		pathWay.cy.json(pathWay.mapData);

		return pathWay;
	}


	pathWay.nodeFontSize = function(fontScale){
		pathWay.cy.nodes().forEach(function( elm ){
			elm.style({'font-size' : fontScale*10 });
		});
		return pathWay;
	}

	pathWay.nodeLabel = function(tag){
		pathWay.cy.nodes().forEach(function( elm ){

						elm.style({'label' : elm.data(tag)});

		});
		return pathWay;
	}

	pathWay.bindExperData = function(experimentData){
		pathWay.experimentCols = Object.keys(experimentData[0]);
        pathWay.experimentData = experimentData;
		
			
		return pathWay;
    }

    pathWay.cleanChart = function(){
    	let groups = pathWay.cy.$('[id ^= "g"]');
    	if(groups.length > 0){
    		let nodes = groups.children("[ id !$= 'c1']");
    		nodes.move({'parent':null})
    		groups.remove();
    	}
    
    }
    pathWay.dataMatch = function(){
    	if(!pathWay.mapData || !pathWay.experimentData){return;}
    	console.log(pathWay.experimentMatchCol);
    	console.log(pathWay.mapMatchCol);
    	let mData = pathWay.mapData;
    	let eData = pathWay.experimentData;
    	let matchDict = mData.elements.nodes.reduce(function(acc,cur){acc[cur.data[pathWay.mapMatchCol]]=cur.data.id;return acc},{});
    	pathWay.nodesData = d3.nest()
    	  						.key(function(d){return matchDict[d[pathWay.experimentMatchCol]] })
    	  						.entries(eData)
    	  						.filter((d)=>d.key!=='undefined');

        // console.log(pathWay.nodesData);

    	// pathWay.matchData = {};
    	// mData
    	// 	.elements.nodes
					// 	.forEach(function(d){
					// 		// console.log(d);
					// 		var e = eData.filter(function(t){
					// 			return valMatch(t,pathWay.experimentMatchCols,d,pathWay.mapMatchCols);
					// 		});

					// 		if ( e.length > 0 ) {
					// 		pathWay.matchData[d.data.id]=e};
		  	// 				});

        return pathWay;
    }
    
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
                              case "stdline":
                                  chart = new stdlineChart();
                                  break;
                              case "stdbar":
                                  chart = new stdbarChart();
                                  break;                         
                              default:
                                  chart = new lineChart()
                        }
                     return chart;    
           			}

    pathWay.renderCharts = function(yName,xfields,statisticsMed,type,withoutBlank){
    	                pathWay.cleanChart();
    	                if(Object.keys(pathWay.nodesData).length === 0){return pathWay;}
    					// if(Object.keys(pathWay.matchData).length === 0){return pathWay;}
    					pathWay.dataLevels=[];
						pathWay.dataScales=null;	
    					let xkey = xfields[xfields.length-1];
    					let xValues = pathWay.nodesData.reduce((acc,cur)=>acc.concat(cur.values.map((d)=>d[xkey])),[])
    								  .filter((d,i,self)=>self.indexOf(d)===i);
    					if(withoutBlank){
    						xValues = xValues.filter((d)=>['','undefined'].indexOf(d)===-1);
    					}
    					pathWay.colormap = colorMap(xValues);


    	                if(type.includes('line')){
    	                	xfields = [xfields[xfields.length-1],xfields[0]];
    	                }

    	                pathWay.nodesData.forEach(function(n){
    	                	let nodeID = n.key;
    	                	let Node = pathWay.cy.$('#'+nodeID);
							let px = Node.position('x') + 10;
	    					let py = Node.position('y') - 10;
							//add chart group
	    					pathWay.cy.add({
												group: "nodes", 
												data: {id: "g"+nodeID }, 
												position: {x: px, y: py},
												style: 
														{
														  'background-opacity': 0,
														  'border-width': 1
														}
									});

							Node.move({'parent':"g"+nodeID});
							//add small chart
							if(type.includes('std')){
								chartData = groupDataV2(yName,xfields,n.values,withoutBlank);
							}else{
								chartData = groupData(yName,xfields,n.values,statistcFn(statisticsMed),withoutBlank);
							}
							
							// console.log("test");
							if(chartData.length===0){return;}	
							pathWay.cy.add({
									group:"nodes",
									data:{ id: nodeID+"c1" , parent:"g"+nodeID},
									position: { x: px, y: py },
									style: {
										'background-opacity': 0,
										'background-fit': 'contain',
								        'shape': 'rectangle',
								        'width': "100px",
								        'height':"50px",
								        'background-image': function(){
								        	console.log(type);
								        	let chart = getChart(type)
								        	chart.svgbox={width:200,height:100}
								        	let svg = d3.select("body").append("svg");
								        	chart.bindSVG(svg);
								        	chart.bindData(chartData);
								        	chart.setColorMap(pathWay.colormap);
                        					chart.render();
                        					if(pathWay.dataLevels.length===0){
                        						for(let i=0;i<chart.levelNum;i++){
                        							pathWay.dataLevels.push(chart.levels[i]);
                        						}
                        					}else{
                        						for(let i=0;i<chart.levelNum;i++){
                        							pathWay.dataLevels[i].concat(chart.levels[i]);
                        						}
                        					}
                        					if(!pathWay.dataScales){
                        						pathWay.dataScales = chart.scales;
                        					}else{
                        						pathWay.dataScales.max = pathWay.dataScales.max > chart.scales.max ? pathWay.dataScales.max : chart.scales.max;
                        						pathWay.dataScales.min = pathWay.dataScales.min < chart.scales.min ? pathWay.dataScales.min : chart.scales.min;
                        					}
											// let axis = {};
											// axis['xAxis']= xName;
											// axis['yAxis'] = yName;
											// let minichart = makeLineChart(chartData,axis);
											// minichart.bind(svg)
											// minichart.render();
											svg.remove();
																					
											return svg[0][0].toDataURL("image/svg+xml", {})
								        }
								    }
								});

    	                });	
    	                

						// pathWay.mapData.elements.nodes.forEach(function(n){

						// 	    let nodeID = n.data.id;
						// 	    let chartData = null;
						// 	    let Node = pathWay.cy.$('#'+nodeID);
						// 	    let px = Node.position('x') + 10;
	    	// 					let py = Node.position('y') - 10;

				    						    
						// 		if(nodeID in pathWay.matchData){

						// 		    if( pathWay.cy.$('#g'+nodeID).length == 0){
										
					 //    							pathWay.cy.add({
						// 								group: "nodes", 
						// 								data: {id: "g"+nodeID }, 
						// 								position: {x: px, y: py},
						// 								style: 
						// 								{
						// 								  'background-opacity': 0,
						// 								  'border-width': 1
						// 								}
						// 							 });

						// 							 Node.move({'parent':"g"+nodeID});

						// 		    }else{
						// 		    	if(pathWay.cy.$('#'+nodeID+"c1").length > 0){
						// 		    	 px = pathWay.cy.$('#'+nodeID+"c1").position('x');
		    // 						     py = pathWay.cy.$('#'+nodeID+"c1").position('y');
	     //                            	 pathWay.cy.$('#'+nodeID+"c1").remove(); 
	     //                            	}
						// 	    	};

						// 		    chartData = groupData(yName,xfields,pathWay.matchData[nodeID],statistcFn(statisticsMed),pathWay.withoutBlank);	
						// 		    pathWay.cy.add({
						// 			group:"nodes",
						// 			data:{ id: nodeID+"c1" , parent:"g"+nodeID},
						// 			position: { x: px, y: py },
						// 			style: {
						// 				'background-opacity': 0,
						// 				'background-fit': 'contain',
						// 		        'shape': 'rectangle',
						// 		        'width': "300",
						// 		        'height':"150",
						// 		        'background-image': function(){
						// 		        	// console.log(type);
						// 		        	let chart = new lineChart();
						// 		        	if(type === 'bar'){
						// 		        		chart = new barChart();
						// 		        	}
						// 		        	chart.svgbox={width:300,height:150}
						// 		        	let svg = d3.select("body").append("svg");
						// 		        	chart.bindSVG(svg);
						// 		        	chart.bindData(chartData);
      //                   					chart.render();
						// 					// let axis = {};
						// 					// axis['xAxis']= xName;
						// 					// axis['yAxis'] = yName;
						// 					// let minichart = makeLineChart(chartData,axis);
						// 					// minichart.bind(svg)
						// 					// minichart.render();
						// 					svg.remove();
																					
						// 					return svg[0][0].toDataURL("image/svg+xml", {})
						// 		        }
						// 		    }
						// 		});
						// 	}else{
						// 		if( pathWay.cy.$('#g'+nodeID).length != 0){
						// 			Node.move({'parent':null});
						// 		    pathWay.cy.$('#g'+nodeID).remove();
				    							
						// 	    }
						// 	};

								

																						
														
						// });

			

    return pathWay;
    }
    
    pathWay.addLegend = function(type){
    	if(!pathWay.dataScales){return;}
    	let chartData = toNestObject(pathWay.dataLevels,pathWay.dataScales);
    	pathWay.deleteLegend();
		pathWay.cy.add({
							group:"nodes",
							data:{ id: "legend"},
							position: { x: 200, y: 600 },
							style: {
										'background-opacity': 0,
										'background-fit': 'contain',
								        'shape': 'rectangle',
								        'width': "600",
								        'height':"300",
								        'background-image': function(){
								        	// console.log(type);
								        	let chart = new lineChart();
								        	if(type === 'bar'){
								        		chart = new barChart();
								        	}
								        	chart.svgbox={width:300,height:150};
								        	let svg = d3.select("body").append("svg");
								        	chart.bindSVG(svg);
								        	chart.bindData(chartData);
								        	chart.setColorMap(pathWay.colormap);
                        					chart.render();
                        					svg.remove();
																					
											return svg[0][0].toDataURL("image/svg+xml", {})
								        }
								    }
								});
        
		let colorData = Object.keys(pathWay.colormap).map(function(d){
			let obj={}
			obj.name=d;
			obj.color=pathWay.colormap[d];
			return obj;
		})
        pathWay.cy.add({
							group:"nodes",
							data:{ id: "legendColor"},
							position: { x: 200, y: 600 },
							style: {
										'background-opacity': 0,
										'background-fit': 'contain',
								        'shape': 'rectangle',
								        'width': "600",
								        'height':"300",
								        'background-image': function(){
								        	let svg = d3.select("body").append("svg")
								        				.attr("width",500)
								        				.attr("height",250);
								        	let y = d3.scale.ordinal().rangeRoundBands([0,200],0.2,0).domain(colorData.map((d)=>d.name));			
								        	let g = svg.selectAll("g")
								        	   .data(colorData)
								        	   .enter()
								        	   .append("g");
								        	let rect = g.append("rect")
								        	   .attr("fill",(d)=>d.color)
								        	   .attr("x",10)
								        	   .attr("width",y.rangeBand()*2)
								        	   .attr("height",y.rangeBand())
								        	   .attr("y",(d)=>y(d.name));
								        	let text = g.append('text')
								        	   .attr("x",y.rangeBand()*2+10)
								        	   .attr("y",(d)=>y(d.name)+y.rangeBand())
								        	   .attr("font-size",y.rangeBand())
										       .attr("font-family","Verdana")
										       .style("text-anchor", "start")
								        	   .text((d)=>['','undefined'].indexOf(d.name)===-1?d.name:"undefined");
								        	
                        					svg.remove();
																					
											return svg[0][0].toDataURL("image/svg+xml", {})
								        }
								    }
								});


    }

    pathWay.deleteLegend = function(){
    	// console.log('delete legend')
    	pathWay.cy.$('#legend').remove();
    	pathWay.cy.$('#legendColor').remove();


    }

    pathWay.legendScale = function(scale){
    	pathWay.cy.$('#legend').forEach(function(elm){
    		elm.style({
    			'width' : 400*(+scale)+'px',
    			'height' : 200*(+scale)+'px' })
    	});
    }
    pathWay.legendColorScale = function(scale){
    	pathWay.cy.$('#legendColor').forEach(function(elm){
    		elm.style({
    			'width' : 400*(+scale)+'px',
    			'height' : 200*(+scale)+'px' })
    	});
    }


    pathWay.chartScale = function(scale){
    	pathWay.cy.filter('node[id $= "c1"]').forEach(function(elm){
    		elm.style({
    			'width' : 200*(+scale)+'px',
    			'height' : 100*(+scale)+'px'  })
    	});

    }

    pathWay.exportFile = function(type){
    	if(type==='jpg'){
    		return pathWay.cy.jpg({full:true});
    	}else if(type==='png'){
    		return pathWay.cy.png({full:true});
    	}else{
    		return null;
    	}
    }

    
	return pathWay;
}


