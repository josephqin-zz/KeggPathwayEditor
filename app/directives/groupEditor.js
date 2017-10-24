angular
   .module('MyApp')
   .directive('groupEditor',function(){
   	return {
   		restrict:'E',
         // transclude: true,
   		scope:{
            tableBody:'=',
   			selectedRow:'=',
   			groupList:'='
         },
   		controller:['$scope',function($scope){
           
            $scope.resetGroup = function(){
               $scope.groupList = [];
               if($scope.tableBody!=null){
                  $scope.tableBody.each(function(d){
                     d.CohorGroup = null;
                  })
                  $scope.tableBody.style('background-color',null);
                  $scope.tableBody.attr('class','selectable');
                  $scope.selectedRow = [];
               }
               
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
               let currentGroup = $scope.groupList[index];
               let rows = $scope.tableBody.filter((d)=>$scope.selectedRow.indexOf(d.RowID)>-1);
               console.log(rows);
               rows.style('background-color',currentGroup.gcolor);
               len = $scope.selectedRow.length;
               rows.each(function(d){
                  if (d.CohorGroup === null ){
                     d.CohorGroup = currentGroup.name;
                     currentGroup.rowlist.push(d.RowID);
                  } else if( d.CohorGroup != currentGroup.name ){
                      let exgindex = $scope.groupList.map((d)=>d.name).indexOf(d.CohorGroup);
                      $scope.groupList[exgindex].rowlist.splice($scope.groupList[exgindex].rowlist.indexOf(d.RowID),1);
                      d.CohorGroup = currentGroup.name;
                      currentGroup.rowlist.push(d.RowID);
                  }
               })
              
               $scope.selectedRow = [];

            }
            
            $scope.deleteGroup = function(index){
                if($scope.tableBody!=null){
                  $scope.tableBody.attr('class','selectable');
                  $scope.selectedRow = [];
                  let deletedRow = $scope.tableBody.filter((d)=>$scope.groupList[index].rowlist.indexOf(d.RowID)>-1)
                  deletedRow.style('background-color',null)
                  deletedRow.each(function(d){
                     d.CohorGroup = null;
                  })
                }
                
                $scope.groupList.splice(index,1);


            }
            $scope.resetGroup()
            $scope.gname = null;
   		}],
   		link: function(scope, element, attrs,controllers){
            

   		},
   		templateUrl:'app/templates/groupEditor.htm'
   	}
   });  