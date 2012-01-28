(function($) {
	$.fn.shorten = function(width, insertThreeDots) {
		var self = this;
		var ready = false;
		var nodeNumber = 0;
		var main = $('<div style="display: inline;position: absolute"></div>');
		
		main.append(self.html());
		self.html(main);
		
		if(main.width() > width) {
			walkTroughDom(self[0]);
		}
		
		self.html(main.html());
		
		function walkTroughDom(node) {
			for( var i = node.childNodes.length - 1; i >= 0; i--){
				if(!ready) {
					var v = node.childNodes[i];
					if(v.nodeType === 3) {
						if(!!insertThreeDots && nodeNumber == 0) {
							//rightmost node
							v.nodeValue = "...";
						} else {
							var cur = v.nodeValue;
							v.nodeValue = "";
							if(main.width() < width) {
								var prev = "";
								for(var j=0; j<cur.length; j++) {
									prev = v.nodeValue;
									v.nodeValue = cur.substring(0, j + 1);
									if(main.width() > width) {
										v.nodeValue = prev;
										ready = true;
										return;
									}
								}
							}
						}
					} else if(v.nodeType === 1){
						walkTroughDom(v);
					}
					nodeNumber++;
				} else {
					return;
				}
			}
		}
	};
})(jQuery);