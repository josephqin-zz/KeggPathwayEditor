angular
    .module('MyApp')
    .directive('smartTable',function(){
        return {
            restrict:'E',
            scope:{
                tableData:'=',
                selectedRow:'=',
                groupList:'='
            },
            controller:['$scope',function($scope){


               

                // $scope.$watch('groupList',function(newVal,oldVal){
                //     if(!newVal){return;};
                //     newVal.forEach(function(d){
                //         if(d.rowlist.length>0){
                //             $scope.tableData.filter((t)=>d.rowlist.indexOf(t.RowID)>-1).forEach((row)=>row.CohortGroup=d.name)
                           
                //         }
                        
                //     })
                    
                // },true);
                $scope.styleCreator = function(index,gname){
                    
                    if($scope.selectedRow.indexOf(index)>-1){
                        return {'background-color':'#FFC'}
                    }else if(gname!==null){
                        let gindex = $scope.groupList.map((d)=>d.name).indexOf(gname);
                        return {'background-color':$scope.groupList[gindex].gcolor};
                    }
                    else{
                       return {'background-color':null}
                    }
                };

                $scope.deleteGroup = function(index){
                    if( $scope.tableData[index].CohortGroup != null ){
                        
                        let exgindex = $scope.groupList.map((d)=>d.name).indexOf($scope.tableData[index].CohortGroup);
                        $scope.groupList[exgindex].rowlist.splice($scope.groupList[exgindex].rowlist.indexOf(index),1);
                        $scope.tableData[index].CohortGroup = null;
                    }
                };

                $scope.selectRow = function(event,index){
                    event.preventDefault();
                    if(event.shiftKey && $scope.selectedRow.length===1){
                                               
                          let max = d3.max([index,$scope.selectedRow[0]]);
                          let min = d3.min([index,$scope.selectedRow[0]]);
                          for(var i=min+1;i<max;i++){
                             $scope.selectedRow.push(i);
                          }
                    
                       
                    }else{
                       if(!event.ctrlKey){
                                $scope.selectedRow = []; 
                        }
                    
                    }
                   
                        $scope.selectedRow.push(index);
                    
                };



            }],
            link: function(scope, element, attrs,controllers){
                   scope.$watch('tableData',function(newVal,oldVal){
                        if(!newVal ){return;}
                        scope.columns = Object.keys(newVal[0]);
                        scope.columns.splice(scope.columns.indexOf('RowID'),1)
                        element.find('.tablerow').attr('unselectable','on');
                        // console.log(newVal);
                        // element.find('.tablerow').draggable({
                        //         helper: "clone",
                        //         start: function(event, ui) {
                        //             console.log(ui.helper.attr('id'));
                                    
                        //         }
                        // });
                    });
                  
                  scope.$watchCollection('selectedRow',function(newVal,oldVal){
                    if(!newVal || newVal.length===0){return;}
                    
                    
                    let selectRows = element.find('.tablerow').filter(
                        function(i,e){
                            return newVal.map((d)=>'row'+d).indexOf($(this).attr('id')) > -1;
                        }
                    )
                    selectRows.draggable({
                        helper:function(){

                            var container = $('<table/>').attr('id', 'draggingContainer').attr('class','table');
                            container.append(selectRows.clone());
                            return container;
                        }
                    });
                    
                  });  
              
            },
            templateUrl:'app/templates/smartTable.htm'
            
        }

    })