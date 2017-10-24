class miniChart {

	constructor(){
		this.setting = {
			margin : {top: 20, right: 20, bottom: 30, left: 40},
			width: 1000,
			height: 500
			};
		this.svgbox = null;	
	}

	bindData(cData){
		this.data = cData;
		this.resetData();
	}

	resetData(){
		  this.levels = flatenNest(this.data,[]);
		  this.levelNum = this.levels.length-1;
    	this.scales = getScale(this.levels[this.levelNum]);
    	this.resetSepecialData();
		
	}

  setColorMap(colormap){
    this.color = colormap;
  }

	resetSepecialData(){
		this.color = null;
		this.setting.svgHeight = this.setting.height;
	}

	bindSVG(svg){

		this.vis = svg;
		if(!this.svgbox){
			this.svgbox = svg.node().getBoundingClientRect();
		}
	}

	resetSVG(){
        let that = this;
        this.vis.selectAll('*').remove();
        this.svg = this.vis.append("g")
                    .attr("transform","scale("+that.svgbox.width/(that.setting.width+that.setting.margin.left+that.setting.margin.right)+","+that.svgbox.height/(that.setting.svgHeight+that.setting.margin.top)+")")
                    .append("g")
                    .attr("transform","translate(" + this.setting.margin.left + "," + this.setting.margin.top + ") ")

  	}

  warningInfo(text){
		let that = this;
    this.vis.selectAll('*').remove();
		this.vis.append("text")
		        .attr("x",+(that.svgbox.width)/2)
		        .attr("y",(+(that.svgbox.height)/2))
		        .attr("font-size",35)
		        .attr("font-family","Verdana")
		        .text(text)
            .style("text-anchor", "middle");
	}

	setYaxis(){
    	  let that = this;
        let minY = 0;
        if(that.type.includes("std")){
          minY = that.scales.min;
        }
        this.y = d3.scale.linear().range([that.setting.height,0]).domain([minY,that.scales.max]).nice()
       	this.yAxis = d3.svg.axis()
				      .scale(that.y)
				      .orient("left");

      if(that.scales.max > 1000 ){
        this.yAxis.tickFormat(d3.format(".2s"));
      }
				      
	  			      
  }

  setXaxis(xDomain){
    	let that = this;
    	this.x = d3.scale.ordinal().domain(xDomain).rangeBands([0, that.setting.width], .2);
        this.xAxis = d3.svg.axis()
        			 .scale(that.x)
        			 .orient("bottom");
  }


  render(){
    	return;
  }

}


class barChart extends miniChart {
  constructor(){
    super();
    this.type="barChart"  
  }

  resetSepecialData(){
    this.setting.groupLable=6;
    this.color = colorMap(this.levels[this.levelNum-1]);
    this.setting.svgHeight = this.setting.height + this.setting.groupLable*(this.levelNum*3+2);
  }

