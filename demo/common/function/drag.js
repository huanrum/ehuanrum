
window.$ehr('common.drag', [function () {
    return function drag(element, toParent) {
        var temp = {}, dragElement = element,canDrag = function(){return true;};
        if (element instanceof Array) {
            dragElement = element[1];
            element = element[0];
        }
        if (typeof toParent === 'function') {
            canDrag = toParent;
            toParent = null;
        }

        dragElement.addEventListener('mousedown', function (e) {
            var style = window.getComputedStyle(element);
            if (e.clientX < (parseInt(style.left) || 0) + (parseInt(style.width) || 0) - 15 ||
                e.clientY < (parseInt(style.top) || 0) + (parseInt(style.height) || 0) - 15) {
                mousedown(e);
            }
        });

        window.addEventListener('mouseup', function () {
            temp.e = null;
            element.style.cursor = 'default';
            Array.prototype.forEach.call(element.children, function (child) {
                child.style.cursor = element.style.cursor;
            });
            window.removeEventListener('mousemove', mousemove);
            if (toParent && toParent !== element.parentNode) {
                toParent.appendChild(element);
            }
            if (element.recycle && element.parentNode) {
                element.parentNode.removeChild(element);
            }
        });

        return function (e, recycle) {
            element.style.position = 'fixed';
            element.style.left =  e.clientX - 10 + 'px';
            element.style.top = e.clientY - 10 + 'px';
            mousedown(e);
            if (recycle) {
                window.addEventListener('mousemove', recycleOverlap);
            }
            function recycleOverlap() {
                if (!element.parentNode) {
                    window.removeEventListener('mousemove', recycleOverlap);
                }
                if(!temp.e){return;}
                element.recycle = overlap(element, recycle);
                element.style.cursor = element.recycle ? 'url(resource/delete.ico),move' : 'default';
                Array.prototype.forEach.call(element.children, function (child) {
                    child.style.cursor = element.style.cursor;
                });
            }
        };

        function overlap(element, recycle) {
            var containerRect = recycle.getBoundingClientRect();
            var selfRect = element.getBoundingClientRect();
            return !(beyond(containerRect.left, containerRect.right, selfRect.left) ||
                beyond(containerRect.left, containerRect.right, selfRect.right) ||
                beyond(containerRect.top, containerRect.bottom, selfRect.top) ||
                beyond(containerRect.top, containerRect.bottom, selfRect.bottom));

            function beyond(a, b, num) {
                return num < Math.min(a, b) || num > Math.max(a, b);
            }
        }

        function mousedown(e) {
            var style = window.getComputedStyle(element);
            temp.e = e;
            temp.x = e.clientX - (parseInt(style.left) || 0);
            temp.y = e.clientY - (parseInt(style.top) || 0);
            element.style.cursor = 'move';
            window.addEventListener('mousemove', mousemove);
        }
        function mousemove(e) {
            if(canDrag(e)){
                element.style.left = e.clientX - temp.x + 'px';
                element.style.top = e.clientY - temp.y + 'px';
            }
        }
    };
}]);