/* Author: T.Gaisho
*/
$(function(){

	var userid = qtpl.userid;
	
	var treecontainer  = $("#tree-container").treewrapper({
		initialJsonDataUrl : _.str.sprintf("/%s/tree", userid)
	});

	treecontainer.on("select_file.treewrapper", function(e, data){
		
		$.ajax({
			type : "GET",
			url:  _.str.sprintf("/%s/tpl/%s", userid, data.nid),
			async: true,
			contentType : "application/json; charset=utf-8",
			success : function(data, dataType){
				if(!data){ console.error("error."); return; }
				
				_createTplView(data);
			},
			error : function(xhr){
				console.log("http request failure.");
			}
		});
		
	})
	.on("file_created.treewrapper", function(e, data){
		var nid = $(data).attr("nid");
		createTplEdit({nid: nid, title: data.newname}, function(edit){
			console.log("edit.save");
			edit.save();
		});
		
	})
	.on("file_removed.treewrapper", function(e, data){
		var nid = data.nid;
		$.ajax({
			type : "DELETE",
			url : _.str.sprintf("/%s/tpl/%s", userid, nid),
			async: false,
			contentType : "application/json; charset=utf-8",
			success : function(){},
			error : function(xhr){
				console.log("http request failure.");
			}
		});
		$("#tpl-container").find(_.str.sprintf("[nid='%s']", nid)).remove();
		
	})
	.on("node_changed.treewrapper", function(e, data){
		var jsonstring = JSON.stringify(treecontainer.treewrapper("getjson"));
		$.ajax({
			type : "PUT",
			url:  _.str.sprintf("/%s/tree", userid),
			async: true,
			contentType : "application/json; charset=utf-8",
			data : jsonstring,
			success : function(){console.log("tree is updated.")},
			error : function(xhr){
				console.log("http request failure.");
			}
		});
		
	});
	
	function _createTplView(option){
		
		console.log("_createTplView:" , option);
		
		var newview = $("#tpl-view").tmpl(["test"]);
		newview.css({top: 0, left: 0, position: "absolute"});
		newview.tplview($.extend(option, {}))
			.on("paramset_save.tplview", function(e, data){
				console.log("paramset_save");

			})
			.on("paramset_rename.tplview", function(e, data){
				console.log("paramset_rename");
			})			
			.on("gotoedit.tplview", function(e, layout){
				
				//data get
				$.ajax({
					type : "GET",
					url:  _.str.sprintf("/%s/tpl/%s", userid, option.nid),
					async: true,
					contentType : "application/json; charset=utf-8",
					success : function(data, dataType){
						if(!data){ console.error("error."); return; }
						createTplEdit($.extend( data, layout ));
						newview.remove();
					},
					error : function(xhr){
						console.log("http request failure.");
					}
				});
			});
		$("#tpl-container").append(newview);
		$("#tpl-container").draggableWrapper();
		return newview;
	}

	//new
	function createTplEdit(data, procAfterCreated){
		var edit = $("#tpl-edit").tmpl([" "]);
		$("#tpl-container").append(edit);
		edit.css("position", "absolute");
		edit.tpledit(
				$.extend(data, 
					{
						onsave: function(data){
							console.log("put tpl data.");
							$.ajax({
								type : "PUT",
								url : _.str.sprintf("/%s/tpl/%s", userid, data.nid),
								async: true,
								contentType : "application/json; charset=utf-8",
								data : JSON.stringify(data),
								success : function(){console.log("put request end.");},
								error : function(xhr){
									console.log("http request failure.");
								}
							});
						},
						
						oncancel: function(data){
							
						}
					}
				)
			);
		
		if(procAfterCreated){
			console.log("propAfterCreated.");
			procAfterCreated(edit);
		}
		
		edit.on("onsaved.tpledit", function(e, data){
			treecontainer.treewrapper("renameNode", data.nid, data.title);
			_createTplView(data);
			edit.tpledit("removeTplEdit");
		});
		
		edit.on("oncancel.tpledit", function(e, data){
			_createTplView(data);
			edit.tpledit("removeTplEdit");
		});
		
		
		$("#tpl-container").draggableWrapper();
		edit.find(".text").focus();

	}

	
	function _onsavedInTplEdit(e, data){
		console.log("_onsavedInTplEdit");
		treecontainer.treewrapper("renameNode", nid, data.title);
		_createTplView(data);
		
	}	
	
		
//	var view1 = $("#tpl-view").tmpl(["test"]);
//	$("#tpl-container").append(view1);
//	view1.css({top: 0, left: 0, position: "absolute"});
//	view1.tplview({
//	    title : "title1",
//	    text : "内容	ビジネスメールコミュニケーション講座 \n日時	2012年5月15日 \n場所	東京国際フォーラム対象	新入社員もしくは研修担当者\n参加費	8,400円",
//	     note : "As you can see we also provided a third method option, which determines what type of request is used to retrieve the page and how the data is in turn sent. This can be two possible values: 'GET' or 'POST'.<br><br>And there we have it, that's how you retrieve dynamic content for your tooltips. For more information on the options used above, refer back to the Content option documentation.",
//	    paramNames :  ["param1", "param2", "param3"],
//	    paramValSets : [
//	        {
//	            id : 1,
//	            name : "Param Set 1",
//	            params : [  "param1Val", "param2Val", "param3Val"]
//	        },
//	        {
//	            id : 2,
//	            name : "Param Set 2",
//	            params : [  "AAAAA", "BBBBB", "CCCCC"]
//
//	        },       
//	                ],
//	    activeParamSetId : ""
//	}).on("gotoedit.tplview", function(e, layout){
//		var edit1 = $("#tpl-edit").tmpl([" "]);
//		$("#tpl-container").append(edit1);
//		edit1.tpledit(
//			    {title: "title1", text: "text", note: "note", params: ["abc","def"],
//			    	top: layout.top, left: layout.left,
//			    	width: layout.width, height: layout.height });
////		edit1.css("position", "absolute");
//
//		$("#tpl-container").draggableWrapper();
//
//	});
//	
//	var view2 = $("#tpl-view").tmpl(["test"]);
//	$("#tpl-container").append(view2);
//	view2.css({top: 0, left: 420, position: "absolute"});
//	view2.tplview({
//	    title : "title2",
//	    text : "ああああああああああああ",
//	     note : "As you can see we also provided a third method option, which determines what type of request is used to retrieve the page and how the data is in turn sent. This can be two possible values: 'GET' or 'POST'.<br><br>And there we have it, that's how you retrieve dynamic content for your tooltips. For more information on the options used above, refer back to the Content option documentation.",
//	    params :  ["param1", "param2", "param3"],
//	    paramValSets : [
//	        {
//	            id : 1,
//	            name : "Param Set 1",
//	            params : [  "param1Val", "param2Val", "param3Val"]
//	        },
//	        {
//	            id : 2,
//	            name : "Param Set 2",
//	            params : [  "AAAAA", "BBBBB", "CCCCC"]
//
//	        },       
//	                ],
//	    activeParamSetIdx : ""
//	});	
//	
//	
//	$("#tpl-container").draggableWrapper();

	
});

