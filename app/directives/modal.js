angular
	.module('MyApp')
	.directive('modal',function(){
		return {
			restrict:'E',
			transclude: true,
			scope:true,
			
      		replace:true,
      		
			link:function postLink(scope, element, attrs) {
		          scope.$watch(attrs.visible, function(value){
		          if(value == true)
		            $(element).modal('show');
		          else
		            $(element).modal('hide');
		        });
		          
                
		        $(element).on('shown.bs.modal', function(){
		          scope.$apply(function(){
		            scope.$parent[attrs.visible] = true;
		          });
		        });

		        $(element).on('hidden.bs.modal', function(){
		          scope.$apply(function(){
		            scope.$parent[attrs.visible] = false;
		          });
		        });
		      },
			templateUrl:'app/templates/modal.htm'
		}

	})