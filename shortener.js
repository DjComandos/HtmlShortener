(function ($) {
    /*
    *@author: Mikita Manko
    *@mail: DjComandos@gmail.com 
    */
    $.fn.shorten = function (userSettings) {
        // 1) If you will specify only "width" setting - will be used one-line mode: result will be one line no longer then "width";
        // 2) If you will specify height setting - will be used multiline mode
        var settings = $.extend({ width: undefined, height: undefined, insertThreeDots: true }, userSettings),
            mainMarkup = '<div class="shortenerMain" style="white-space: nowrap;display: inline; position: absolute"></div>',
            nodeTypes = {
                ELEMENT_NODE: 1,
                TEXT_NODE: 3
            },
            shortenHelper = (function (s) {
                var width = s.width,
                    height = s.height,
                    insertThreeDots = s.insertThreeDots;

                function isInsideBounds($main) {
                    return ($main.width() < width || width === undefined) && ($main.height() < height || height === undefined);
                }

                function insertThreeDotsIfNeed($main) {
                    if (insertThreeDots) {
                        $main.append('<span class="threeDots">...</span>');
                    }
                }

                // this function should be called when Main element is smaller then Max bounds.
                // So it is need to make it a little bit bigger: let's add text (symbol by symbol) from last removed node until Main element will fit Max bounds. 
                function normalizeLastNode($main, currentNode, currentNodeValue) {
                    var previousValue = "";
                    for (var j = 0; j < currentNodeValue.length; j++) {
                        previousValue = currentNode.nodeValue;
                        currentNode.nodeValue = currentNodeValue.substring(0, j + 1);
                        if (!isInsideBounds($main)) {
                            currentNode.nodeValue = previousValue;
                            return true;
                        }
                    }
                    return false;
                }

                // Walk through the DOM (from the last node to the first one) and on each iteration make:
                // - remove node's value
                // - check if Main element fits Max bounds - then it was last iteration, and it is need to normalize last processed node
                function walkTroughDom($main, node) {
                    var nodeNumber = 0,
                        walkTroughDomInner = function (node) {
                            for (var i = node.childNodes.length - 1; i >= 0; i--) {
                                var currentNode = node.childNodes[i];

                                if (currentNode.nodeType === nodeTypes.TEXT_NODE) {
                                    if (nodeNumber != 0 || !settings.insertThreeDots) {
                                        var currentNodeValue = currentNode.nodeValue;
                                        currentNode.nodeValue = "";

                                        if (shortenHelper.isInsideBounds($main)) {
                                            return shortenHelper.normalizeLastNode($main, currentNode, currentNodeValue);
                                        }
                                    }
                                } else if (currentNode.nodeType === nodeTypes.ELEMENT_NODE) {
                                    nodeNumber++;
                                    walkTroughDomInner(currentNode);
                                }
                            }
                        };
                    walkTroughDomInner(node, 0);
                }

                return {
                    normalizeLastNode: normalizeLastNode,
                    isInsideBounds: isInsideBounds,
                    insertThreeDotsIfNeed: insertThreeDotsIfNeed,
                    walkTroughDom: walkTroughDom
                };
            })(settings);

        $.each(this, function (i, self) {
            var $self = $(self),
                $main = $(mainMarkup);

            // wrap container (in case of one-line mode) - wrapper will make all text in one line
            if (settings.height === undefined) {
                $main.append($self.html());
                $self.html($main);
            } else {
                $main = $($self);
            }

            // run shortener if needed
            if (!shortenHelper.isInsideBounds($main)) {
                shortenHelper.insertThreeDotsIfNeed($main);
                shortenHelper.walkTroughDom($main, $self[0]);
            }

            // remove wrapper (in case of one-line mode)
            if (settings.height === undefined) {
                $self.html($main.html());
            }
        });
    };
})(jQuery);