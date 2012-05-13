(function(jQuery) {
jQuery.fn.draggableWrapper = function(){        
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
    
        var positionConflicts = _checkPositionIsConflict(
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
    
    function _checkPositionIsConflict(position, size, targets){
        var cornerPositions = _getCornerPositions(position.left, position.top,
                                                size.width, size.height);
        var conflict = false;
        jQuery(targets).each(function(i, v){
            var targetPosition = jQuery(v).position();
            var targetCornerPositions = _getCornerPositions(
                targetPosition.left, targetPosition.top,
                jQuery(v).width(), jQuery(v).height());
            
            
            jQuery(cornerPositions).each(function(j, o){
                if(o.left >= targetCornerPositions[0].left - 5
                       && o.left <= targetCornerPositions[1].left + 5
                       && o.top >= targetCornerPositions[0].top - 5
                       && o.top <= targetCornerPositions[2].top + 5
                        ){
                    conflict = true;
                }else{
                }
                
            });
            
        });
//        console.log("return conflict", conflict);
        return conflict;
    }
    
    /**
     * コーナー4つのポジションを取得
     **/
    function _getCornerPositions(left, top, width, height){
        var obj = [];
        obj.push({left: left, top: top}); //左上
        obj.push({left: left + width, top: top}); //右上
        obj.push({left: left, top: top + height}); //左下
        obj.push({left: left + width, top: top + height}); //右下
        return obj;
    };        

};
})(jQuery);