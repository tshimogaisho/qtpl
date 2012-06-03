/* Author: T.Gaisho
*/
$(function(){

	var userid = qtpl.userid;
	
	var treecontainer  = $("#tree-container").treewrapper({
		initialJsonDataUrl : _.str.sprintf("/%s/tree", userid)
	});
	

	
	treecontainer.on("select_file.treewrapper", function(e, data){
//			console.log("select_file", e, data);
		})
		.on("file_created.treewrapper", function(e, data){
			var nid = $(data).attr("nid");
			var newedit = _createNewTplEdit(nid, data.newname);
			newedit.save();
			
			$("#tpl-container").append(newedit);
			$("#tpl-container").draggableWrapper();
			
			newedit.find(".text").focus();
			
//			var newview = $("#tpl-view").tmpl(["newtpl"]);
//			newview.css({top: 0, left: 0, position: "absolute"});
//			$("#tpl-container").append(view1);
//			newview.tplview({
//			    title : "",
//			    text: "",
//			    note: ""	
//			}).on("gotoedit.tplview", function(e, layout){
//				var edit1 = $("#tpl-edit").tmpl([" "]);
//				$("#tpl-container").append(edit1);
//				edit1.tpledit(
//					    {title: "title1", text: "text", note: "note", params: ["abc","def"],
//					    	top: layout.top, left: layout.left,
//					    	width: layout.width, height: layout.height });
//	//			edit1.css("position", "absolute");
//		
//				$("#tpl-container").draggableWrapper();
//		
//			});			
//			$("#tpl-container").draggableWrapper();
			
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
	
	function _createNewTplEdit(nid, title){
		var edit = $("#tpl-edit").tmpl([" "]);
		edit.css("position", "absolute");
		
		edit.on("onsaved.tpledit", function(e, data){
			//rename node in tree
			treecontainer.treewrapper("renameNode", nid, data.title_text);
			
			
		});
		
		edit.tpledit({nid: nid ,title: title, onsave: function(data){
			
				console.log("put request start");
				$.ajax({
					type : "PUT",
					url : _.str.sprintf("/%s/tpl/%s", userid, nid),
					async: true,
					contentType : "application/json; charset=utf-8",
					data : JSON.stringify(data),
					success : function(){console.log("put request end.");},
					error : function(xhr){
						console.log("http request failure.");
					}
				});
			}
		});
		

		
		return edit;
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
//	});	
//	
//	
//	$("#tpl-container").draggableWrapper();

	
});

