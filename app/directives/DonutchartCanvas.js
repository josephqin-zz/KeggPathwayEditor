angular
   .module('MyApp')
   .directive('donutchartCanvas',function(){
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
   				var groups=[]
               
   				scope.$watch('chartData',function(newVal,oldval){
   					
   					if(!newVal){return;}
                        
            var cData = groupData(scope.chartSetting.yaxis,scope.chartSetting.hierarchies,newVal,statistcFn(scope.chartSetting.smethod),scope.chartSetting.noBlank);
            var pie = d3.layout.pie()
                      .value((d)=> typeof d.values === 'object'?d.values.length:1)
                      .sort((d)=>d.key);

            var levels = flatenNest(cData,[]);
            var levelNum = levels.length-1;
            var scales = getScale(levels[levelNum]);
            var addGroup = function(g,tag){
                  return g.selectAll(tag)
                            .data((d)=>{
                              let gpie = d3.layout.pie()
                                        .startAngle(d.startAngle)
                                         .endAngle(d.endAngle)
                                        .value((d)=>d.data.values.length)
                                        .sort((d)=>d.key);
                              
                              return gpie(d.data.values)})
                            .enter().append(tag)
                            .attr("name",(d)=>d.data.key)
            };

            color0 = scope.chartSetting.colormap;
            color1 = colorMapRadom(levels[levelNum-2]);

            groups.push(
              svg.append("g").attr('transform',"translate("+(width/2)+","+height/2+")").selectAll("g").data(pie(cData)).enter().append("g").attr("name",(d)=>d.data.key)
              );
            // for (var i=0;i<levelNum-1;i++){
            //     groups.push(addGroup(groups[i],"g"));
            // }
            
            
              groups[1]=groups[0].selectAll("g")
                     .data(function(d){
                        pie.startAngle(d.startAngle)
                           .endAngle(d.endAngle)
                                       
                        return pie(d.data.values);               
                     }).enter().append("g")
                       .attr("name",(d)=>d.data.key)
            
            console.log(groups);

            var arc = d3.svg.arc().innerRadius(10).outerRadius(20);                
            var arc2 = d3.svg.arc().innerRadius(20).outerRadius(30);  

            // svg.append('g')
            //     .attr('transform',"translate("+(width/2)+","+height/2+")")
            //     .selectAll('path')
            //     .data(pie(cData))
            //     .enter()
            groups[0].append('path')
                .attr('d',arc)
                .attr('fill',(d)=>color1[d.data.key]);
            groups[1].append('path')
                .attr('d',arc2)
                .attr('fill',(d)=>color0[d.data.key]);
            // console.log(pie(cData))
            
                  

   				})
   			}
   		}
   })