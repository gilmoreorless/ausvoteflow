/* global d3 */
(function (exports) {
    exports.utils = {
        toElem(elem) {
            if (elem instanceof Element) {
                return elem;
            }
            if (typeof elem === 'string') {
                return document.querySelector(elem);
            }
            return document;
        }
    };

    d3.selection.prototype.translate = function (x, y) {
        x = d3.functor(x);
        y = d3.functor(y);
        return this.attr('transform', (...args) => `translate(${x(...args)}, ${y(...args)})`);
    };
})(this);
