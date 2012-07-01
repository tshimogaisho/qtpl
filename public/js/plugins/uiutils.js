(function(jQuery){
	jQuery.extend({
	    checkPositionIsConflict : function(position, size, targets){
	        var cornerPositions = _getCornerPositions(position.left, position.top,
	                size.width, size.height);
			var conflict = false;
			jQuery(targets).each(function(i, v){
				var targetPosition = jQuery(v).position();
				var targetCornerPositions = _getCornerPositions(
				targetPosition.left, targetPosition.top,
				jQuery(v).width(), jQuery(v).height());
				
				var conflictA = _calcPositionIsConflict(cornerPositions, targetCornerPositions);
				var conflictB = _calcPositionIsConflict(targetCornerPositions, cornerPositions);
				
				if(conflictA || conflictB){
					conflict = true;
				}
			});
			
			return conflict;
				
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
		    function _calcPositionIsConflict(corners1, corners2){
		    			    	
		    	var conflict = false;
		    	$(corners1).each(function(i,o){
		        	var isContainedHorizontal 
		    			= ( o.left >= corners2[0].left - 5 
		    				&& o.left <= corners2[1].left + 5 );
		        	var isContainedVertical
		    			= ( o.top >= corners2[0].top - 5
		    				&& o.top <= corners2[2].top + 5 );

			        if(isContainedHorizontal && isContainedVertical){
			        	 conflict = true;
			        }
		    	});
		    	return conflict;
		    }
	    }
	});	

})(jQuery);




