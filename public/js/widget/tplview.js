(function(jQuery) {
jQuery.fn.tplview = function(option){
    var that = this;
    option = option || {};
    this.option = option;
    
    this.resizable();
    this.find(".text").resizable();
    
    _setButtons();
    _setTextValues();
    _createNote();
    _createParamArea();
    _setEvents();

        
    return this;
    
    function _setButtons(){
        that.find(".ui_button").button();
        that.find(".ui-dialog-titlebar-close").hover(function(){
        	$(this).addClass("ui-state-hover");
        }, function(){
        	$(this).removeClass("ui-state-hover");
        });
    }
    
    function _setTextValues(){
        if(option.title){
            that.find(".header span.ui-dialog-title").text(option.title);
        }
        if(option.text){
            that.find(".text").text(option.text);
        }
    }
    
    function _createParamArea(){
        if(option.paramNames && option.paramNames.length > 0){
            //空Setを追加
            option.paramValSets = option.paramValSets || [];
            var emptyParamSet = {id: "-1" ,name: "", params: _createEmptyStrArray(option.paramNames.length)};
            option.paramValSets.unshift(emptyParamSet);
            
            var paramSetSelect  = that.find(".param_set");
            var selectVal = "-1";
            that.activeParamSetIdx = 0;
            $(option.paramValSets).each(function(i, v){
                paramSetSelect.append($("<option>").attr({value: v.id }).text(v.name));
                if(v.id === option.activeParamSetId){
                    selectVal = v.id;
                    that.activeParamSetIdx = i;
                }
            });
            paramSetSelect.val(selectVal);
            
            var tplParams = [];
            var paramVals = option.paramValSets[that.activeParamSetIdx].params;
            $(option.paramNames).each(function(i, v){
                tplParams.push({name: v, val: paramVals[i]});
            });
            that.find("ul.params").append($("#tplview-param-li").tmpl(tplParams));        
        }
    
    }
    
    function _setEvents(){
    	
    	that.find(".edit").click(function(){
    		console.log(that.position());
    		var position = that.position();
    		that.trigger("gotoedit.tplview", $.extend(
    				that.position(), {width: that.width(), height: that.height()}
    			)
    		);
    		that.remove();
    	});
    	
    	that.find(".ui-dialog-titlebar-close").click(function(){
    		that.trigger("removed.tplview");
    		that.remove();
    	});
    	
        that.find(".param_set").change(function(e){
            
            //変更前の値を格納
            that.find(".params .param_value").each(function(i, v){
                that.option.paramValSets[that.activeParamSetIdx].params[i] = $(v).val();
            });
                    
            var idx = this.selectedIndex;
            that.activeParamSetIdx = this.selectedIndex;
           
            var params = that.find(".params .param_value");
            $(that.option.paramValSets[idx].params).each(function(i, v){
                $(params[i]).val(v);
            });   
            $(that.option.paramValSets[idx].params).each(function(i, v){
                $(params[i]).val(v);
            });               
        });
        
        that.find(".param_set_rename").click(function(){
            //TODO            
        });
        
        
    }
    
    function _createEmptyStrArray(len){
        var a = [];
        for(var i = 0; i < len; i++){
            a.push("");
        }
        return a;
    }    
    
    
    function _createNote(){
        that.find('.note').qtip({
           content: option.note,
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