  render(){
    this.resetSVG();
    
    let that = this;
    this.groups = [];
    // console.log(svgbox);
    this.setYaxis();
    this.setXaxis(d3.range(that.levels[that.levelNum].length));
    
       
        // .attr("transform", );

        let addGroup = function(g,tag){
            return g.selectAll(tag)
                      .data((d)=>d.values)
                      .enter().append(tag)
                      .attr("name",(d)=>d.key)
      };

      let groupLine = (x,y,width) => 'M'+x+' '+(y-5)+' v 5'+' h '+width+' v -5';
      

      this.groups.push(that.svg.append("g").selectAll("g").data(this.data).enter().append("g").attr("name",(d)=>d.key));
      for (var i=0;i<this.levelNum-1;i++){
          that.groups.push(addGroup(that.groups[i],"g"));
      }
      this.groups.reverse();
      
      let barNum = -1;
      this.groups[0]
        .append("rect")
        .attr("width", that.x.rangeBand())
        .attr("height", (d)=>that.setting.height-that.y(d.values))
        .attr("fill",(d)=>that.color[d.key])
        .attr("x", function(d, i) { barNum += 1;
              return that.x(barNum); })
        .attr("y", function(d) { return that.y(d.values); });

      this.svg.append("g")
            .attr("class", "y axis")
            .call(that.yAxis)
            .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", ".71em")
            .style("text-anchor", "end"); 

        for(var i=0;i<this.levelNum-1;i++){
          
          that.groups[i+1].each(function(d){
            
            let bbox = d3.select(this).node().getBBox();
            
           d3.select(this).append("path")
              .attr('d',function(d){
                  return groupLine(bbox.x,that.setting.height+that.setting.groupLable*(3*i+2),bbox.width);
              })
              .attr('fill',"none")
              .attr("stroke","#000");
           
          });
        }

        for(var i=0;i<this.levelNum-1;i++){
          
          that.groups[i+1].each(function(d){
            let bbox = d3.select(this).node().getBBox();
           
           d3.select(this)  
              .append('text')
              .text(d.key)
              .attr("x",bbox.x+bbox.width/2)
              .attr("y",that.setting.height+that.setting.groupLable*(3*i+4))
              .attr("dy",".25em")
              .attr("text-anchor",'middle');
          });
        }

        

      }

}


class stdbarChart extends miniChart {
  constructor(){
    super();
    this.type="stdbarChart"  
  }

  resetData(){
      this.levels = flatenNestV2(this.data,[]);
      // console.log(this.levels);
      this.levelNum = this.levels.length-1;
      this.scales = getScale(this.levels[this.levelNum]);
      this.resetSepecialData();
    
  }

  resetSepecialData(){
    this.setting.groupLable=6;
    // this.color = colorMap(this.levels[this.levelNum-1].filter((d,i,self)=>self.indexOf(d)===i));
    this.setting.svgHeight = this.setting.height + this.setting.groupLable*(this.levelNum*3+2);
  }

  render(){
    this.resetSVG();
    
    let that = this;
    this.groups = [];
    // console.log(svgbox);
    this.setYaxis();
    this.setXaxis(d3.range(that.levels[that.levelNum-1].length));
    
       
        // .attr("transform", );

        let addGroup = function(g,tag){
            return g.selectAll(tag)
                      .data((d)=>d.values)
                      .enter().append(tag)
                      .attr("name",(d)=>d.key)
      };

      let groupLine = (x,y,width) => 'M'+x+' '+(y-5)+' v 5'+' h '+width+' v -5';
      

      this.groups.push(that.svg.append("g").selectAll("g").data(this.data).enter().append("g").attr("name",(d)=>d.key));
      for (var i=0;i<this.levelNum-1;i++){
          that.groups.push(addGroup(that.groups[i],"g"));
      }
      this.groups.reverse();
      
      let barNum = -1;
      // this.groups[0]
      //  .append("rect")
     //   .attr("width", that.x.rangeBand())
     //   .attr("height", (d)=>that.setting.height-that.y(d3.mean(d.values)))
     //   .attr("fill",(d)=>that.color[d.key])
     //   .attr("x", function(d, i) { barNum += 1;
     //         return that.x(barNum); })
     //   .attr("y", function(d) { return that.y(d.values); });

     this.groups[0].each(function(d){
        barNum += 1;
        let groupSVG = d3.select(this);
        let meanVal = d3.mean(d.values);
        let maxVal = d3.max(d.values);
        let minVal = d3.min(d.values);
        let barWidth = that.x.rangeBand()
        groupSVG.append("rect")
                .attr("width", that.x.rangeBand())
                .attr("height", that.setting.height-that.y(meanVal))
                .attr("fill",that.color[d.key])
                .attr("x", that.x(barNum))
                .attr("y", that.y(meanVal))
                ;
        
        groupSVG.append("line")
                .attr("x1",that.x(barNum)+barWidth/6)
                .attr("y1",that.y(maxVal))
                .attr("x2",that.x(barNum)+barWidth*5/6)
                .attr("y2",that.y(maxVal))
                .attr("stroke","black")
                .attr("stroke-width",2);

        groupSVG.append("line")
                .attr("x1",that.x(barNum)+barWidth/6)
                .attr("y1",that.y(minVal))
                .attr("x2",that.x(barNum)+barWidth*5/6)
                .attr("y2",that.y(minVal))
                .attr("stroke","black")
                .attr("stroke-width",2);

        groupSVG.append("line")
                .attr("x1",that.x(barNum)+barWidth/2)
                .attr("y1",that.y(maxVal))
                .attr("x2",that.x(barNum)+barWidth/2)
                .attr("y2",that.y(minVal))
                .attr("stroke","black")
                .attr("stroke-width",2);           



     })


      this.svg.append("g")
            .attr("class", "y axis")
            .call(that.yAxis)
            .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", ".71em")
            .style("text-anchor", "end"); 

        for(var i=0;i<this.levelNum-1;i++){
          
          that.groups[i+1].each(function(d){
            
            let bbox = d3.select(this).node().getBBox();
            
           d3.select(this).append("path")
              .attr('d',function(d){
                  return groupLine(bbox.x,that.setting.height+that.setting.groupLable*(3*i+2),bbox.width);
              })
              .attr('fill',"none")
              .attr("stroke","#000");
           
          });
        }

        for(var i=0;i<this.levelNum-1;i++){
          
          that.groups[i+1].each(function(d){
            let bbox = d3.select(this).node().getBBox();
           
           d3.select(this)  
              .append('text')
              .text(d.key)
              .attr("x",bbox.x+bbox.width/2)
              .attr("y",that.setting.height+that.setting.groupLable*(3*i+4))
              .attr("dy",".25em")
              .attr("text-anchor",'middle');
          });
        }

        

      }

}



