angular
 .module('MyApp')
 .controller('BasicCtrl', function DemoCtrl($scope,$mdDialog,$mdPanel,$http) {
 	this.settings = {
 		printLayout: true,
 		showRuler: true,
 		showSpellingSuggestions: true,
 		chartMode: 'line'
 	};
 	this.chartMode = 'line';
 	$scope.pathway = creatPathWay();
    $scope.pathwayData = null;
    $scope.expermentData = null;
    // $scope.$watch('chartMode',function(newVal,oldVal){
    // 	if(!newVal){return;}
    // 	console.log(newVal);
    // })

    $scope.$watch('pathwayData',function(newVal,oldVal){
	    if(!newVal){return;}
	    if(!$scope.pathwayData){return;}
	    // var modData = cleanData($scope.pathwayData);
	    $scope.labelOpts = newVal.elements.nodes.reduce((acc,cur)=>{acc = acc.concat(Object.keys(cur.data));return acc},[]).filter((d,index,self)=>self.indexOf(d)===index);
	    
    });
    $scope.$watch('expermentData',function(newVal,oldVal){
    if(!newVal){return;}
    if(!$scope.pathwayData){return;}
    // var modData = cleanData($scope.pathwayData);
    // console.log(data.elements.nodes)

    });
    this.fileuploadPanel = function(name,type,ev){

		  var position = $mdPanel.newPanelPosition()
		      .absolute()
		      .center();

		  var config = {
		    attachTo: angular.element(document.body),
		    controller: function(mdPanelRef) {

            this.upload = function(){
					var f = document.getElementById('input-file-id').files[0];
					
                    r = new FileReader(); 
					r.onloadend = function(e){
					    
					    if(type === 'json'){
                           $scope.pathwayData={elements:JSON.parse(e.target.result).elements};
                           $scope.pathwayFile=f.name; 
                        }else{
					       $scope.expermentData=d3.tsv.parse(e.target.result);
					       $scope.expermentFile=f.name;

					    }
				  				    
					    $scope.$apply();
					    mdPanelRef.destroy();
					}
					  r.readAsBinaryString(f);
			}

            },
            controllerAs: 'Pctrl',
		    disableParentScroll: false,
		    templateUrl: 'uploadPanel.htm',
		    hasBackdrop: true,
		    panelClass: 'demo-dialog-example',
		    position: position,
		    trapFocus: true,
		    zIndex: 100,
		    clickOutsideToClose: true,
		    escapeToClose: true,
		    focusOnOpen: true,
		    locals: {
		    	'titlename' : name
		    }
		  };

  		 $mdPanel.open(config);

    };

 	this.dataMatchingPanel = function(name, ev) {
 		var position = $mdPanel.newPanelPosition()
		      .absolute()
		      .right('15%')
		      .top('15%');

		 var config = {
		        id: name,
		        controller: function(mdPanelRef){
		            this.matchdata = function(){
		            	$scope.pathway.mapMatchCol = this.$scope.mlabelcol;
             		  	$scope.pathway.experimentMatchCol = this.$scope.elabelcol;
             		    $scope.pathway.dataMatch();
		            }

		        	this.closeDialog = function() {
		        		
		        	  

				      mdPanelRef && mdPanelRef.close();
				    }
                                    

		        },
		        controllerAs: 'dmctrl',
		        templateUrl: 'app/templates/dataMatchingPanel.htm',
		        position: position,
		        locals: {
		          mlabelOpts: $scope.labelOpts,
		          elabelOpts: $scope.pathway.experimentCols
		        },
		        openFrom: {top:0, left:0},
		        escapeToClose: true,
		        focusOnOpen: true,
		        trapFocus: true,
		        zIndex: 100,
		        
		        
      	};

      $mdPanel.open(config);
 	};

 	this.penalPopup = function(name,ev){
 		var position = $mdPanel.newPanelPosition()
		      .absolute()
		      .right('15%')
		      .top('15%');

		 var config = {
		        id: name,
		        controller: function(mdPanelRef){
		        	this.closeDialog = function() {
				      mdPanelRef && mdPanelRef.close();
				    }

                    this.$scope.$watch('fontScale',function(newVal,oldVal){
				    	if(!newVal){return;}
				    	$scope.pathway.nodeFontSize(newVal);
				    })
                    this.$scope.$watch('labelcol',function(newVal,oldVal){
				    	if(!newVal){return;}
				    	$scope.pathway.nodeLabel(newVal);
				    })

		        },
		        controllerAs: 'ppctrl',
		        templateUrl: 'pathwayPanel.htm',
		        position: position,
		        locals: {
		          labelOpts: $scope.labelOpts
		        },
		        openFrom: {top:0, left:0},
		        escapeToClose: true,
		        focusOnOpen: true,
		        trapFocus: true,
		        zIndex: 100,
		        
		        
      	};

      $mdPanel.open(config);      

 	}

 	this.chartdataPanel = function(name,ev){
 		var position = $mdPanel.newPanelPosition()
		      .absolute()
		      .right('15%')
		      .top('15%');

		 var config = {
		        id: name,
		        controller: function(mdPanelRef){
		        	this.chatTypeList = ['line','bar','stackedBar1','stackedBar2','pie','donut','stdline','stdbar']

		        	this.charttype = 'line';

		        	this.noBlank = false;
		        	this.closeDialog = function() {
				      mdPanelRef && mdPanelRef.close();
				    }
				    this.cleanChart = function(){
				    	$scope.pathway.cleanChart();
				    }
				    this.addChart = function(){
				    	if(!this.yName || this.hierarchies.length === 0 ){return;}
				    	
				    	$scope.pathway.renderCharts(this.yName,this.hierarchies,this.smethod,this.charttype,this.noBlank);
				    }
				    this.addLegend = function(){
				    	$scope.pathway.addLegend(this.charttype);
				    }
				    this.deleteLegend = function(){
				    	$scope.pathway.deleteLegend();
				    }

				    this.$scope.chartScale = 0;
				    this.$scope.legendScale = 0;
				    
				    this.$scope.$watch('chartScale',function(newVal,oldVal){
				    	if(!newVal){return;}
				    	$scope.pathway.chartScale(newVal);
				    });

				    this.$scope.$watch('legendScale',function(newVal,oldVal){
				    	if(!newVal){return;}
				    	$scope.pathway.legendScale(newVal);
				    });

				    this.$scope.$watch('labelScale',function(newVal,oldVal){
				    	if(!newVal){return;}
				    	$scope.pathway.legendColorScale(newVal);
				    })

		        },
		        controllerAs: 'adctrl',
		        templateUrl: 'addChart.htm',
		        position: position,
		        locals: {
		          labelOpts: $scope.pathway.experimentCols
		        },
		        openFrom: {top:0, left:0},
		        focusOnOpen: true,
		        escapeToClose: true,
		        trapFocus: true,
		        zIndex: 100,
		        
		        
      	};

      $mdPanel.open(config);      

 	}

 	this.downloadFile = function(type,ev){
 		  var urlData = null;
 		  var url=null;
 		  if(type=='png'){
				urlData = $scope.pathway.cy.png({full:true});
				url = urlData.replace("image/"+type, "application/octet-stream");
 		  }else if(type=='jpg'){
 		  		urlData = $scope.pathway.cy.jpg({full:true})
 		  		url = urlData.replace("image/"+type, "application/octet-stream");
 		  }else if(type='json'){
 		  	 let data = JSON.stringify($scope.pathway.cy.json());
 		  	 var blob = new Blob([data],{type:"application/json"});
 		  	 url = window.URL.createObjectURL(blob);
 		  	
 		  }else{
 		  	return;
 		  }
          
 		  var anchor = angular.element('<a/>');
          anchor.attr({
            href: url,
            target: '_blank',
            download: type+'_file.'+type
          })[0].click();
   	}

 	
 });