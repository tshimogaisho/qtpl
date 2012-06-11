(function(jQuery) {
jQuery.fn.tplview = function(method){
    var that = this;
    
    var my = my || {};
        
    var methods = {
    		init : init,
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
    		activeParamSetIdx : -1
    	};
    	my.option = $.extend(defaultOption, option);
    	
    	console.log("tplview init option: ", option);
    	
    	
    	
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
    	var option = my.option;
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
        if(my.option.title){
            that.find(".header span.ui-dialog-title").text(my.option.title);
        }
        if(my.option.text){
            that.find(".text").text(my.option.text);
        }
    }
    
    function _createParamArea(){
        if(my.option.paramNames && my.option.paramNames.length > 0){
            //空Setを追加
            my.option.paramValSets = my.option.paramValSets || [];
            var emptyParamSet = {
            		id: "-1" ,name: "", 
            		params: new Array(my.option.paramValSets.length).join("#").split("#")
            	};
            my.option.paramValSets.unshift(emptyParamSet);
            
            var paramSetSelect  = that.find(".param_set");
            var selectVal = "-1";
            if(my.option.paramValSets){
                $(my.option.paramValSets).each(function(i, v){
                    paramSetSelect.append($("<option>").attr({value: v.id }).text(v.name));
                    if( v.id === my.option.activeParamSetId ){
                        selectVal = v.id;
                        that.activeParamSetIdx = i;
                    }
                });
                paramSetSelect.val(selectVal);	
            }
        }

        var tplParams = [];
        var paramVals = [];
        if( my.option.activeParamSetIdx !== -1 ){
        	paramVals = my.option.paramNames[my.option.activeParamSetIdx].params;
        }else{
        	paramVals = new Array(my.option.paramNames.length).join("#").split("#");        	
        }
        if(my.option.paramNames.length > 0){
            $(my.option.paramNames).each(function(i, v){
                tplParams.push({ name: v, val: paramVals[i] });
            });
            that.find("ul.params").append($("#tplview-param-li").tmpl(tplParams));
            that.find(".param_area").show();
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
            
            //変更前の値を格納
            that.find(".params .param_value").each(function(i, v){
                my.option.params[that.activeParamSetIdx].params[i] = $(v).val();
            });
                    
            var idx = this.selectedIndex;
            that.activeParamSetIdx = this.selectedIndex;
           
            var params = that.find(".params .param_value");
            $(my.option.params[idx].params).each(function(i, v){
                $(params[i]).val(v);
            });   

        });
        
        that.find(".paramset_save").click(function(){
        	var params = 
        	that.trigger("paramset_save.tplview", {
        		selectedId : -1,
        	});
        });
        
        that.find(".paramset_rename").click(function(){
            that.trigger("paramset_rename.tplview" );
        });
        
        
    }

    
    function _createNote(){
        that.find('.note').qtip({
           content: my.option.note,
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