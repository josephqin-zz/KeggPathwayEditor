angular
 .module('MyApp')
 .directive("keggMap",function(){
				return{
					restrict:'E',
					scope:{
						mData:'=mapdata',
						nData:'=nodedata',
						pvData:'=pvaluedata',
						metabolist:'='
					},
					link: function(scope,element,attrs){
                        
						let vis = d3.select(element[0])
						.append('svg')
						.attr('width','1200')
						.attr('height','700')
                        .call(d3.behavior.zoom().on("zoom", zoomed))
						.append("g");

						// let svg = vis.append("g")
						let div = d3.select("body").append("div")
									.attr("class","tooltip")
									.style("opacity",0);

						// console.log(vis.node().getBoundingClientRect());

						function zoomed() {
							// var scale= d3.event.scale;
							// console.log(d3.event.translate );
							vis.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
						};
						var node = null;
						var edge = null;
						scope.$watch('mData',function(newval,oldval){
							let xrange = [];
							vis.selectAll('*').remove();
							if(!newval){return;}
							let json = newval;
							console.log(json);
							def = vis.append("defs")
									.append("marker")
									.attr("id","arrow")
									.attr("viewBox","0 0 8 8")
									.attr("markerWidth",8)
									.attr("markerHeight",8)
									.attr("markerUnits","userSpaceOnUse")
									.attr("orient","auto")
									.attr("refX",0)
									.attr("refY",4)
									.append("polyline")
									.attr("points","0,0 8,4 0,8")
									.attr("fill","none")
									.attr("stroke","black")
									.attr("stroke-width",1);


							
							var reactions = []
                            if( 'reaction' in json){
								json.reaction.forEach((r)=>{

									r.product.forEach((p)=>{
									reactions.push({'source':r.id,'target':p.id,'type':r.type})
									});
									r.substrate.forEach((s)=>{
									reactions.push({'source':s.id,'target':r.id,'type':r.type})
									});

								})
                            };

                            if('relation' in json){
								json.relation.forEach((r)=>{

									r.subtype.forEach((s)=>{
										if (s.name==='compound'){
	                                	reactions.push({'source':r.entry1,'target':s.value,'type':r.type});
										reactions.push({'source':s.value,'target':r.entry2,'type':r.type});
	                                	}else if(s.name==='activation'){
	                                		reactions.push({'source':r.entry1,'target':r.entry2,'type':r.type})
	                                	}
										
									})

								})
                            };

							

							console.log(reactions);

							edge = vis.append('g')
							.attr("class","relations")
							.selectAll('path')
							.data(reactions).enter()
							.append('path')
							.attr("marker-mid","url(#arrow)")
							.attr("d",function(d){
								
								let source = json.entry.filter((t)=>t.id===d.source)[0].graphics[0];
								let target = json.entry.filter((t)=>t.id===d.target)[0].graphics[0];
								

								return "M"+(+source.x)+","+(+source.y)+" L"+((+target.x)+(+source.x))/2+","+((+source.y)+(+target.y))/2+" L"+target.x+","+target.y;
								


							});


							node = vis.append('g')
							.attr("class","nodes")
							.selectAll('g')
							.data(json.entry).enter()
							.append('g')
							.attr("class","node")
							.attr('id',function(d){return d.id});


							 node.each(function(d){

								let svg_node = d3.select(this);
								d.graphics.forEach(function(g){
									if(g.type == 'line' ){
										let coords = g.coords.split(",")
										let Xcoords = coords.filter(function(c,i){return i%2 == 0 })
										let Ycoords = coords.filter(function(c,i){return i%2 != 0 })
										let d = "M"+Xcoords.map(function(d,i){return d+","+Ycoords[i] }).join(" L");
										svg_node.append('path').attr("class",g.type).attr('d',d).attr("stroke",g.fgcolor);
									}else if(g.type == 'circle'){

										xrange.push(+g.x);
										svg_node.append('circle')
										.attr('class','node')
										.attr("cx",g.x)
										.attr("cy",g.y)
										.attr("r",(+g.width)/2)
										.attr("fill",g.bgcolor)
										.attr("stroke",g.fgcolor)
										.attr('id',g.name)
										
										.on("mouseover",function(){
											div.transition()		
								                .duration(200)		
								                .style("opacity", .8);		
								            div	.html('<img src="'+"http://rest.kegg.jp/get/"+g.name+'/image" />')	
								                .style("left", (d3.event.pageX) + "px")		
								                .style("top", (d3.event.pageY) + "px");	
								            })
										.on("mouseout",function(){
											 div.transition()		
								                .duration(500)		
								                .style("opacity", 0);
											})
										// .on("click",function(){
										// 		scope.$apply(function(){
										// 		scope.$parent.metabolite = { kegg_id:g.name }; 
										// 	});


										// });

										

									}else {
										svg_node.append('rect').attr("x",g.x-g.width/2).attr("y",g.y-g.height/2).attr("width",g.width).attr("height",g.height).attr("fill",g.bgcolor).attr("stroke",g.fgcolor);
									}

									let textY = g.type==='circle'?+g.y+10:g.y

									svg_node.append('text')
											.attr("dy",".35em")
			            				  	.attr("font-size",9)
						    			  	.text(g.name)
						    			  	.attr("x", g.x)
								    	  	.attr("y", textY)
								    	  	.attr("text-anchor","middle");

								    })

							})



							
							
                           
                         






						// let xscale = getScale(xrange)

						// vis.attr("transform","translate(0,40)"+" scale("+1094/(xscale.max-xscale.min)+")");
					    });

						

						scope.$watch('nData',function(newval,oldval){
							if(newval)
							{   
							    d3.selectAll('.highlightTemp').remove();								
								let nodes = node.filter(function(d){ 
									return d.graphics[0].name === newval.kegg_id 
								});
								nodes.selectAll('.node').attr('r', 50)
								.transition().duration(2000)
								.attr('r',7);
								nodes.each(function(d){
									let svg = d3.select(this);
									d.graphics.forEach(function(g){
										svg.insert("circle",":first-child").attr("class","highlightTemp")
                               			// .attr("fill-opacity",0)
                               			.attr("r",45).attr("cx",g.x).attr("cy",g.y).attr("fill","none")
                               			.attr("stroke","red").attr("stroke-width",5);

									})


								});
							};
						});

						scope.$watch('metabolist',function(newval,oldval){
							if(newval)
							{   
								let kegglist = newval.map((d)=>d.kegg_id);
								svg.selectAll('.pValue').remove();
							    d3.selectAll('.highlight').remove();
							    d3.selectAll('.highlightTemp').remove();								
								let nodes = node.filter(function(d){ 
									return kegglist.indexOf(d.graphics[0].name) != -1 
								});
								// nodes.selectAll('.node').attr('r', 50)
								// .transition().duration(2000)
								// .attr('r',7);
								nodes.each(function(d){
									let svg = d3.select(this);
									d.graphics.forEach(function(g){
										svg.insert("circle",":first-child").attr("class","highlight")
                               			// .attr("fill-opacity",0)
                               			.attr("r",10).attr("cx",g.x).attr("cy",g.y).attr("fill","none")
                               			.attr("stroke","red").attr("stroke-width",5);

									})


								});
							};
						});

						

						scope.$watch('pvData',function(newVal,oldVal){
                            if(!newVal){return;}
                            // console.log(newVal);
                            let colorRanges = getScale(newVal.filter((d)=>(typeof(d.x) != "undefined")).map((d)=>+d.x));
                            let radiosRanges = getScale(newVal.filter((d)=>(typeof(d.y) != "undefined")).map((d)=>+d.y));
                            let colorScale = getScaleFn({'max':'red','min':'blue'},colorRanges)
                            let rScale = getScaleFn({max:40,min:20},radiosRanges);
                            svg.selectAll('.pValue').remove();
							node.each(function(d){
                               let svg = d3.select(this);
                               d.graphics.forEach(function(g){
                               	if( g.type == 'circle'){
                               		let pvalue = newVal.filter(function(n){return (n.kegg_id === g.name) && (typeof n.x != "undefined") && (typeof n.y != "undefined")});
                               		if(pvalue.length > 0 ){
                               			
                               			// svg.insert("circle",":first-child")
                               			svg.append("circle")
                               			.attr("class","pValue")
                               			// .attr("fill-opacity",0.8)
                               			.attr("fill",colorScale(pvalue[0].x)).attr("r",rScale(pvalue[0].y)).attr("cx",g.x).attr("cy",g.y);
                               		}


                               	}
                               })

							})

						});


					}

				}
			});