class lineChart extends miniChart {
  constructor(){
    super();
    this.type="lineChart"
  }

  

  resetSepecialData(){
    let that = this;
    
    // this.data.forEach(function(d){
    //     d.values.sort(function(a,b){return that.levels[that.levelNum-1].indexOf(a.x)-that.levels[that.levelNum-1].indexOf(b.x)});
    // })
	
    this.color = colorMap(this.levels[0]);
    this.setting.svgHeight = this.setting.height+20;
  }
  
  

  setXaxis(xDomain){
        let that = this;
        this.x = d3.scale
                .ordinal()
                .domain(xDomain)
                .rangePoints([0, that.setting.width]);
        this.xAxis = d3.svg.axis()
                 .scale(that.x)
                 .orient("bottom");
    }

    

    render(){
      
      this.resetSVG();
      let that = this;
      
      this.setYaxis();
      this.setXaxis(that.levels[that.levelNum-1]);

      var lineFunction = d3.svg.line()
                               .interpolate("cardinal")
                               .x(function (d) {return that.x(d.key);})
                               .y(function (d) {return that.y(d.values);});

      this.svg.selectAll("path")
              .data(that.data)
              .enter().append("path")
              .attr("class","line")
              .attr("fill","none")
              .attr("stroke-width","5")
              .attr("d",function(d){return lineFunction(d.values)})
              .style("stroke",function(d){return that.color[d.key]})
              .attr("data-series",function(d){return d.field}); 

      this.svg.append("g")
            .attr("class", "y axis")
            .call(that.yAxis)
            .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", ".71em")
            .style("text-anchor", "end"); 

      this.svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + that.setting.height + ")")
            .call(that.xAxis)
            .append("text")
            
            .attr("y", 6)
            .attr("dy", ".71em")
            .style("text-anchor", "middle");                                      

    }


}

class stdlineChart extends miniChart {
  constructor(){
    super();
    this.type="stdlineChart"
  }

  resetData(){
      this.levels = flatenNestV2(this.data,[]);
      
      this.levelNum = this.levels.length-1;
      this.scales = getScale(this.levels[this.levelNum]);
      this.resetSepecialData();
    
  }
  

