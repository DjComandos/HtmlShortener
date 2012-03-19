(function ($) {
    $.fn.shorten = function (userSettings) {

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

                function isInside($main) {
                    return ($main.width() < width || width === undefined)
                            && ($main.height() < height || height === undefined);
                }

                function insertThreeDotsIfNeed($main) {
                    if (insertThreeDots) {
                        $main.append('<span class="threeDots">...</span>');
                    }
                }

                function normalizeLastNode($main, currentNode, currentNodeValue) {
                    var previousValue = "";
                    for (var j = 0; j < currentNodeValue.length; j++) {
                        previousValue = currentNode.nodeValue;
                        currentNode.nodeValue = currentNodeValue.substring(0, j + 1);
                        if (!isInside($main)) {
                            currentNode.nodeValue = previousValue;
                            return true;
                        }
                    }
                    return false;
                }

                return {
                    normalizeLastNode: normalizeLastNode,
                    isInside: isInside,
                    insertThreeDotsIfNeed: insertThreeDotsIfNeed
                };
            })(settings);

        $.each(this, function (i, self) {
            var self = $(self),
                ready = false,
                nodeNumber = 0,
                $main = $(mainMarkup);


            function walkTroughDom(node) {
                for (var i = node.childNodes.length - 1; i >= 0; i--) {
                    if (!ready) {
                        var currentNode = node.childNodes[i];
                        if (currentNode.nodeType === nodeTypes.TEXT_NODE) {
                            if (nodeNumber != 0 || !settings.insertThreeDots) {
                                var currentNodeValue = currentNode.nodeValue;
                                currentNode.nodeValue = "";
                                if (shortenHelper.isInside($main)) {
                                    ready = shortenHelper.normalizeLastNode($main, currentNode, currentNodeValue);
                                }
                            }
                        } else if (currentNode.nodeType === nodeTypes.ELEMENT_NODE) {
                            walkTroughDom(currentNode);
                        }
                        nodeNumber++;
                    } else {
                        return;
                    }
                }
            }

            // wrap container
            if (settings.height === undefined) {
                $main.append(self.html());
                self.html($main);
            } else {
                $main = $(self);
            }

            if (!shortenHelper.isInside($main)) {
                shortenHelper.insertThreeDotsIfNeed($main);
                walkTroughDom(self[0]);
            }

            // remove wrapper
            if (settings.height === undefined) {
                self.html($main.html());
            }
        });
    };
})(jQuery);