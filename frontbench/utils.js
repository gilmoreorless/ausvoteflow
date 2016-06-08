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
        },

        clamp(num, min, max) {
            return Math.min(Math.max(num, min), max);
        }
    };

    var reHasUnit = /\D$/;

    d3.selection.prototype.translate =
    d3.transition.prototype.translate = function (x, y) {
        x = d3.functor(x);
        y = d3.functor(y);
        let getTranslate = (...args) => `translate(${x(...args)}, ${y(...args)})`;
        let isSVG = !!this.node().ownerSVGDocument;
        if (isSVG) {
            return this.attr('transform', getTranslate);
        } else {
            let wrap = fn => (...args) => {
                let result = fn(...args);
                return result === 0 || reHasUnit.test(result) ? result : result + 'px';
            };
            x = wrap(x);
            y = wrap(y);
            if (this.styleTween) {
                // A custom style tween to use the element's defined transform style,
                // rather than the computed matrix() value.
                return this.styleTween('transform', function (d, i, a) {
                    return d3.interpolate(this.style.transform || a, getTranslate(d, i));
                });
            } else {
                return this.style('transform', getTranslate);
            }
        }
    };
})(this);
