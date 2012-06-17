(function(jQuery) {
jQuery.fn.tplview = function(method){
    var that = this;
    
    this.saveParamset = function(paramsetName){
    	console.log("saveParamset", paramsetName);

    	var paramVals = _getParamVals();
    	
    	var paramset = { name: paramsetName, vals: {} };
    	var paramNames = that.option.paramNames;
    	jQuery(paramNames).each(function(i, v){
    		paramset.vals[v] = paramVals[i];
    	});
    	that.option.saveParamset({ nid: that.attr("nid"), paramset: paramset });
    	
    	function _getParamVals(){
    		var vals = [];
        	that.find(".params").find(".param_value").each(function(i, v){
        		vals.push($(v).val().trim());
        	});
        	return vals;
    	}

    }
    
    this.addParamset = function(paramsetid, paramsetName){
    	var firstOption = that.find("select.param_set option").eq(0);
    	firstOption.after( $('<option>').attr({ value: paramsetid }).text(paramsetName) );
    	console.log(that.find("select.param_set"));
    }
        
    var methods = {
    		init : init,
    		saveParamset : this.saveParamset,
    		addParamset: this.addParamset
    }
    
	if( methods[method] ){
		return methods[method].apply( this, Array.prototype.slice.call( arguments, 1));
	}else if( typeof method === 'object' || !method ){
		return methods.init.apply( this, arguments );
	}else{
		jQuery.error( 'Method ' + method+ ' does not exist.' );
	}
    
    function init(option){
    	var defaultOption = {
    		title : "",
    		text : "",
    		note : "",
    		paramNames : [],
    		paramset: [],
    		activeParamSetId : -1,
    		onsaveParamset : function(){}
    	};
    	that.option = $.extend(defaultOption, option);

    	this.attr("nid", option.nid);

        that.resizable();
        that.find(".text").resizable();
        
        _setButtons();
        _setTextValues();
        _createNote();
        _createParamArea();
        
    	_setLayout();
        
        _setEvents();
                
        return that;
    }
    

    
    function _setLayout(){
    	var option = that.option;
        if(option.width){
        	if(that.width() < option.width){
        		that.css("width", option.width);
        	}
        }
        if(option.height){
        	if(that.height() < option.height){
        		that.css("height", option.height);
        	}
        }
        
        that.css("min-height", that.height());
        that.css("position", "absolute");
        if(option.left){
        	that.css("left", option.left);
        }
        if(option.top){
        	that.css("top", option.top);
        }
    }

    function _setButtons(){
        that.find(".ui_button").button();
        that.find(".ui-dialog-titlebar-close").hover(function(){
        	$(this).addClass("ui-state-hover");
        }, function(){
        	$(this).removeClass("ui-state-hover");
        });
    }
    
    function _setTextValues(){
        if(that.option.title){
            that.find(".header span.ui-dialog-title").text(that.option.title);
        }
        if(that.option.text){
            that.find(".text").text(that.option.text);
        }
    }
    
    function _createParamArea(){
		var paramNames = that.option.paramNames;
		var paramset = that.option.paramset;
		var activeParamSetId = that.option.activeParamSetId;
    	if(paramNames.length > 0){
    		paramset.unshift({id: "-1" ,name: "", vals: {}});	//add empty set
    		_createSelect(paramset);
    		
    		var activeParamsetIdx = _getactiveParamsetIdx(paramset, activeParamSetId);
    		var activeParamset = paramset[activeParamsetIdx];
    		_createParamRows(paramNames, activeParamset.vals);
    		
    		that.activeParamsetIdx = activeParamsetIdx;

    		that.find(".param_area").show();
    	}
    	
    	function _createParamRows(paramNames, paramVals){
    		var tmplParams = [];
            $(paramNames).each(function(i, v){
            	var val = paramVals[v] ? paramVals[v] : "";
            	tmplParams.push({ name: v, val: val });
            });
    		that.find("ul.params").append($("#tplview-param-li").tmpl(tmplParams));
    	}
    	
		//get active paramset Idx
		function _getactiveParamsetIdx(paramset, activeid){
			var retIdx = 0;
			$(paramset).each(function(i, v){
				if(v.id === activeid){
					retIdx = i;
				}
			});
			return retIdx;
		}
        
		function _createSelect(paramset){
			var select  = that.find(".param_set");
			var selectVal = "-1";
            $(paramset).each(function(i, v){
            	select.append($("<option>").attr({value: v.id }).text(v.name));
                if( v.id === activeParamSetId ){
                    selectVal = v.id;
                }
            });
            select.val(selectVal);
		}        
        
    }
    
    function _remove(){
		that.remove();
		that.trigger("removed.tplview");
    }
    
    function _setEvents(){
    	
    	that.find(".edit").click(function(){
    		var position = that.position();
    		that.trigger("gotoedit.tplview", $.extend(
    				that.position(), {width: that.width(), height: that.height()}
    			)
    		);
    		_remove();
    	});
    	
    	that.find(".ui-dialog-titlebar-close").click(function(){
    		_remove();
    	});
    	
        that.find(".param_set").change(function(e){
        	var paramNames = that.option.paramNames;
            var paramTexts = that.find(".params .param_value");

            //変更前の値を格納
            $(paramNames).each(function(i, v){
            	that.option.paramset[that.activeParamsetIdx].vals[v] = $(paramTexts[i]).val();
            });

            var idx = this.selectedIndex;
            that.activeParamsetIdx = this.selectedIndex;
            var activeParamset = that.option.paramset[that.activeParamsetIdx];
            
            $(paramNames).each(function(i, v){
            	var val =  activeParamset.vals[v] || "";
            	$(paramTexts[i]).val(val);
            });

        });
        
        that.find(".paramset_save").click(function(){
        	
        	if(!inputcheck()){
        		return;
        	}
        	
        	that.trigger("paramset_save.tplview", {
        		selectedId : -1,
        		nid: that.attr("nid")
        	});
        	
        	function inputcheck(){
        		var inputtedSomething = false;
            	that.find(".params").find(".param_value").each(function(i, v){
            		if( $(v).val().trim() !== ""){
            			inputtedSomething = true;
            		}
            	});
            	return inputtedSomething;
        	}
        	
        });
        
        that.find(".paramset_rename").click(function(){
            that.trigger("paramset_rename.tplview" );
        });
        
    }

    
    function _createNote(){
        that.find('.note').qtip({
           content: that.option.note,
           show: 'click',
           hide: 'click',
           position: {
              corner: {
                 target: 'rightMiddle',
                 tooltip: 'leftTop'
              }
           },
            style: { 
                name: 'blue',
                left: 50,
                tip: {
                    corner: "leftTop",
                    color: "#ADD9ED",
                    size: {x: 30, y:8},
                },
                border: {
                      width: 2,
                      radius: 4,
                      color: '#ADD9ED'
                   },        
              'font-size': 12
            }
        });        
    }
        
    
};
})(jQuery);