  resetSepecialData(){
    let that = this;
    
    // this.data.forEach(function(d){
    //     d.values.sort(function(a,b){return that.levels[that.levelNum-1].indexOf(a.x)-that.levels[that.levelNum-1].indexOf(b.x)});
    // })
  
    this.color = colorMap(this.levels[0]);
    this.setting.svgHeight = this.setting.height+20;
  }
  
  

  setXaxis(xDomain){

        let that = this;
        this.x = d3.scale
                .ordinal()
                .domain(xDomain)
                .rangePoints([0, that.setting.width]);
        this.xAxis = d3.svg.axis()
                 .scale(that.x)
                 .orient("bottom");
    }

    

    render(){
      
      this.resetSVG();
      let that = this;
      
      this.setYaxis();
      this.setXaxis(that.levels[that.levelNum-1].filter((d,i,self)=>self.indexOf(d)===i));

      var lineFunction = d3.svg.line()
                               .interpolate("basis")
                               .x(function (d) {return that.x(d.key);})
                               .y(function (d) {return that.y(d3.mean(d.values));});

      var lineGroup = this.svg.selectAll("g")
                      .data(that.data)
                      .enter().append("g")
                      .attr("data-series",function(d){return d.key})
                      
      
      lineGroup.append("path")
               .attr("class","line")
               .attr("fill","none")
               .attr("stroke-width","5")
               .attr("d",function(d){return lineFunction(d.values)})
               .style("stroke",function(d){return that.color[d.key]});

      lineGroup.each(function(d){
        let color = that.color[d.key]

        let groupSVG = d3.select(this).selectAll('g')
                       .data(d.values)
                       .enter().append('g')
                       .attr('name',(t)=>t.key)

        groupSVG.append('circle')
                .attr("r",10)
                .attr("fill",color)
                .attr("cx",(d)=>that.x(d.key))
                .attr("cy",(d)=>that.y(d3.mean(d.values)));

        groupSVG.append("line")
                .attr("x1",(d)=>that.x(d.key)-5)
                .attr("y1",(d)=>that.y(d3.max(d.values)))
                .attr("x2",(d)=>that.x(d.key)+5)
                .attr("y2",(d)=>that.y(d3.max(d.values)))
                .attr("stroke","black")
                .attr("stroke-width",2);

        groupSVG.append("line")
                .attr("x1",(d)=>that.x(d.key)-5)
                .attr("y1",(d)=>that.y(d3.min(d.values)))
                .attr("x2",(d)=>that.x(d.key)+5)
                .attr("y2",(d)=>that.y(d3.min(d.values)))
                .attr("stroke","black")
                .attr("stroke-width",2);

        groupSVG.append("line")
                .attr("x1",(d)=>that.x(d.key))
                .attr("y1",(d)=>that.y(d3.max(d.values)))
                .attr("x2",(d)=>that.x(d.key))
                .attr("y2",(d)=>that.y(d3.min(d.values)))
                .attr("stroke","black")
                .attr("stroke-width",2);                         
        

      })
               

      this.svg.append("g")
            .attr("class", "y axis")
            .call(that.yAxis)
            .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", ".71em")
            .style("text-anchor", "end"); 

      this.svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + that.setting.height + ")")
            .call(that.xAxis)
            .append("text")
            
            .attr("y", 6)
            .attr("dy", ".71em")
            .style("text-anchor", "middle");                                      

    }


}



class stackedBarChart extends miniChart {
  constructor(){
    super();
    this.type="stackedbarChart"  
  }

  resetSepecialData(){
    this.setting.groupLable=6;
    this.color = colorMap(this.levels[this.levelNum-1]);
    this.setting.svgHeight = this.setting.height + this.setting.groupLable*(this.levelNum*3+2);
    // splite groups
    var rawData = this.data.map((d)=>d);
    while( typeof rawData[0]['values'][0]['values'] != 'number'){

        rawData = rawData.reduce((acc,cur)=>{
         return acc.concat(cur.values)
        },[])

    }
    this.groupData = rawData.map((d)=>d3.sum(d.values.map((t)=>t.values)));
    this.scales = getScale(this.groupData);
  }

