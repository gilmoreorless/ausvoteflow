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
    d3.transition.prototype.translate = function (x, y, unit) {
        x = d3.functor(x);
        y = d3.functor(y);
        let getTranslate = function (...args) {
            let tx = x.apply(this, args);
            let ty = y.apply(this, args);
            return `translate(${tx}, ${ty})`;
        };
        let isSVG = !!this.node().ownerSVGDocument;

        if (isSVG) {
            return this.attr('transform', getTranslate);
        } else {
            unit = unit || 'px';
            let wrap = fn => function (...args) {
                let result = fn.apply(this, args);
                return reHasUnit.test(result) ? result : result + unit;
            };
            x = wrap(x);
            y = wrap(y);
            if (this.styleTween) {
                // A custom style tween to use the element's defined transform style,
                // rather than the computed matrix() value.
                return this.styleTween('transform', function (d, i, a) {
                    return d3.interpolate(this.style.transform || a, getTranslate.call(this, d, i));
                });
            } else {
                return this.style('transform', getTranslate);
            }
        }
    };
})(this);
