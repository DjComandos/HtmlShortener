(function($) {
    $.fn.shorten = function(width, insertThreeDots) {
        $.each(this, function(i, self) {
            var self = $(self),
                ready = false,
                nodeNumber = 0,
                main = $('<div style="white-space: nowrap;display: inline; position: absolute"></div>');

            function isInside() {
                return main.width() < width;
            }

            function normalizeLastNode(cur, v) {
                var prev = "";
                for (var j = 0; j < cur.length; j++) {
                    prev = v.nodeValue;
                    v.nodeValue = cur.substring(0, j + 1);
                    if (main.width() > width) {
                        v.nodeValue = prev;
                        ready = true;
                        return;
                    }
                }
            }

            function walkTroughDom(node) {
                for (var i = node.childNodes.length - 1; i >= 0; i--) {
                    if (!ready) {
                        var v = node.childNodes[i];
                        if (v.nodeType === 3) {
                            if (nodeNumber != 0 || !insertThreeDots) {
                                var cur = v.nodeValue;
                                v.nodeValue = "";
                                if (isInside()) {
                                    normalizeLastNode(cur, v);
                                }
                            }
                        } else if (v.nodeType === 1) {
                            walkTroughDom(v);
                        }
                        nodeNumber++;
                    } else {
                        return;
                    }
                }
            }

            main.append(self.html());
            self.html(main);

            if (main.width() > width) {
                if (insertThreeDots) {
                    main.append('<span class="threeDots">...</span>');
                }
                walkTroughDom(self[0]);
            }

            self.html(main.html());
        });
    };
})(jQuery);