  render(){
    this.resetSVG();
    
    let that = this;
    this.groups = [];
    // console.log(svgbox);
    this.setYaxis();
    this.setXaxis(d3.range(that.groupData.length));
    
       
        // .attr("transform", );

        let addGroup = function(g,tag){
            return g.selectAll(tag)
                    .data((d)=>d.values)
                    .enter().append(tag)
                    .attr("name",(d)=>d.key)
      };

      let groupLine = (x,y,width) => 'M'+x+' '+(y-5)+' v 5'+' h '+width+' v -5';
      

      this.groups.push(that.svg.append("g").selectAll("g").data(this.data).enter().append("g").attr("name",(d)=>d.key));
      for (var i=0;i<this.levelNum-2;i++){
          that.groups.push(addGroup(that.groups[i],"g"));
      }
      this.groups.reverse();
      
      let barNum = -1;
      this.groups[0].each(function(d){
        barNum += 1
        let groupSVG = d3.select(this);
        let stackedV = [];
        d.values.reduce((acc,cur)=>{
          var obj={};
          obj.key = cur.key;
          obj.y = cur.values;
          obj.y0 = acc;
          stackedV.push(obj);
          acc = acc + cur.values
          return acc;
        },0);
       
        groupSVG.selectAll("rect")
                .data(stackedV)
                .enter()
                .append("rect")
                .attr("width", that.x.rangeBand())
                .attr("height", (d)=>that.setting.height-that.y(d.y))
                .attr("fill",(d)=>that.color[d.key])
                .attr("x", function(d, i) { return that.x(barNum); })
                .attr("y", function(d) { return that.y(d.y+d.y0); });

      });
          
      this.svg.append("g")
            .attr("class", "y axis")
            .call(that.yAxis)
            .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", ".71em")
            .style("text-anchor", "end"); 

        for(var i=0;i<this.levelNum-1;i++){
          
          that.groups[i].each(function(d){
            
            let bbox = d3.select(this).node().getBBox();
            
           d3.select(this).append("path")
              .attr('d',function(d){
                  return groupLine(bbox.x,that.setting.height+that.setting.groupLable*(3*i+2),bbox.width);
              })
              .attr('fill',"none")
              .attr("stroke","#000");
           
          });
        }

        for(var i=0;i<this.levelNum-1;i++){
          
          that.groups[i].each(function(d){
            let bbox = d3.select(this).node().getBBox();
           
           d3.select(this)  
              .append('text')
              .text(d.key)
              .attr("x",bbox.x+bbox.width/2)
              .attr("y",that.setting.height+that.setting.groupLable*(3*i+4))
              .attr("dy",".25em")
              .attr("text-anchor",'middle');
          });
        }

        

      }

}

class pstackedBarChart extends miniChart {
  constructor(){
    super();
    this.type="persentagestackedbarChart"  
  }

  setYaxis(){
      let that = this;
        this.y = d3.scale.linear().range([that.setting.height,0]).domain([0,100]).nice()
        this.yAxis = d3.svg.axis()
              .scale(that.y)
              .orient("left")
              .tickFormat(d3.format(".2s"));
                
  }

  resetSepecialData(){
    this.setting.groupLable=6;
    this.color = colorMap(this.levels[this.levelNum-1]);
    this.setting.svgHeight = this.setting.height + this.setting.groupLable*(this.levelNum*3+2);
    // splite groups
    var rawData = this.data.map((d)=>d);
    while( typeof rawData[0]['values'][0]['values'] != 'number'){

        rawData = rawData.reduce((acc,cur)=>{
         return acc.concat(cur.values)
        },[])

    }
    this.groupData = rawData.map((d)=>d3.sum(d.values.map((t)=>t.values)));
    
  }

