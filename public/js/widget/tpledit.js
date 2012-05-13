(function(jQuery) {
jQuery.fn.tpledit = function(prop){        
        var that = this;
        var defaultOption = {title: "", text: "", note: "", params : [""]};
    	prop = $.extend(defaultOption, prop);

    	var text = this.find(".text");
    	var textMinHeight = parseInt(text.css("min-height").replace("px", ""));
    	var minifiableSize = text.height() - textMinHeight;	//テキストの縮小可能なサイズ
    	
        _setTextValues();
        _createParamArea();

        this.resizable({alsoResize: this.find(".text")});

        _setLayout();
        
        _setButtons();
        _setEvents();
        
        function _setLayout(){
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
        		that.trigger("removed.tplview");
        		that.remove();
        	});
        	
            that.find(".note").bind("click", _noteClickedProcess);

            _addOnHover(that.find(".param_area"));
            
            that.find(".add_param").parent("p").bind("click",onclickAddParam); 
            that.find(".remove_param").parent("p").bind("click", onclickRemoveParam);
            if(prop.oncancel){
                that.find(".cancel").bind("click", function(e){prop.oncancel(e); return false;});
            }
            that.find(".save").bind("click", _save);
            
            that.find(".cancel").bind("click", function(e){
                that.trigger("oncancel");
                return false;
            });            
            
            
        }
        
        return this;
                
        function _setButtons(){
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
            $(prop.params).each(function(i, val){
                paramObjArray.push({"param_name" : val});
            });
            that.find(".param_area").append($("#tpledit-param-li").tmpl(paramObjArray));
        }
        
        function _noteClickedProcess(e){
        	var noteText = $(".note_text");
        	var windowHeightBefore = that.height();
        	if(noteText.css("display") === "none"){
        		noteText.show();
        		console.log(windowHeightBefore, that.height());
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
//                console.log("windowHeight: %d windowHeightAfter: %d", windowHeight, windowHeightAfter);
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

            var errorExist = false;
            
            var titleText = that.find(".title_text");
            if($.trim(titleText.val()) === ""){
                _addInputErrorClass(titleText);
                errorExist = true;
            }
            
            (function(){
                var limitCharCntMap = {
                    "title_text" : 50,
                    "text" : 2000,
                    "note_text" : 2000
                };
                $(["title_text", "text","note_text"]).each(function(i, v){
                    var o = that.find("." + v);
                    if(!_checkTextLength($.trim(o.val()), limitCharCntMap[v])){
                        _addInputErrorClass(o);
                        errorExist = true;
                    }
                });
            })();
            
            that.find(".param_name_text").each(function(i, v){
                    if(!_checkTextLength($.trim($(v).val()), 30)){
                        _addInputErrorClass($(v));
                        errorExist = true;
                    }
            });
            
            
            if(errorExist){
                return false;
            }
            
            that.trigger("onsave");

            return false;
            
            function _checkTextLength(txt, len){
                return txt.length <= len;
            }
            
            function _addInputErrorClass(target){
                target.addClass("input_error");
                target.focus();
                setTimeout(function(){
                    target.removeClass("input_error");
                }, 3000)
            }
        }        
        
        
    }

})(jQuery);