angular
   .module('MyApp')
   .directive('fileUpload',['$parse',function($parse){
	return{
		restrict:'E',
		scope: {
			fileType:'@',
			fileData:'=',
			fileName:'=',
			fileComplete:'='
		},
		controller: function($scope){
			$scope.progress = 0;
			$scope.$on('fileProgress',function(event,args){
			        $scope.progress = (args.loaded / args.total)*100 ;
			        
      			});
			

		},
		link:function(scope, element, attrs){

			    element.bind('change',function(even){

			   	var file = (even.srcElement || even.target).files[0];
             	
             	r = new FileReader();
                
                r.onloadstart = function(e){
                	scope.$apply(function(){
                		scope.progress = 0;
                		scope.fileComplete = false;
                	})
                };


             	r.onprogress = function(e){
             		scope.$broadcast('fileProgress',{
             			total: e.total,
             			loaded: e.loaded
             		});
             	};

             	r.onloadend = function(e){
		    
				    	scope.$apply(function(){
				    		if(scope.fileType=='tsv'){
				    			scope.fileData = d3.tsv.parse(e.target.result);
				    		}else if(scope.fileType=='csv'){
				    			scope.fileData = d3.csv.parse(e.target.result);
				    		}else if(scope.fileType=='kgml'){
				    			let parser = new DOMParser();
				    			scope.fileData = kgml2json(parser.parseFromString(e.target.result,"text/xml").getElementsByTagName("pathway")[0])
				    		}
		             		
		             		scope.fileName = file.name;
		             		scope.fileComplete = true;

		             		// scope.$parent.progress=0;
		             	})
				}
    			r.readAsBinaryString(file);
           	
             });

		},
		templateUrl:'app/templates/uploadFile.htm'
	}
}])