  render(){
    this.resetSVG();
    
    let that = this;
    this.groups = [];
    // console.log(svgbox);
    this.setYaxis();
    this.setXaxis(d3.range(that.groupData.length));
    
       
        // .attr("transform", );

        let addGroup = function(g,tag){
            return g.selectAll(tag)
                    .data((d)=>d.values)
                    .enter().append(tag)
                    .attr("name",(d)=>d.key)
      };

      let groupLine = (x,y,width) => 'M'+x+' '+(y-5)+' v 5'+' h '+width+' v -5';
      

      this.groups.push(that.svg.append("g").selectAll("g").data(this.data).enter().append("g").attr("name",(d)=>d.key));
      for (var i=0;i<this.levelNum-2;i++){
          that.groups.push(addGroup(that.groups[i],"g"));
      }
      this.groups.reverse();
      
      let barNum = -1;
      this.groups[0].each(function(d){
        barNum += 1
        let groupSVG = d3.select(this);
        let stackedV = [];
        let sum = d3.sum(d.values.map((d)=>d.values));
        d.values.reduce((acc,cur)=>{
          var obj={};
          obj.key = cur.key;
          obj.y = (cur.values/sum)*100;
          obj.y0 = (acc/sum)*100;
          stackedV.push(obj);
          acc = acc + cur.values
          return acc;
        },0);
       
        groupSVG.selectAll("rect")
                .data(stackedV)
                .enter()
                .append("rect")
                .attr("width", that.x.rangeBand())
                .attr("height", (d)=>that.setting.height-that.y(d.y))
                .attr("fill",(d)=>that.color[d.key])
                .attr("x", function(d, i) { return that.x(barNum); })
                .attr("y", function(d) { return that.y(d.y+d.y0); });

      });
          
      this.svg.append("g")
            .attr("class", "y axis")
            .call(that.yAxis)
            .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", ".71em")
            .style("text-anchor", "end"); 

        for(var i=0;i<this.levelNum-1;i++){
          
          that.groups[i].each(function(d){
            
            let bbox = d3.select(this).node().getBBox();
            
           d3.select(this).append("path")
              .attr('d',function(d){
                  return groupLine(bbox.x,that.setting.height+that.setting.groupLable*(3*i+2),bbox.width);
              })
              .attr('fill',"none")
              .attr("stroke","#000");
           
          });
        }

        for(var i=0;i<this.levelNum-1;i++){
          
          that.groups[i].each(function(d){
            let bbox = d3.select(this).node().getBBox();
           
           d3.select(this)  
              .append('text')
              .text(d.key)
              .attr("x",bbox.x+bbox.width/2)
              .attr("y",that.setting.height+that.setting.groupLable*(3*i+4))
              .attr("dy",".25em")
              .attr("text-anchor",'middle');
          });
        }

        

      }

}

class pieChart extends miniChart {
  constructor(){
    super();
    this.type="pieChart"  
  }

  setYaxis(){
      let that = this;
        this.y = d3.scale.linear().range([that.setting.height,0]).domain([0,100]).nice()
        this.yAxis = d3.svg.axis()
              .scale(that.y)
              .orient("left")
              .tickFormat(d3.format(".2s"));
                
  }

  resetSepecialData(){
    this.setting.groupLable=6;
    this.color = colorMap(this.levels[this.levelNum-1]);
    this.setting.svgHeight = this.setting.height + this.setting.groupLable*(this.levelNum*3+2);
    // splite groups
    var rawData = this.data.map((d)=>d);
    while( typeof rawData[0]['values'][0]['values'] != 'number'){

        rawData = rawData.reduce((acc,cur)=>{
         return acc.concat(cur.values)
        },[])

    }
    this.groupData = rawData.map((d)=>d3.sum(d.values.map((t)=>t.values)));
    
  }

