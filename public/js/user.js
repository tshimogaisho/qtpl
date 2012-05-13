/* Author: T.Gaisho
*/
$(function(){
	var treecontainer  = $("#tree-container").treewrapper();
	
	treecontainer.on("select_file.treewrapper", function(a1, a2){
			console.log("select_file");
		})
		.on("file_created.treewrapper", function(a1, a2){
			console.log("file_created");
		})
		.on("node_changed.treewrapper", function(e, data){
			console.log(JSON.stringify(treecontainer.treewrapper("getjson")));
		})
		;
	var view1 = $("#tpl-view").tmpl(["test"]);
	$("#tpl-container").append(view1);
	view1.css({top: 0, left: 0, position: "absolute"});
	view1.tplview({
	    title : "title1",
	    text : "内容	ビジネスメールコミュニケーション講座 \n日時	2012年5月15日 \n場所	東京国際フォーラム対象	新入社員もしくは研修担当者\n参加費	8,400円",
	     note : "As you can see we also provided a third method option, which determines what type of request is used to retrieve the page and how the data is in turn sent. This can be two possible values: 'GET' or 'POST'.<br><br>And there we have it, that's how you retrieve dynamic content for your tooltips. For more information on the options used above, refer back to the Content option documentation.",
	    paramNames :  ["param1", "param2", "param3"],
	    paramValSets : [
	        {
	            id : 1,
	            name : "Param Set 1",
	            params : [  "param1Val", "param2Val", "param3Val"]
	        },
	        {
	            id : 2,
	            name : "Param Set 2",
	            params : [  "AAAAA", "BBBBB", "CCCCC"]

	        },       
	                ],
	    activeParamSetId : ""
	}).on("gotoedit.tplview", function(e, layout){
		var edit1 = $("#tpl-edit").tmpl([" "]);
		$("#tpl-container").append(edit1);
		edit1.tpledit(
			    {title: "title1", text: "text", note: "note", params: ["abc","def"],
			    	top: layout.top, left: layout.left,
			    	width: layout.width, height: layout.height });
//		edit1.css("position", "absolute");

		$("#tpl-container").draggableWrapper();

	});
	
	var view2 = $("#tpl-view").tmpl(["test"]);
	$("#tpl-container").append(view2);
	view2.css({top: 0, left: 420, position: "absolute"});
	view2.tplview({
	    title : "title2",
	    text : "ああああああああああああ",
	     note : "As you can see we also provided a third method option, which determines what type of request is used to retrieve the page and how the data is in turn sent. This can be two possible values: 'GET' or 'POST'.<br><br>And there we have it, that's how you retrieve dynamic content for your tooltips. For more information on the options used above, refer back to the Content option documentation.",
	    paramNames :  ["param1", "param2", "param3"],
	    paramValSets : [
	        {
	            id : 1,
	            name : "Param Set 1",
	            params : [  "param1Val", "param2Val", "param3Val"]
	        },
	        {
	            id : 2,
	            name : "Param Set 2",
	            params : [  "AAAAA", "BBBBB", "CCCCC"]

	        },       
	                ],
	    activeParamSetId : ""
	});	
	
	
	$("#tpl-container").draggableWrapper();

	        	
	
	
	
	
	
	
});

