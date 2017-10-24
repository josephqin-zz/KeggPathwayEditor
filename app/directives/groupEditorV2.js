angular
   .module('MyApp')
   .directive('groupEditor',function(){
   	return {
   		restrict:'E',
         // transclude: true,
   		scope:{
            selectedRow:'=',
   			    groupList:'=',
            tableData:'='
         },
   		controller:['$scope',function($scope){
           
            $scope.resetGroup = function(){
               for(g of $scope.groupList){
                  for (r of g.rowlist){
                  $scope.tableData[r].CohortGroup = null;
                  }
               }
               $scope.groupList = [];
                       
            }

            $scope.addGroup = function(){
               if( $scope.groupList.filter( (d)=>d.name===$scope.gname ).length===0 ){
                  let g = {}
                  let max=1000;
                  g.name = $scope.gname;
                  g.gcolor = color(Math.floor( Math.random() * (max - 0 + 1) )+0 );
                  g.rowlist = [];
                  $scope.groupList.push(g);

               }
               $scope.gname = null;
            }

            $scope.addRow2Group = function(index){
              
               for(r of $scope.selectedRow){

                 if($scope.tableData[r].CohortGroup!=null && $scope.tableData[r].CohortGroup!=$scope.groupList[index].name){
                     let exgindex = $scope.groupList.map((d)=>d.name).indexOf($scope.tableData[r].CohortGroup);
                     $scope.groupList[exgindex].rowlist.splice($scope.groupList[exgindex].rowlist.indexOf(r),1);
                     
                  }
                  $scope.groupList[index].rowlist.push(r);
                  $scope.tableData[r].CohortGroup = $scope.groupList[index].name;
               }
                         
               $scope.groupList[index].rowlist = $scope.groupList[index].rowlist.filter((r,i,self)=>self.indexOf(r)===i);
               $scope.selectedRow = [];


            }
            
            $scope.deleteGroup = function(index){
                for (r of $scope.groupList[index].rowlist){
                  $scope.tableData[r].CohortGroup = null;
                } 
                
                $scope.groupList.splice(index,1);  

            }
            $scope.resetGroup()
            $scope.gname = null;
   		}],
   		link: function(scope, element, attrs,controllers){
            scope.$watch('groupList',function(newVal,oldVal){
               if(!newVal || newVal.length===0){return;};
               element.find('.groupbox').droppable({
                   tolerance: 'pointer',
                   drop: function(event, ui) {
                     let RowsList = [];
                     
                     scope.addRow2Group(+$(this).attr('id'));
                     scope.$apply();
                     ui.helper.remove();
                     $('.ui-draggable').draggable("destroy");

                   }
               })
            },true)

   		},
   		templateUrl:'app/templates/groupEditor.htm'
   	}
   });  