  render(){
    this.resetSVG();
    
    let that = this;
    this.groups = [];
    // console.log(svgbox);
    this.setYaxis();
    this.setXaxis(d3.range(that.groupData.length));
    
       
        // .attr("transform", );

        let addGroup = function(g,tag){
            return g.selectAll(tag)
                    .data((d)=>d.values)
                    .enter().append(tag)
                    .attr("name",(d)=>d.key)
      };

      let groupLine = (x,y,width) => 'M'+x+' '+(y-5)+' v 5'+' h '+width+' v -5';
      

      this.groups.push(that.svg.append("g").selectAll("g").data(this.data).enter().append("g").attr("name",(d)=>d.key));
      for (var i=0;i<this.levelNum-2;i++){
          that.groups.push(addGroup(that.groups[i],"g"));
      }
      this.groups.reverse();
      
      let barNum = -1;
      this.groups[0].each(function(d){
        barNum += 1
        let groupSVG = d3.select(this);
        let stackedV = [];
        let sum = d3.sum(d.values.map((d)=>d.values));
        d.values.reduce((acc,cur)=>{
          var obj={};
          obj.key = cur.key;
          obj.y = (cur.values/sum)*100;
          obj.y0 = (acc/sum)*100;
          stackedV.push(obj);
          acc = acc + cur.values
          return acc;
        },0);

        let radius = that.x.rangeBand()/2;

        let arc = d3.svg.arc().innerRadius(0).outerRadius(radius);
        let pie = d3.layout.pie().value((d)=>d.y)
        groupSVG.append('g')
                .attr('transform',"translate("+(that.x(barNum)+that.x.rangeBand()/2)+","+that.setting.height/2+")")
                .selectAll('path')
                .data(pie(stackedV))
                .enter()
                .append('path')
                .attr('d',arc)
                .attr('fill',(d)=>that.color[d.data.key]);

       
        // groupSVG.selectAll("rect")
        //         .data(stackedV)
        //         .enter()
        //         .append("rect")
        //         .attr("width", that.x.rangeBand())
        //         .attr("height", (d)=>that.setting.height-that.y(d.y))
        //         .attr("fill",(d)=>that.color[d.key])
        //         .attr("x", function(d, i) { return that.x(barNum); })
        //         .attr("y", function(d) { return that.y(d.y+d.y0); });

      });
          
      // this.svg.append("g")
      //       .attr("class", "y axis")
      //       .call(that.yAxis)
      //       .append("text")
      //       .attr("transform", "rotate(-90)")
      //       .attr("y", 6)
      //       .attr("dy", ".71em")
      //       .style("text-anchor", "end"); 

        for(var i=0;i<this.levelNum-1;i++){
          
          that.groups[i].each(function(d){
            
            let bbox = d3.select(this).node().getBBox();
            
           d3.select(this).append("path")
              .attr('d',function(d){
                  return groupLine(bbox.x,that.setting.height+that.setting.groupLable*(3*i+2),bbox.width);
              })
              .attr('fill',"none")
              .attr("stroke","#000");
           
          });
        }

        for(var i=0;i<this.levelNum-1;i++){
          
          that.groups[i].each(function(d){
            let bbox = d3.select(this).node().getBBox();
           
           d3.select(this)  
              .append('text')
              .text(d.key)
              .attr("x",bbox.x+bbox.width/2)
              .attr("y",that.setting.height+that.setting.groupLable*(3*i+4))
              .attr("dy",".25em")
              .attr("text-anchor",'middle');
          });
        }

        

      }

}

class donutChart extends miniChart {
  constructor(){
    super();
    this.type="donutChart"  
  }

  setYaxis(){
      let that = this;
        this.y = d3.scale.linear().range([that.setting.height,0]).domain([0,100]).nice()
        this.yAxis = d3.svg.axis()
              .scale(that.y)
              .orient("left")
              .tickFormat(d3.format(".2s"));
                
  }

