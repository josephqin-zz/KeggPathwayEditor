angular
	.module('MyApp',[])
	.controller('ctableCtrl',['$scope','$http',function($scope,$http){
		
        $scope.grouplist =[];
        $scope.groupDetail = null;
        $scope.showModal = false;
        $scope.selectedRow = [];
        $scope.advanceOpts = true;
        var basicOpts = ['a_number', 'dataset_name'];
        var advancedOpts = ['cell_origin', 'cell_name', 'drug_sensitivity', 'reagent', 'dosage', 'stime', 'complex', 'compound', 'medium', 'time_stage', 'time_point', 'isotope_label', 'standard_control', 'is_qc', 'is_blank'];
    	$scope.bsSelections = basicOpts.map(function(optname){
            let sel = {};
            sel.name=optname;
            let searchtype = optname==='a_number'?'mtb_study':'mtb_maven_dataset';
            sel.selectedOption = null;
            $http({ method:"GET",
                        url: 'http://10.4.1.60/mtb/getData.php?type='+searchtype
                    }).success(function(data){
                        
                        sel.availableOptions = [null].concat(data.data.values.map((d)=>d[optname])) ;
                        
                    }).error(function(data,status,headers){
                        
                    })
            return sel;
        });

        $scope.adSelections = advancedOpts.map(function(optname){
            let sel = {};
            $http({ method:"GET",
                        url: 'http://10.4.1.60/mtb/getData.php?type=mtb_search_sample_field&field='+optname
                    }).success(function(data){
                        
                        sel.availableOptions = [null].concat(data.data.values.map((d)=>d[optname]));
                        
                    }).error(function(data,status,headers){
                        
                    })

            sel.name=optname;
            sel.selectedOption = null;
            return sel;
        });
        
        $scope.searchStudy= function(){
            // $scope.txtContent = $scope.testFile.map((d,index)=>{d['CohortGroup']=null;d['RowID']=index;return d});
            // $scope.selectedRow = [];
            let searchVars = $scope.bsSelections.concat($scope.adSelections);
            let url_str = encodeURI(searchVars.filter((d)=>d.selectedOption!==null).map((d)=>d.name.trim()+'='+d.selectedOption.toString().trim()).join('&'))
            console.log(url_str);
            $http({     method:"GET",
                        url: 'http://10.4.1.60/mtb/getData.php?type=mtb_search_sample&'+url_str
                    }).success(function(data){
                        
                        $scope.txtContent = data.data.values.map((d,index)=>{d['CohortGroup']=null;d['RowID']=index;return d});
                        $scope.selectedRow = [];
                        $scope.grouplist = [];
                        
                        
                        // console.log($scope.adSelections)
                    })
            
    	}

        $scope.showAdvanced = function(){
            $scope.advanceOpts = !$scope.advanceOpts;
        }

        $scope.showChart = function(){
            $scope.groupDetail = null;
            $scope.showModal = !$scope.showModal;
            $scope.groupDetail = $scope.grouplist.map(function(d){
                               
                let groupData = {};
                groupData.name = d.name;
                groupData.gcolor = d.gcolor;
                
                let url_str =encodeURI('sample_ids='+d.rowlist.map((r)=>$scope.txtContent[r].sample_id.toString()).join(',')) ;
                groupData.gurl = 'http://10.4.1.60/mtb/getData.php?type=maven_dataset_by_sample_id&'+url_str;
               
                return groupData;    
                   
            });
            
           
           

        }

        

      

       
}]);