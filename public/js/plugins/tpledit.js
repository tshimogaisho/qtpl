(function(jQuery) {
jQuery.fn.tpledit = function(method){        
        var that = this;
        var my = {};
                
        this.save = function(){
        	var data = that.getdata();
        	console.log("this.save", data);
            my.prop.onsave(data);
            that.trigger("onsaved.tpledit", 
            		$.extend(
            			data,
            			$.extend(that.position(), { width: that.width(), height: that.height() } )
            		)
            	);
        }
        
        this.removeTplEdit = function(){
        	console.log("removeTplEdit");
    		that.trigger("removed.tplview");
        	that.remove();
        }
        
        this.getdata = function(){
        	return {
        		nid: that.attr("nid"),
        		title: that.find(".title_text").val(),
        		text: that.find(".text").val(),
        		note: that.find(".note_text").val(),
        		paramNames: ( function(){
	        			var params = [];
	        			that.find(".param_name_text").each(function(i, v){
	        				var x = $(v).val().trim();
	        				if(x !== ""){
	        					params.push(x);
	        				}
	        			});
        				return params;
        			} )()
        	}
        };             
        
        var methods = {
        		init : init,
        		save : this.save,
        		removeTplEdit: this.removeTplEdit,
        		getdata: this.getdata
        }

    	if( methods[method] ){
    		return methods[method].apply( this, Array.prototype.slice.call( arguments, 1));
    	}else if( typeof method === 'object' || !method ){
    		return methods.init.apply( this, arguments );
    	}else{
    		jQuery.error( 'Method ' + method+ ' does not exist.' );
    	}
           
        
        function init(prop){
            var defaultOption = {
            		title: "", text: "", note: "", paramNames : [""],
            		onsave: function(){},
            		charLimit: {
            		    "title_text" : 50,
            		    "text" : 4000,
            		    "note_text" : 2000,
            		    "param_name" : 30
            		}
            };
        	
        	my.prop = $.extend(defaultOption, prop);
        	        	
        	this.attr("nid", prop.nid);        	
        	
            _setTextValues();
            _createParamArea();

            this.resizable({alsoResize: this.find(".text"), stop: function(e, ui){
            	that.trigger("resized.tpledit", [ui.size, ui.element[0]]);
            }});

            _setLayout();
            
            _setButtons();
            _setEvents();
                        
            return that;

            function _setLayout(){
            	var prop = my.prop;
                if(prop.width){
                	if(that.width() < prop.width){
                		that.css("width", prop.width);
                	}
                }
                if(prop.height){
                	if(that.height() < prop.height){
                		that.css("height", prop.height);
                	}
                }
                
            	var text = that.find(".text");
            	var textMinHeight = parseInt(text.css("min-height").replace("px", ""));
            	var minifiableSize = text.height() - textMinHeight;	//テキストの縮小可能なサイズ
                
                that.css("min-height", that.height() - minifiableSize);
                that.css("position", "absolute");
                if(prop.left){
                	that.css("left", prop.left);
                }
                if(prop.top){
                	that.css("top", prop.top);
                }
            }

            function _setEvents(){
            	
            	that.find(".ui-dialog-titlebar-close").click(function(){
            		that.removeTplEdit();
            	});
            	
                that.find(".note").bind("click", _noteClickedProcess);

                _addOnHover(that.find(".param_area"));
                
                that.find(".add_param").parent("p").bind("click",onclickAddParam); 
                that.find(".remove_param").parent("p").bind("click", onclickRemoveParam);
                
                that.find(".save").bind("click", _save);

                that.find(".cancel").bind("click", function(e){
                	that.trigger("oncancel.tpledit", 
	            		$.extend(
	            				that.getdata(),
	                			$.extend(that.position(), { width: that.width(), height: that.height() } )
	                		)
	                	);
                	return false;
                });
                	                
            }
            
                    
            function _setButtons(){
            	var prop = my.prop;
                that.find(".ui-dialog-titlebar-close").hover(function(){
                	$(this).addClass("ui-state-hover");
                }, function(){
                	$(this).removeClass("ui-state-hover");
                });
                that.find(".ui_button").button();
            }
            
            function _setTextValues(){
                that.find(".header span").text(prop.title + " (編集)");
                that.find(".title_text").val(prop.title);
                that.find(".text").val(prop.text);

                that.find(".note_text").val(prop.note);	
            }
            
            function _createParamArea(){
                var paramObjArray = [];
                $(my.prop.paramNames).each(function(i, val){
                    paramObjArray.push({"param_name" : val});
                });
                if(paramObjArray.length === 0){
                	paramObjArray.push({"param_name" : ""});
                }
                that.find(".param_area").append($("#tpledit-param-li").tmpl(paramObjArray));
            }
            
            function _noteClickedProcess(e){
            	var noteText = that.find(".note_text");
            	var windowHeightBefore = that.height();
            	if(noteText.css("display") === "none"){
            		noteText.show();
            		if(windowHeightBefore === that.height()){
            			that.css("height", that.height() + noteText.height() );
                        that.css( "min-height", _getMinHeight() + noteText.height());
            		}
            	}else{
            		noteText.hide();
            		if(windowHeightBefore === that.height()){
            			that.css("height", that.height() - noteText.height() );
                        that.css( "min-height", _getMinHeight() - noteText.height());
            		}
            	}       
            }
            
            function _getMinHeight(){
            	return parseInt(that.css("min-height").replace("px", ""));
            }
            
            
            /**
             * 新規パラメータ行を追加
             * @param targetRowLi ターゲット行
             **/
            function insRow(targetRowLi){
            	var beforeHeight = that.height();
                targetRowLi.after($("#tpledit-param-li").tmpl([{"param_name":"newparam"}]));
                var addedRowLi = targetRowLi.next();
                addedRowLi.find(".add_param").parent("p").bind("click", function(e){onclickAddParam(e);});
                addedRowLi.find(".remove_param").parent("p").bind("click", function(e){onclickRemoveParam(e);});  
                _addOnHover(addedRowLi);
                
                var rowHeight = addedRowLi.find("div").height();
                that.css("min-height", _getMinHeight() + rowHeight);
                if(beforeHeight === that.height()){
                	that.css("height", that.height() + rowHeight);
                }
                return addedRowLi;
            };
            
            /**
             * パラメータ追加ボタンクリック時処理
             * @param e
             **/
            function onclickAddParam(e){
                if( $(e.target).parents("ul").find("li").size() < 10 ){
                    insRow( $(e.target).parents("li") ).find(".param_name_text").focus();
                }
            };
            
            function _adjustSize(heightBefore){
                var height = that.height();
                
                var formElement= that.find(".edit_form");
                var formElementBottomY = formElement.position().top + formElement.height();
                console.log("height:%d formBottomY: %d",  height, formElementBottomY);
                if(formElementBottomY + 10 > height){
                	//formのボトムがウィンドウをオーバーしている場合は調整
                	height = formElementBottomY + 10;
                	that.css("height", height);
                }
                if(height > heightBefore){
                	//サイズが前より大きくなった場合はmin-heightを設定
                	that.css("min-height", height);
                }
            }
            
            function onclickRemoveParam(e){
            	
            	var ul = $(e.target).parents("ul");
                if( ul.find("li").size() > 1 ){
                	var windowHeight = that.height();
                	var rowHeight = $(e.target).parents("li div").height();
                    $(e.target).parents("li").remove();
                    var windowHeightAfter = that.height();
//                    console.log("windowHeight: %d windowHeightAfter: %d", windowHeight, windowHeightAfter);
                    that.css( "min-height", _getMinHeight() - rowHeight);
                    if(windowHeight === windowHeightAfter){
                    	that.css( "height", that.height() - rowHeight );
                    }
                 }
            };
            
            
            /**
             * jQuery UI のアイコンに対してホバーイベントを設定
             * @param target 対象範囲となる要素
             **/
            function _addOnHover(target){
                target.find('p.ui-state-default').hover(
                    function() { $(this).addClass('ui-state-hover');}, 
                    function() { $(this).removeClass('ui-state-hover'); }
                );
            };
            
            
            function _save(e){
            	try{
    	            if( ! _inputErrorCheck() ){
    	                return false;
    	            }       			
            		
            		that.save();
    	            return false;

            	}catch(e){
            		console.log(e);
            		console.error(e);
            		return false;
            	}
            }
            
            function _addInputErrorClass(target){
                target.addClass("input_error");
                target.focus();
                setTimeout(function(){
                    target.removeClass("input_error");
                }, 3000)
            }        
            
        	function _inputErrorCheck(){
                var errorExist = false;
                
                var titleText = that.find(".title_text");
                if($.trim(titleText.val()) === ""){
                    _addInputErrorClass(titleText);
                    errorExist = true;
                }
                var charLimit = my.prop.charLimit;

                (function(){

                    $(["title_text", "text","note_text"]).each(function(i, v){
                        var o = that.find("." + v);
                        if(!_checkTextLength($.trim(o.val()), charLimit[v])){
                            _addInputErrorClass(o);
                            errorExist = true;
                        }
                    });
                })();
                
                that.find(".param_name_text").each(function(i, v){
                        if(!_checkTextLength($.trim($(v).val()), charLimit.param_name)){
                            _addInputErrorClass($(v));
                            errorExist = true;
                        }
                });
                return !errorExist;
                
                function _checkTextLength(txt, len){
                    return txt.length <= len;
                }
        	}              	
        }
    }

})(jQuery);