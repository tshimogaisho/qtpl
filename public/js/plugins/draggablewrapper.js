(function(jQuery) {
jQuery.fn.draggableWrapper = function(){
	var that = this;

    this.find(".draggable").draggable(
        {
            containment: "parent",
            cancel: "pre,:input",
            zIndex: 10,
    //        cursor: "move",
    //        distance: 10,
    //        grid: [5, 5],
    //        helper: "clone",
            opacity: 0.5,
    //        revert: true,
            scroll: true,
            scrollSensitivity: 20,
            scrollSpeed: 100
        }
    ).on("dragstart", function(event, ui){

    }).on("dragstop", function(event, ui){

        var target = ui.helper;
        var positionConflicts = $.checkPositionIsConflict(
	            target.position(), 
	            {width: target.width(), height: target.height()},
	            target.siblings(".draggable")
        );

        //ポジションが重なっていたら元のポジションに戻す
        if(positionConflicts){
            target.css({left:ui.originalPosition.left, top:ui.originalPosition.top});
        }
    });
    
    return this;


};
})(jQuery);