  resetSepecialData(){
    this.setting.groupLable=6;
    this.color = colorMap(this.levels[this.levelNum-1]);
    this.setting.svgHeight = this.setting.height + this.setting.groupLable*(this.levelNum*3+2);
    // splite groups
    var rawData = this.data.map((d)=>d);
    while( typeof rawData[0]['values'][0]['values'] != 'number'){

        rawData = rawData.reduce((acc,cur)=>{
         return acc.concat(cur.values)
        },[])

    }
    this.groupData = rawData.map((d)=>d3.sum(d.values.map((t)=>t.values)));
    
  }

  render(){
    this.resetSVG();
    
    let that = this;
    this.groups = [];
    // console.log(svgbox);
    this.setYaxis();
    this.setXaxis(d3.range(that.groupData.length));
    
       
        // .attr("transform", );

        let addGroup = function(g,tag){
            return g.selectAll(tag)
                    .data((d)=>d.values)
                    .enter().append(tag)
                    .attr("name",(d)=>d.key)
      };

      let groupLine = (x,y,width) => 'M'+x+' '+(y-5)+' v 5'+' h '+width+' v -5';
      

      this.groups.push(that.svg.append("g").selectAll("g").data(this.data).enter().append("g").attr("name",(d)=>d.key));
      for (var i=0;i<this.levelNum-2;i++){
          that.groups.push(addGroup(that.groups[i],"g"));
      }
      this.groups.reverse();
      
      let barNum = -1;
      this.groups[0].each(function(d){
        barNum += 1
        let groupSVG = d3.select(this);
        let stackedV = [];
        let sum = d3.sum(d.values.map((d)=>d.values));
        d.values.reduce((acc,cur)=>{
          var obj={};
          obj.key = cur.key;
          obj.y = (cur.values/sum)*100;
          obj.y0 = (acc/sum)*100;
          stackedV.push(obj);
          acc = acc + cur.values
          return acc;
        },0);

        let radius = that.x.rangeBand()/2;

        let arc = d3.svg.arc().innerRadius(radius-10).outerRadius(radius-70);
        let pie = d3.layout.pie().value((d)=>d.y)
        groupSVG.append('g')
                .attr('transform',"translate("+(that.x(barNum)+that.x.rangeBand()/2)+","+that.setting.height/2+")")
                .selectAll('path')
                .data(pie(stackedV))
                .enter()
                .append('path')
                .attr('d',arc)
                .attr('fill',(d)=>that.color[d.data.key]);

       
        // groupSVG.selectAll("rect")
        //         .data(stackedV)
        //         .enter()
        //         .append("rect")
        //         .attr("width", that.x.rangeBand())
        //         .attr("height", (d)=>that.setting.height-that.y(d.y))
        //         .attr("fill",(d)=>that.color[d.key])
        //         .attr("x", function(d, i) { return that.x(barNum); })
        //         .attr("y", function(d) { return that.y(d.y+d.y0); });

      });
          
      // this.svg.append("g")
      //       .attr("class", "y axis")
      //       .call(that.yAxis)
      //       .append("text")
      //       .attr("transform", "rotate(-90)")
      //       .attr("y", 6)
      //       .attr("dy", ".71em")
      //       .style("text-anchor", "end"); 

        for(var i=0;i<this.levelNum-1;i++){
          
          that.groups[i].each(function(d){
            
            let bbox = d3.select(this).node().getBBox();
            
           d3.select(this).append("path")
              .attr('d',function(d){
                  return groupLine(bbox.x,that.setting.height+that.setting.groupLable*(3*i+2),bbox.width);
              })
              .attr('fill',"none")
              .attr("stroke","#000");
           
          });
        }

        for(var i=0;i<this.levelNum-1;i++){
          
          that.groups[i].each(function(d){
            let bbox = d3.select(this).node().getBBox();
           
           d3.select(this)  
              .append('text')
              .text(d.key)
              .attr("x",bbox.x+bbox.width/2)
              .attr("y",that.setting.height+that.setting.groupLable*(3*i+4))
              .attr("dy",".25em")
              .attr("text-anchor",'middle');
          });
        }

        

      }

}