/* Author: T.Gaisho
*/
(function(jQuery){
jQuery.fn.treewrapper = function(method){
	var that = this;
	
	var eventSuffix = ".treewrapper";
	
	var methods = {
		init : init,
		getjson : getjson,
		renameNode : renameNode
	};
	
	if( methods[method] ){
		return methods[method].apply( this, Array.prototype.slice.call( arguments, 1));
	}else if( typeof method === 'object' || !method ){
		return methods.init.apply( this, arguments );
	}else{
		jQuery.error( 'Method ' + method+ ' does not exist.' );
	}
	
	function getjson(){
		return that.jstree( "get_json", -1, ["id", "class", "nid"] );
	}
	
	function renameNode(nid, titleText){
		that.jstree("rename_node", that.find("[nid='"+ nid +"']"), titleText);
	}
	
	function init(options){
		
		var defaults = {
				searchtext: jQuery("#search-text"),
				initialJsonDataUrl: ""
		};
		var settings = jQuery.extend({}, defaults, options);
		var searchtext = settings.searchtext;
		

		searchtext.bind("textchange", function(){
			that.jstree("search", searchtext.val());
		});
		
		jQuery.jstree.defaults.contextmenu = {select_node : false, show_at_node : true, items : {} };

		createJsTree();
		setEvents();
		
		return this;
		
		function setEvents(){
			that.on("select_node.jstree", function(e, data){
				var parentli = $(data.args[0]).parent();
				that.trigger("select_" + _getNodeType(parentli) + eventSuffix, parentli);
			});
			that.on("node_created.jstree", function(e, data){
				that.trigger( _getNodeType(data) +"_created" + eventSuffix, data);
			});
			
			that.on("remove.jstree", function(e, data){
				that.trigger( _getNodeType(data) +"_removed" + eventSuffix, 
						{ nid: $(data.rslt.obj[0]).attr("nid") } );
			});
			
			var eventNames = 
				["remove.jstree",  "rename.jstree", "rename_node.jstree",
				 "node_created.jstree", "move_node.jstree"];
			console.log("eventNames: ", eventNames.join(" "));
			that.on(eventNames.join(" "), function(e, data){
				console.log(e);
				that.trigger( "node_changed" + eventSuffix, data);
			});
		}
		
		//return node type (file|folder|root)
		function _getNodeType(liElement){
			var rel = $(liElement).attr("rel");
			if(!rel || rel === "default") rel = "file";
			return rel;
		}
		
		function _getMaxNid(target){
			var returnid = -1;
			target.find("li[nid]").each(function(idx, v){
				var id = parseInt($(v).attr("nid"));
				if( id >= returnid) returnid = id;
			});
			return returnid;
		}
		
		function createJsTree(){
			return that.jstree({
				"plugins" : ["themes", "json_data","ui","crrm", "contextmenu",
				             "hotkeys", "json_data", "cookies", "search", "types", "dnd"],
				"core" : { 
					"html_titles" : false, 
					"initially_open" : [ "" ],
					"animation" : 200,
					"strings" : { loading : "Loading ...", new_node : "新規データ" }
				},
				"themes" : {
					"theme" : "apple",
					"dots" : false,
					"icons" : true
				},
				"json_data" : {
					"ajax" : {
						"url" : settings.initialJsonDataUrl,
					}
				},
				"dnd" : {
					"drop_target" : false,
					"drag_target" : false
				},
				"search" : {
					case_insensitive : false
				},
				"contextmenu" : {
					select_node : true,
					show_at_node : false,
					items : {
						"create_template" : {
							"separator_before"	: false,
							"label"				: "新規テンプレート",
							"action"			: function (obj) {
								this.create(obj, undefined, 
									{
										data: "新規テンプレート", 
										attr :{
										rel : "default",
										nid : _getMaxNid(that) + 1
									 }
									}
								);
								
							}
						},
						"create_folder" : {
							"separator_after"	: true,
							"label"				: "新規フォルダ",
							"action"			: function (obj) {this.create(obj, undefined, 
									{data: "新規フォルダ", attr :{rel : "folder"}}); }
						},					
						"rename" : {
							"separator_before"	: false,
							"separator_after"	: false,
							"label"				: "名前の変更",
							"action"			: function (obj) { this.rename(obj); }
						},
						"remove" : {
							"icon"				: false,
							"separator_after"	: false,
							"label"				: "削除",
							"action"			: function (obj) { if(this.is_selected(obj)) { this.remove(); } else { this.remove(obj); } }
						},
						"cut" : {
							"separator_before"	: true,
							"separator_after"	: false,
							"label"				: "カット",
							"action"			: function (obj) { this.cut(obj); }
						},
						"copy" : {
							"separator_before"	: false,
							"icon"				: false,
							"label"				: "コピー",
							"action"			: function (obj) { this.copy(obj); }
						},
						"paste" : {
							"separator_before"	: false,
							"icon"				: false,
							"label"				: "貼り付け",
							"action"			: function (obj) { this.paste(obj); }
						},
						"open_all" : {
							"separator_before"	: true,
							"icon"				: false,
							"label"				: "全て開く",
							"action"			: function (obj) { this.open_all(obj); }
						},
						"close_all" : {
							"icon"				: false,
							"label"				: "全て閉じる",
							"action"			: function (obj) { this.close_all(obj); }
						},					
						
					}
					
				},
				
				"types" : {
					// I set both options to -2, as I do not need depth and children count checking
					// Those two checks may slow jstree a lot, so use only when needed
					"max_depth" : 10,
					"max_children" : 500,
	/* 				"valid_children" : [ "root" ],
	 */				"types" : {
						"default" : {
							"valid_children" : "none",
							"icon" : {
								"image" : "/img/jstree/file.png"
							},
						},
						// The `folder` type
						"folder" : {
							// can have files and other folders inside of it, but NOT `drive` nodes
							"valid_children" : [ "folder", "default" ],
							"icon" : {
								"image" : "/img/jstree/folder_open.png"
							}
						},
						"root" : {
							"valid_children" : ["folder", "default"],
							"icon" : {
								"image" : "/img/jstree/folder.png"
							},
							// those prevent the functions with the same name to be used on `drive` nodes
							// internally the `before` event is used
							"start_drag" : false,
							"move_node" : false,
							"delete_node" : false,
							"remove" : false
						}
					}
				},			

			});
		}
		
		
		

		
	}

};
})(jQuery);




