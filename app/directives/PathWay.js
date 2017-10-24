angular
 .module('MyApp')
 .directive('pathwayMap',function(){
 	return{
 		restrict:'E',
 		scope:{
 			mData:'=mapdata',
 			eData:'=experdata'
 		},
 		link:function(scope,element,attrs){
 			
 			scope.$parent.pathway.initial(element[0]);
 			 						
 			scope.$watch('mData',function(newVal,oldVal){
 				if(!newVal){return;}
 				   
 				   scope.$parent.pathway.bind(newVal);
		           scope.$parent.pathway.draw();
		           scope.$parent.pathway.dataMatch();

 			});

 			scope.$watch('eData',function(newVal,oldVal){
 				if(!newVal){return;}
 				scope.$parent.pathway.bindExperData(newVal);
 				scope.$parent.pathway.dataMatch();
 				
 			})

 		}
 	}
 });