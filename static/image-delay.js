/**
 (c) Sneezry, 2015
 MIT License

 lizhe@lizhe.org
**/

(function(window, undefined) {
'use strict';

var isDelayStart = false, startCount = 0;

var timeout = document.getElementsByTagName('html')[0].getAttribute('data-delay-timeout');

var batch = document.getElementsByTagName('html')[0].getAttribute('data-delay-batch');

timeout = (!timeout || isNaN(timeout)) ? 10 : Number(timeout);

var getBgImageUrl = function(element) {
    var bgImageRawCss = getComputedStyle(element, null).getPropertyValue('background-image'),
        bgImageRawCssURL = bgImageRawCss.match(/^\s*\-webkit\-image\-set\((.*?)\)\s*$/),
        i, bgImageURL, dpr = 1;

    bgImageRawCssURL = (bgImageRawCssURL ? bgImageRawCssURL[1] : bgImageRawCss).split(',');

    for (i = 0; i < bgImageRawCssURL.length; i++) {
        if (bgImageRawCssURL[i].match(/1x\s*$/) && dpr === 1) {
            bgImageURL = bgImageRawCssURL[i].match(/url\([\s"']*(.*?)[\s"']*\)/);
        }

        if (bgImageRawCssURL[i].match(/2x\s*$/) && window.devicePixelRatio > 1 && dpr < 2) {
            dpr = 2;
            bgImageURL = bgImageRawCssURL[i].match(/url\([\s"']*(.*?)[\s"']*\)/);
        }

        if (bgImageRawCssURL[i].match(/3x\s*$/) && window.devicePixelRatio > 2 && dpr < 3) {
            dpr = 3;
            bgImageURL = bgImageRawCssURL[i].match(/url\([\s"']*(.*?)[\s"']*\)/);
        }
    }

    if (!bgImageURL) {
        bgImageURL = bgImageRawCssURL[0].match(/url\([\s"']*(.*?)[\s"']*\)/);
    }

    return bgImageURL ? bgImageURL[1] : null;
};

var listenBgLoaded = function(element, callback) {
    var src, isLoaded = false,
        timeout = element.getAttribute('data-image-delay-wait'),
        img = document.createElement('img');

    timeout = (!timeout || isNaN(timeout)) ? 5 : Number(timeout);

    element.removeAttribute('data-delay-index');
    src = getBgImageUrl(element);

    img.src = src;
    img.onload = function() {
        if (!isLoaded) {
            isLoaded = true;
            element.removeAttribute('data-image-delay-wait');
            callback();
        }
    };

    img.onerror = function() {
        if (!isLoaded) {
            isLoaded = true;
            element.removeAttribute('data-image-delay-wait');
            element.setAttribute('data-image-delay-error', 'true');
            callback();
        }
    };

    setTimeout(function() {
        if (!isLoaded) {
            isLoaded = true;
            element.removeAttribute('data-image-delay-wait');
            callback();
        }
    }, timeout * 1000);
};

var listenLoaded = function(element, callback) {
    if (element.getAttribute('data-delay-src') || element.getAttribute('data-delay-setsrc')) {
        var setsrc, src, isLoaded = false,
            timeout = element.getAttribute('data-image-delay-wait');

        timeout = (!timeout || isNaN(timeout)) ? 5 : Number(timeout);

        if (setsrc = element.getAttribute('data-delay-setsrc')) {
            element.setsrc = setsrc;
        }

        if (src = element.getAttribute('data-delay-src')) {
            element.src = src;
        }

        element.onload = function() {
            if (!isLoaded) {
                isLoaded = true;
                element.removeAttribute('data-image-delay-wait');
                callback();
            }
        };

        element.onerror = function() {
            if (!isLoaded) {
                isLoaded = true;
                element.removeAttribute('data-image-delay-wait');
                element.setAttribute('data-image-delay-error', 'true');
                callback();
            }
        };

        setTimeout(function() {
            if (!isLoaded) {
                isLoaded = true;
                element.removeAttribute('data-image-delay-wait');
                callback();
            }
        }, timeout * 1000);
    } else {
        listenBgLoaded(element, callback);
    }
};

var groupNSortDelayList = function(list) {
    var groups = {};
    list.forEach( function(o)
    {
        var group = o.getAttribute('data-delay-index');
        groups[group] = groups[group] || [];
        groups[group].push(o);
    });
    
    return Object.keys(groups).sort(function (a, b) {
        return a - b;
    }).map( function( group ) {
        return groups[group];
    });
};

var loadQueue = function(sortList, index) {
    index = index || 0;

    if (index >= sortList.length) {
        document.getElementsByTagName('html')[0].setAttribute('data-delay-end', 'true');
        document.getElementsByTagName('html')[0].removeAttribute('data-delay-batch');
        isDelayStart = false;
        startCount = 0;
        return;
    }

    var i, loadedLen = 0;
    for (i = 0; i < sortList[index].length; i++) {
        sortList[index][i].removeAttribute('data-delay-index');
        sortList[index][i].setAttribute('data-delay-start', 'true');
        listenLoaded(sortList[index][i], function() {
            loadedLen++;
            if (loadedLen === sortList[index].length) {
                loadQueue(sortList, index + 1);
            }
        });
    }
};

var delayStart = function() {
    var num, len, src, setsrc, batchUnitNum = 0, batchUnit = [], sortList = [], indexList = [], allElements = document.all;

    document.getElementsByTagName('html')[0].setAttribute('data-delay-start', 'true');

    for (num = 0, len = allElements.length; num < len; num++) {
        if (allElements[num].getAttribute('ng-delay-src') && !allElements[num].getAttribute('data-delay-src') && startCount < 10) {
            setTimeout(delayStart, 500);
            startCount++;
            return;
        }
    }

    if (isDelayStart) {
        return;
    } else {
        isDelayStart = true;
    }

    if (batch && !isNaN(batch) && Number(batch) > 0) {
        batch = Number(batch);
        for (num = 0, len = allElements.length; num < len; num++) {
            if (allElements[num].getAttribute('data-delay-src') || 
                allElements[num].getAttribute('data-delay-setsrc') || 
                allElements[num].getAttribute('data-image-delay') !== null ||
                allElements[num].getAttribute('data-image-delay-wait') !== null) {
                batchUnit.push(allElements[num]);
                batchUnitNum++;
                if (batchUnitNum % batch === 0) {
                    sortList.push(batchUnit);
                    batchUnit = [];
                    batchUnitNum = 0;
                }
            }
        }
        if (batchUnit.length > 0) {
            sortList.push(batchUnit);
        }
    } else {
        for (num = 0, len = allElements.length; num < len; num++) {
            if ((allElements[num].getAttribute('data-delay-src') || 
                allElements[num].getAttribute('data-delay-setsrc') || 
                allElements[num].getAttribute('data-image-delay') !== null ||
                allElements[num].getAttribute('data-image-delay-wait') !== null) &&
                !allElements[num].getAttribute('data-delay-index')) {
                var index, parent = allElements[num].parentNode;

                while(parent && parent.getAttribute) {
                    if (index = parent.getAttribute('data-delay-index')) {
                        allElements[num].setAttribute('data-delay-index', index);
                        break;
                    }

                    parent = parent.parentNode;
                }
            }
        }

        for (num = 0, len = allElements.length; num < len; num++) {
            if (allElements[num].getAttribute('data-delay-src') === null &&
                allElements[num].getAttribute('data-delay-setsrc') === null &&
                allElements[num].getAttribute('data-image-delay') === null &&
                allElements[num].getAttribute('data-image-delay-wait') === null &&
                allElements[num].getAttribute('data-delay-index')) {
                
                allElements[num].removeAttribute('data-delay-index');
            }
        }

        for (num = 0, len = allElements.length; num < len; num++) {
            if ((allElements[num].getAttribute('data-image-delay') !== null ||
                allElements[num].getAttribute('data-delay-src')) &&
                (!allElements[num].getAttribute('data-delay-index') ||
                isNaN(allElements[num].getAttribute('data-delay-index')))) {

                sortList.push(allElements[num]);
            } else if (allElements[num].getAttribute('data-delay-index') &&
                !isNaN(allElements[num].getAttribute('data-delay-index')) &&
                (allElements[num].getAttribute('data-image-delay') !== null ||
                allElements[num].getAttribute('data-image-delay-wait') !== null ||
                allElements[num].getAttribute('data-delay-src') ||
                allElements[num].getAttribute('data-delay-setsrc'))) {

                indexList.push(allElements[num]);
            }
        }

        if (sortList.length > 0 && indexList.length > 0) {
            sortList = [sortList].concat(groupNSortDelayList(indexList));
        } else if (sortList.length > 0) {
            sortList = [sortList];
        } else if (indexList.length > 0) {
            sortList = groupNSortDelayList(indexList);
        }
    }

    if (sortList.length > 0) {
        loadQueue(sortList);
    }
};

var delayInit = function() {
    document.getElementsByTagName('html')[0].removeAttribute('data-delay-start');
    document.getElementsByTagName('html')[0].removeAttribute('data-delay-end');

    if (batch) {
        document.getElementsByTagName('html')[0].setAttribute('data-delay-batch', batch);
    }
};

if (document.getElementsByTagName('html')[0].getAttribute('data-delay-passive') === null) {
    window.onload = function() {
        setTimeout(delayStart, 0);
    };

    setTimeout(delayStart, timeout * 1000);
}

window.imageDelayStart = delayStart;
window.imageDelayInit = delayInit;

})(window);
